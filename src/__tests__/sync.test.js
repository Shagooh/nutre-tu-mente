import { sincronizar, borrarNube } from '../sync';
import { relojBosque, diaConfirmado } from '../reloj-bosque';
import { aplicarSync } from '../fusion';
import { datosVacios } from '../store';
import { diaDelBosque, fechaConfirmada } from '../contrato-bosque';
import { proyectarRoble } from '../roble-mensual';
let mockDocs, mockPerderRespuesta, mockFallarLote;
let mockReloj = 0;
jest.mock('../firebase', () => ({ db: {} }));
jest.mock('firebase/firestore', () => {
  const snap = (ref) => ({ exists: () => mockDocs.has(ref), data: () => mockDocs.get(ref), ref });
  return {
    doc: (_db, ...p) => p.join('/'), collection: (_db, ...p) => p.join('/'),
    serverTimestamp: () => { const ms = Date.UTC(2026, 10, 11, 12) + ++mockReloj; return { toMillis: () => ms }; },
    getDoc: async (ref) => snap(ref),
    getDocs: async (ref) => {
      const docs = [...mockDocs.keys()].filter((key) => key.startsWith(ref + '/') && key.split('/').length === ref.split('/').length + 1).map((key) => ({ ...snap(key), id: key.split('/').pop() }));
      return { docs, forEach: (fn) => docs.forEach(fn) };
    },
    runTransaction: async (_db, fn) => {
      const cambios = [];
      const res = await fn({
        get: async (ref) => snap(ref),
        set: (ref, value) => cambios.push(() => mockDocs.set(ref, value)),
        update: (ref, value) => cambios.push(() => mockDocs.set(ref, { ...mockDocs.get(ref), ...value })),
        delete: (ref) => cambios.push(() => mockDocs.delete(ref)),
      });
      cambios.forEach((f) => f());
      if (mockPerderRespuesta && cambios.length && mockDocs.has('users/A/checkins/id1')) { mockPerderRespuesta = false; throw new Error('respuesta perdida'); }
      return res;
    },
    writeBatch: () => {
      const refs = [];
      return { delete: (ref) => refs.push(ref), commit: async () => {
        if (mockFallarLote === 0) { mockFallarLote = -1; throw new Error('lote'); }
        if (mockFallarLote > 0) mockFallarLote -= 1;
        refs.forEach((ref) => mockDocs.delete(ref));
      } };
    },
  };
});
beforeEach(() => {
  mockDocs = new Map([['syncControls/A', { estado: 'activo', generacion: 'g1', operacion: null }]]);
  mockReloj = 0;
  mockPerderRespuesta = false;
  mockFallarLote = -1;
  relojBosque.reiniciar();
  relojBosque.ajustar(Date.UTC(2026, 10, 11, 12));
});
const datos = () => ({ ...datosVacios(), cuentaUid: 'A', nubeGeneracion: 'g1', checkins: [{ id: 'id1', fecha: '2026-11-07', animo: 3 }] });
test('respuesta perdida se reintenta con mismo ID y timestamp, sin duplicar', async () => {
  mockPerderRespuesta = true;
  await expect(sincronizar('A', datos())).rejects.toThrow('respuesta perdida');
  const original = mockDocs.get('users/A/checkins/id1');
  const res = await sincronizar('A', datos());
  expect(mockDocs.get('users/A/checkins/id1')).toEqual(original);
  expect(res.remoto.checkins).toHaveLength(1);
  expect(res.subidos.checkins).toEqual(['id1']);
});
test('mismo ID y distinto contenido rechaza sin sobrescribir', async () => {
  await sincronizar('A', datos());
  const otro = datos();
  otro.checkins[0].animo = 5;
  await expect(sincronizar('A', otro)).rejects.toMatchObject({ code: 'sync/conflict' });
  expect(mockDocs.get('users/A/checkins/id1').animo).toBe(3);
});
test('perfil usa revisión remota, fusiona cambios disjuntos y rechaza mismo campo', async () => {
  const base = { nombre: 'A', estilo: 'calma' };
  mockDocs.set('users/A', { perfil: { ...base, estilo: 'autocuidado' }, revision: 8, lecciones: [], retornos: 0 });
  const d = { ...datos(), perfilBase: base, perfil: { ...base, nombre: 'B' }, perfilSucio: true, perfilActualizado: 'T', perfilOperacion: 'op' };
  await sincronizar('A', d);
  expect(mockDocs.get('users/A')).toMatchObject({ revision: 9, perfil: { nombre: 'B', estilo: 'autocuidado' } });
  const original = { ...mockDocs.get('users/A') };
  await sincronizar('A', d);
  expect(mockDocs.get('users/A')).toEqual(original);
  await expect(sincronizar('A', { ...d, perfil: { ...base, nombre: 'C' } })).rejects.toMatchObject({ code: 'sync/profile-conflict' });
});
test('borrado con fallo tras primer lote se reanuda, sin soltar barrera', async () => {
  for (let i = 0; i < 401; i++) mockDocs.set(`users/A/checkins/${i}`, { id: String(i) });
  const op = { id: 'borrar-1', generacion: 'g1' };
  mockFallarLote = 1;
  await expect(borrarNube('A', op)).rejects.toThrow('lote');
  expect(mockDocs.get('syncControls/A').estado).toBe('eliminando');
  expect([...mockDocs.keys()].filter((key) => key.startsWith('users/'))).toHaveLength(1);
  await expect(sincronizar('A', datos())).rejects.toMatchObject({ code: 'sync/deleting' });
  await borrarNube('A', op);
  expect(mockDocs.get('syncControls/A')).toMatchObject({ estado: 'borrado', operacion: op.id });
  await borrarNube('A', op);
  expect([...mockDocs.keys()].filter((key) => key.startsWith('users/'))).toHaveLength(0);
});
test('el sello del primer envío sobrevive al reintento sin cambiar el día capturado', async () => {
  const d = datos();
  Object.assign(d.checkins[0], relojBosque.capturar(), { fecha: '2040-05-03' });
  mockPerderRespuesta = true;
  await expect(sincronizar('A', d)).rejects.toThrow('respuesta perdida');
  const sello = mockDocs.get('users/A/checkins/id1').confirmadoEn.toMillis();
  relojBosque.reiniciar();
  const resultado = await sincronizar('A', d);
  for (const base of [d, { ...d, checkins: [] }]) {
    const [registro] = aplicarSync(base, resultado).checkins;
    expect(registro._confirmadoMs).toBe(sello);
    expect(diaConfirmado(registro)).toBe('2026-11-11');
    expect(diaDelBosque(registro)).toBe('2026-11-11');
  }
});
test('subir una captura de otra sesión conserva la fecha provisional', async () => {
  const d = datos();
  Object.assign(d.checkins[0], relojBosque.capturar(), { fecha: '2026-11-07', diaBosque: '2026-11-07' });
  relojBosque.reiniciar();
  const [registro] = aplicarSync(d, await sincronizar('A', d)).checkins;
  expect(registro.fecha).toBe('2026-11-07');
  expect(diaConfirmado(registro)).toBeNull();
  expect(diaDelBosque(registro)).toBe('2026-11-07');
  expect(registro._s).toBe(true);
  expect(fechaConfirmada(registro)).toBe(false);
});

test('otro dispositivo recupera fechas offline, detalle e identidad visual sin duplicar registros', async () => {
  const primero = { ...datos(), bosqueId: 'bosque-local', checkins: ['2026-12-30', '2026-12-31', '2027-01-01'].map((fecha, i) => ({
    id: 'offline-' + i, fecha, diaBosque: fecha, schemaVersion: 1, animo: 4, necesidades: [],
    instante: fecha + 'T12:00:00.000Z',
  })) };
  const antes = proyectarRoble(primero.bosqueId, primero.checkins, '2026-12-31');
  const sincronizado = aplicarSync(primero, await sincronizar('A', primero));
  const segundo = { ...datos(), bosqueId: 'otro-dispositivo', checkins: [] };
  const recuperado = aplicarSync(segundo, await sincronizar('A', segundo));
  expect(recuperado.bosqueId).toBe('bosque-local');
  expect(recuperado.checkins.map(diaDelBosque)).toEqual(['2026-12-30', '2026-12-31', '2027-01-01']);
  expect(proyectarRoble(recuperado.bosqueId, recuperado.checkins, '2026-12-31').tree).toEqual(antes.tree);
  expect(sincronizado.checkins.every((c) => !fechaConfirmada(c) && c._s)).toBe(true);
  await sincronizar('A', primero);
  expect([...mockDocs.keys()].filter((k) => k.includes('/checkins/'))).toHaveLength(3);
  await borrarNube('A', { id: 'op', generacion: 'g1' });
  expect(mockDocs.has('users/A/bosque/identidad')).toBe(false);
  await expect(sincronizar('A', primero)).rejects.toMatchObject({ code: 'sync/deleting' });
});

test('migra históricos remotos una vez sin alterar cuerpo ni timestamp', async () => {
  const legacy = { id: 'viejo', fecha: '2040-01-01', animo: 2, generacion: 'g1',
    actualizado: { toMillis: () => 5 }, confirmadoEn: { toMillis: () => Date.parse('2026-11-11T12:00Z') } };
  mockDocs.set('users/A/checkins/viejo', legacy);
  const vacio = { ...datos(), checkins: [] };
  const a = await sincronizar('A', vacio);
  expect(a.remoto.checkins[0]).toMatchObject({ id: 'viejo', diaBosque: '2026-11-11', animo: 2 });
  const migrado = mockDocs.get('users/A/checkins/viejo');
  expect(migrado).toEqual({ ...legacy, schemaVersion: 1, diaBosque: '2026-11-11' });
  await sincronizar('A', vacio);
  expect(mockDocs.get('users/A/checkins/viejo')).toEqual(migrado);
});

test('check-in emocional conserva color y detalle tras respuesta perdida y recuperación en otro cliente', async () => {
  const base = { schemaVersion: 2, fecha: '2026-11-11', hora: '09:00', diaBosque: '2026-11-11',
    instante: '2026-11-11T12:00:00.000Z', emocion: 'ansiosa', intensidad: 3, necesidad: 'comer', cuidado: 'Mi cuidado' };
  const primero = { ...datos(), bosqueId: 'bosque-emocional', checkins: [
    { ...base, id: 'id1' },
    { ...base, id: 'id2', emocion: 'triste', instante: '2026-11-11T13:00:00.000Z' },
    { ...base, id: 'id3', emocion: 'contenta', intensidad: 1, instante: '2026-11-11T14:00:00.000Z' },
  ] };
  mockPerderRespuesta = true;
  await expect(sincronizar('A', primero)).rejects.toThrow('respuesta perdida');
  const original = mockDocs.get('users/A/checkins/id1');
  const sincronizado = aplicarSync(primero, await sincronizar('A', primero));
  expect(mockDocs.get('users/A/checkins/id1')).toEqual(original);
  const otro = { ...datos(), checkins: [] };
  const recuperado = aplicarSync(otro, await sincronizar('A', otro));
  const proyeccion = (d) => proyectarRoble(d.bosqueId, d.checkins, '2026-11-11');
  expect(proyeccion(recuperado)).toEqual(proyeccion(sincronizado));
  expect(proyeccion(recuperado)).toMatchObject({ dias: 1, hojas: [{ registroId: 'id2', emocion: 'triste', intensidad: 3, necesidad: 'comer' }], tree: { emotions: { 1: 'triste' } } });
  expect(recuperado.checkins).toHaveLength(3);
  expect(recuperado.checkins.every((c) => c.animo === undefined && c.cuidado === 'Mi cuidado')).toBe(true);
});
