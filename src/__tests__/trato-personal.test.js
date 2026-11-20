import { tratoElegido, tratoEfectivo, normalizarTrato, cambiarTrato } from '../trato-personal';
import { textoConTrato } from '../texto-trato';
import { VARIANTES_TRATO } from '../content/trato';
import { fusionarPerfil } from '../contratos-sync';
import { prepararDatos } from '../store';
import { crearPersistencia } from '../persistencia';
import { aplicarSync } from '../fusion';

test.each(['masculino', 'femenino', 'neutro'])('trato %s es explícito y prevalece sobre pref-1', (trato) => {
  const perfil = { trato, incorporacion: { preferencias: { 'pref-1': ['femenino'] } } };
  expect(tratoElegido(perfil)).toBe(trato);
  expect(tratoEfectivo(perfil)).toBe(trato);
  expect(cambiarTrato(perfil, { trato }).incorporacion.preferencias['pref-1']).toEqual([trato]);
});
test('ausencia e inválido son sin elegir, no inferidos del nombre, con neutro efectivo', () => {
  for (const perfil of [null, {}, { nombre: 'Ana' }, { nombre: 'Juan' }, { trato: 'otro' }]) {
    expect(tratoElegido(perfil)).toBeNull();
    expect(tratoEfectivo(perfil)).toBe('neutro');
  }
  expect(tratoElegido({ incorporacion: { preferencias: { 'pref-1': ['masculino'] } } })).toBe('masculino');
  expect(normalizarTrato({ trato: {}, nombre: 'Ana' })).toEqual({ nombre: 'Ana' });
  expect(() => cambiarTrato({}, { trato: null })).toThrow('perfil/trato-invalido');
});
test('matriz completa para tres opciones, claves desconocidas y atribución intactas', () => {
  for (const [clave, variantes] of Object.entries(VARIANTES_TRATO)) {
    for (const trato of ['masculino', 'femenino', 'neutro']) expect(textoConTrato(clave, { trato })).toBe(variantes[trato]);
    expect(textoConTrato(clave)).toBe(variantes.neutro);
    expect(variantes.neutro).not.toMatch(/bienvenide|tranquile|cansade|acompañade/);
  }
  expect(textoConTrato('ansiosa')).toBe('ansiosa');
  expect(textoConTrato('una nutricionista y una psicóloga que trabajan juntas')).toBe('una nutricionista y una psicóloga que trabajan juntas');
});
test('sesión histórica: guardado durable, fallo, recarga y datos intactos', async () => {
  const perfil = { nombre: 'Ana', recordatorios: [], flor: 'roble' };
  let raw = JSON.stringify({ perfil, bosqueId: 'arbol-antiguo', cuentaUid: 'A',
    checkins: [{ id: 'c1', fecha: '2026-11-10', animo: 3, cuidado: 'Estoy cansada' }] });
  const storage = { getItem: async () => raw, setItem: jest.fn(async (_, valor) => { raw = valor; }) };
  const p = crearPersistencia(storage, 'nutre-tu-mente:v1', prepararDatos);
  const anterior = await p.cargar();
  expect(anterior.perfil).not.toHaveProperty('trato');
  storage.setItem.mockRejectedValueOnce(new Error('lleno'));
  await expect(p.actualizar(d => ({ perfil: cambiarTrato(d.perfil, { trato: 'masculino' }) }))).rejects.toThrow('lleno');
  expect(p.leerActual()).toBe(anterior);
  for (const trato of ['femenino', 'masculino', 'neutro']) {
    await p.actualizar(d => ({ perfil: cambiarTrato(d.perfil, { trato }) }));
    const recarga = await crearPersistencia(storage, 'nutre-tu-mente:v1', prepararDatos).cargar();
    expect(recarga.perfil).toEqual({ ...perfil, trato });
    expect(recarga.checkins).toEqual(anterior.checkins);
    expect(recarga.cuentaUid).toBe('A');
    expect(recarga.bosqueId).toBe('arbol-antiguo');
  }
});
test('fusión preserva elecciones omitidas y rechaza conflictos explícitos', () => {
  const base = { nombre: 'A', trato: 'femenino' };
  expect(fusionarPerfil(base, { nombre: 'B' }, { ...base, trato: 'masculino' })).toEqual({ nombre: 'B', trato: 'masculino' });
  expect(fusionarPerfil(base, { ...base, trato: 'neutro' }, { nombre: 'B' })).toEqual({ nombre: 'B', trato: 'neutro' });
  expect(fusionarPerfil(base, { nombre: 'A' }, { nombre: 'A' })).toEqual(base);
  expect(fusionarPerfil({ nombre: 'A' }, { nombre: 'A', trato: 'neutro' }, { nombre: 'B' })).toEqual({ nombre: 'B', trato: 'neutro' });
  expect(() => fusionarPerfil(base, { ...base, trato: 'masculino' }, { ...base, trato: 'neutro' })).toThrow('sync/profile-conflict');
});

test('pull antiguo sin cambios locales tampoco borra una elección y la vuelve a encolar', () => {
  const perfil = { nombre: 'A', trato: 'neutro', recordatorios: [] };
  const datos = prepararDatos({ perfil, perfilBase: perfil, cuentaUid: 'A', perfilSucio: false });
  const remoto = { perfil: { nombre: 'B', recordatorios: [] }, revision: 2 };
  const resultado = aplicarSync(datos, { remoto, subidos: {}, perfilSubido: null });
  expect(resultado.perfil).toEqual({ ...remoto.perfil, trato: 'neutro' });
  expect(resultado.perfilSucio).toBe(true);
  expect(resultado.perfilBase).toEqual(remoto.perfil);
});
