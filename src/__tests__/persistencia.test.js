import { crearPersistencia } from '../persistencia';
import { prepararDatos } from '../store';
import { crearCercaSesion } from '../sesion';
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const crear = (raw = null) => {
  const storage = { getItem: jest.fn(async () => raw), setItem: jest.fn(async () => {}) };
  return { storage, p: crearPersistencia(storage, 'datos', prepararDatos) };
};
test.each(['{', '[]', 'false', '{"checkins":null}', '{"perfil":{}}'])('no sobrescribe lectura inválida %s', async (raw) => {
  const { p, storage } = crear(raw);
  await expect(p.cargar()).rejects.toThrow();
  await expect(p.actualizar(() => ({ nombre: 'x' }))).rejects.toThrow();
  expect(storage.setItem).not.toHaveBeenCalled();
});
test('reintenta una lectura rechazada sin escribir', async () => {
  const { p, storage } = crear();
  storage.getItem.mockRejectedValueOnce(new Error('disco'));
  await expect(p.cargar()).rejects.toThrow();
  await p.cargar();
  expect(storage.setItem).not.toHaveBeenCalled();
});
test('escrituras seriales y el fallo conserva último commit', async () => {
  const { p, storage } = crear();
  await p.cargar();
  let liberar;
  storage.setItem.mockImplementationOnce(() => new Promise((res) => { liberar = res; }));
  const primero = p.actualizar(() => ({ retornos: 1 }));
  const segundo = p.actualizar((d) => ({ retornos: d.retornos + 1 }));
  await Promise.resolve();
  expect(storage.setItem).toHaveBeenCalledTimes(1);
  expect(p.leerActual().retornos).toBe(0);
  liberar();
  await primero;
  await segundo;
  expect(p.leerActual().retornos).toBe(2);
  storage.setItem.mockRejectedValueOnce(new Error('lleno'));
  await expect(p.actualizar(() => ({ retornos: 100 }))).rejects.toThrow();
  expect(p.leerActual().retornos).toBe(2);
  await p.actualizar(() => ({ retornos: 3 }));
  expect(p.leerActual().retornos).toBe(3);
});
test('operación pendiente y su ID sobreviven al reinicio', async () => {
  const { p, storage } = crear();
  await p.cargar();
  await p.actualizar(() => ({ checkins: [{ id: 'estable', fecha: '2026-11-07', animo: 3 }] }));
  const raw = storage.setItem.mock.calls[0][1];
  const reinicio = crear(raw);
  const d = await reinicio.p.cargar();
  expect(d.checkins[0].id).toBe('estable');
  expect(d.checkins[0]._s).toBeUndefined();
});
test('cerca invalida respuestas de sesiones y borrados anteriores', () => {
  const c = crearCercaSesion();
  c.cambiar('A');
  const a = c.capturar();
  c.cambiar('B');
  expect(a()).toBe(false);
  const b = c.capturar();
  c.bloquear();
  expect(b()).toBe(false);
  c.desbloquear();
  expect(b()).toBe(false);
});
test('una respuesta cercada no se escribe al disco', async () => {
  const { p, storage } = crear();
  await p.cargar();
  const c = crearCercaSesion();
  c.cambiar('A');
  const valido = c.capturar();
  c.cambiar(null);
  await expect(p.actualizar(() => ({ cuentaUid: 'A' }), valido)).rejects.toThrow('storage/stale');
  expect(storage.setItem).not.toHaveBeenCalled();
});
test('borrado reemplaza también campos de versiones antiguas', async () => {
  const { p } = crear('{"hojas":[{"nota":"privado"}],"arboles":[{}]}');
  await p.cargar();
  await p.actualizar(() => ({ perfil: null, checkins: [] }), undefined, true);
  expect(p.leerActual().hojas).toBeUndefined();
  expect(p.leerActual().arboles).toBeUndefined();
});
