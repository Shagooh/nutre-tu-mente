import { DIAGNOSTICO, PREFERENCIAS } from '../content/incorporacion';
import { arbolMensualValido, crearPerfilRevision, incorporacionValida, perfilDiagnostico } from '../contrato-incorporacion';
import { prepararDatos, useStore } from '../store';
import { crearPersistencia } from '../persistencia';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../modo-revision', () => ({ revisionDiagnostico: true }));

test('la sesión de revisión nunca lee ni modifica el almacenamiento, incluso después de editar y remontar', async () => {
  AsyncStorage.getItem.mockClear();
  AsyncStorage.setItem.mockClear();
  const sesion = renderHook(useStore);
  await waitFor(() => expect(sesion.result.current.datos).toBeTruthy());
  await act(async () => { await sesion.result.current.actualizar(() => ({ perfil: { nombre: 'Sol', recordatorios: [] } })); });
  expect(sesion.result.current.datos.perfil.nombre).toBe('Sol');
  sesion.unmount();
  const nueva = renderHook(useStore);
  await waitFor(() => expect(nueva.result.current.datos).toBeTruthy());
  expect(nueva.result.current.datos.perfil).toBeNull();
  expect(AsyncStorage.getItem).not.toHaveBeenCalled();
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
});

function fixture() {
  const primeras = preguntas => Object.fromEntries(preguntas.map(p => [p.id, [p.opciones[0].id]]));
  return { schemaVersion: 1, diagnostico: primeras(DIAGNOSTICO.preguntas), preferencias: primeras(PREFERENCIAS.preguntas) };
}

test('migra el blob histórico una sola vez, conserva IDs y escala, y no inventa respuestas', async () => {
  const historico = { perfil: { nombre: 'Sol', flor: 'rosa', recordatorios: [] },
    mental: [{ id: 'antiguo', valor: 5, fecha: '2026-11-14' }, { valor: 3, fecha: '2026-10-15' }] };
  let raw = JSON.stringify(historico);
  const disco = { getItem: async () => raw, setItem: jest.fn(async (_, nuevo) => { raw = nuevo; }) };
  const abrir = () => crearPersistencia(disco, 'demo', prepararDatos).cargar();
  disco.setItem.mockRejectedValueOnce(new Error('disco'));
  await expect(abrir()).rejects.toThrow('disco');
  expect(raw).toEqual(JSON.stringify(historico));
  const migrado = await abrir();
  expect(migrado.versionAlmacen).toBe(1);
  expect(migrado.perfil).toEqual(historico.perfil);
  expect(migrado.mental[0]).toEqual(historico.mental[0]);
  expect(migrado.mental[1].id).toBeTruthy();
  disco.setItem.mockClear();
  expect(await abrir()).toEqual(migrado);
  for (const incompatible of ['{', JSON.stringify({ ...migrado, versionAlmacen: 2 })]) {
    raw = incompatible;
    await expect(abrir()).rejects.toThrow();
    expect(raw).toBe(incompatible);
  }
  expect(disco.setItem).not.toHaveBeenCalled();
});

test('perfil versionado conserva la escala base y bloquea el ingreso con una señal o edad restringida', () => {
  const datos = fixture();
  expect(() => crearPerfilRevision('Sol', datos)).toThrow();
  datos.preferencias['pref-2'] = ['25-34'];
  expect(() => crearPerfilRevision('Sol', datos)).toThrow();
  datos.diagnostico['diag-12'] = ['ninguna'];
  const perfil = crearPerfilRevision('Sol', datos);
  expect(perfil.schemaVersion).toBe(1);
  expect(perfil.incorporacion.diagnostico['diag-1']).toEqual(['casi-nada']);
  datos.preferencias['pref-2'] = ['menor-18'];
  expect(() => crearPerfilRevision('Sol', datos)).toThrow();
});

test('árbol mensual versionado con nombre opcional, sin duplicar hojas o diario', () => {
  const arbol = { schemaVersion: 1, mes: '2026-11', especie: 'roble' };
  expect(arbolMensualValido(arbol)).toBe(true);
  expect(arbolMensualValido({ ...arbol, especie: 'quillay', nombre: 'Sur' })).toBe(true);
  for (const cambios of [{ schemaVersion: 2 }, { mes: '2026-13' }, { especie: 'otro' }, { nombre: 1 }, { hojas: [] }]) {
    expect(arbolMensualValido({ ...arbol, ...cambios })).toBe(false);
  }
});

test('acepta los tres perfiles y conserva la omisión explícita con Conciencia por defecto', () => {
  for (const [opcion, perfil] of [['conciencia', 'Conciencia'], ['habitos', 'Hábitos'], ['bienestar', 'Bienestar'], [null, 'Conciencia']]) {
    const f = fixture();
    f.diagnostico['diag-10'] = opcion ? [opcion] : null;
    expect(incorporacionValida(f)).toBe(true);
    expect(perfilDiagnostico(f.diagnostico)).toBe(perfil);
  }
});

test('rechaza versiones, campos, escalas, omisiones y combinaciones inválidas', () => {
  for (const modificar of [
    f => { f.schemaVersion = 2; }, f => { f.peso = 1; }, f => { f.diagnostico.extra = 1; },
    f => { delete f.diagnostico['diag-3']; }, f => { f.diagnostico['diag-1'] = [5]; },
    f => { f.diagnostico['diag-12'] = null; }, f => { f.diagnostico['diag-12'] = []; },
    f => { f.diagnostico['diag-12'] = ['ninguna', 'control']; },
    f => { f.preferencias['pref-4'] = ['calma', 'calma']; },
    f => { f.preferencias['pref-4'] = ['calma', 'afirmaciones', 'autocuidado']; },
    f => { f.preferencias['pref-2'] = null; },
  ]) {
    const f = fixture(); modificar(f);
    expect(incorporacionValida(f)).toBe(false);
  }
});
