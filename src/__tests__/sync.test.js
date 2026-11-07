import { sincronizar, borrarNube } from '../sync';
import { datosVacios } from '../store';
let mockDocs, mockPerderRespuesta, mockFallarLote;
let mockReloj = 0;
jest.mock('../firebase', () => ({ db: {} }));
jest.mock('firebase/firestore', () => {
  const snap = (ref) => ({ exists: () => mockDocs.has(ref), data: () => mockDocs.get(ref), ref });
  return {
    doc: (_db, ...p) => p.join('/'), collection: (_db, ...p) => p.join('/'),
    serverTimestamp: () => ++mockReloj,
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
      if (mockPerderRespuesta && cambios.length) { mockPerderRespuesta = false; throw new Error('respuesta perdida'); }
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
