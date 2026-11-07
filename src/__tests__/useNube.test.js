import React, { useEffect } from 'react';
import { act, create } from 'react-test-renderer';
import { useNube } from '../useNube';
import { datosVacios } from '../store';
import { sincronizar, borrarNube, activarNube, obtenerControl } from '../sync';
import { salir, reautenticar, eliminarUsuario } from '../cuenta';

let mockSesion;
jest.mock('../cuenta', () => ({
  escucharSesion: (fn) => { mockSesion = fn; return () => {}; },
  salir: jest.fn(async () => {}), reautenticar: jest.fn(async () => {}), eliminarUsuario: jest.fn(async () => {}),
}));
jest.mock('../firebase', () => ({ nubeActiva: true }));
jest.mock('../sync', () => ({ sincronizar: jest.fn(), borrarNube: jest.fn(), activarNube: jest.fn(), obtenerPerfil: jest.fn(), obtenerControl: jest.fn() }));
jest.mock('../reportes', () => ({ codigoSeguro: (c) => c, detenerReportes: jest.fn(), reportarError: jest.fn() }));
jest.mock('../notifications', () => ({ cancelarRecordatorios: jest.fn() }));

let datos, api, tree, historial;
const actualizar = jest.fn(async (fn, vigente = () => true) => {
  if (!vigente()) throw new Error('stale');
  datos = { ...datos, ...fn(datos) };
  historial.push(datos);
  return datos;
});
const leerActual = () => datos;
const borrarTodo = jest.fn(async () => { datos = datosVacios(); });
function Probe() {
  const estado = useNube({ datos, actualizar, leerActual, borrarTodo });
  useEffect(() => { api = estado; });
  return null;
}
const refrescar = async () => act(async () => { tree.update(<Probe />); });
const resultado = { remoto: { checkins: [{ id: 'remoto', fecha: '2026-11-07' }], cuestas: [], mental: [], ultimaSync: 1 }, subidos: {}, perfilSubido: null };
beforeEach(async () => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  historial = [];
  datos = { ...datosVacios(), cuentaUid: 'A', nubeGeneracion: 'g1' };
  sincronizar.mockResolvedValue(resultado);
  borrarNube.mockResolvedValue(undefined);
  activarNube.mockResolvedValue('g1');
  obtenerControl.mockResolvedValue({ generacion: 'g1', estado: 'activo' });
  await act(async () => { tree = create(<Probe />); });
  await act(async () => mockSesion({ uid: 'A' }));
});
afterEach(async () => { await act(async () => tree.unmount()); jest.useRealTimers(); });

test('una respuesta tras cerrar sesión no se aplica', async () => {
  let resolver;
  sincronizar.mockImplementationOnce(() => new Promise((res) => { resolver = res; }));
  let pendiente;
  await act(async () => { pendiente = api.sincronizarAhora(); });
  await act(async () => { await api.cerrarSesion(); });
  await act(async () => { resolver(resultado); await pendiente; });
  expect(datos.checkins).toEqual([]);
  expect(datos.ultimaSync).toBeNull();
});
test('cambiar a otra cuenta no incorpora respuesta de A ni sube sus datos a B', async () => {
  let resolver;
  sincronizar.mockImplementationOnce(() => new Promise((res) => { resolver = res; }));
  let pendiente;
  await act(async () => { pendiente = api.sincronizarAhora(); });
  await act(async () => mockSesion({ uid: 'B' }));
  await act(async () => { resolver(resultado); await pendiente; });
  await act(async () => api.sincronizarAhora());
  expect(datos.checkins).toEqual([]);
  expect(sincronizar.mock.calls.every(([uid]) => uid === 'A')).toBe(true);
  expect(salir).toHaveBeenCalled();
});
test('sesión restaurada antes de la carga puede sincronizar al cargar', async () => {
  datos = null;
  await refrescar();
  await act(async () => api.sincronizarAhora());
  expect(sincronizar).not.toHaveBeenCalled();
  datos = datosVacios();
  await refrescar();
  await act(async () => api.sincronizarAhora());
  expect(datos.cuentaUid).toBe('A');
  expect(datos.checkins[0].id).toBe('remoto');
});
test('borrado interrumpido mantiene ID y bloquea sync hasta reintentar', async () => {
  borrarNube.mockRejectedValueOnce(new Error('sin conexión'));
  await act(async () => { await expect(api.borrar()).rejects.toThrow(); });
  const id = datos.borrado.id;
  // Simular desmontaje y reinicio del coordinador con el marcador persistido.
  await act(async () => tree.unmount());
  await act(async () => { tree = create(<Probe />); });
  await act(async () => mockSesion({ uid: 'A' }));
  await act(async () => api.sincronizarAhora());
  expect(sincronizar).not.toHaveBeenCalled();
  await act(async () => api.borrar());
  expect(borrarNube.mock.calls[1][1].id).toBe(id);
  expect(borrarTodo).toHaveBeenCalledTimes(1);
});
test('fallo de reautenticación no borra ni marca datos', async () => {
  reautenticar.mockRejectedValueOnce(new Error('clave'));
  await act(async () => { await expect(api.eliminarCuenta('x')).rejects.toThrow('clave'); });
  expect(borrarNube).not.toHaveBeenCalled();
  expect(datos.borrado).toBeNull();
});
test('borrado invalida una respuesta que estaba en vuelo', async () => {
  let resolver;
  sincronizar.mockImplementationOnce(() => new Promise((res) => { resolver = res; }));
  let pendiente, borrado;
  await act(async () => { pendiente = api.sincronizarAhora(); });
  await act(async () => { borrado = api.borrar(); });
  await act(async () => { resolver(resultado); await pendiente; await borrado; });
  expect(historial.some((d) => d.checkins.some((c) => c.id === 'remoto'))).toBe(false);
  expect(datos.checkins).toEqual([]);
});
test('eliminar cuenta conserva copia local y requiere confirmación para vincular', async () => {
  datos.checkins = [{ id: 'local', fecha: '2026-11-07' }];
  await act(async () => api.eliminarCuenta('clave'));
  expect(eliminarUsuario).toHaveBeenCalledTimes(1);
  expect(datos.checkins).toHaveLength(1);
  expect(datos.requiereVincular).toBe(true);
  expect(datos.cuentaUid).toBeNull();
  await act(async () => mockSesion({ uid: 'B' }));
  await act(async () => api.sincronizarAhora());
  expect(sincronizar).not.toHaveBeenCalled();
  await act(async () => api.vincular());
  expect(datos.cuentaUid).toBe('B');
  expect(datos.requiereVincular).toBe(false);
});
test('sin sesión solo recupera copia local si la nube ya fue confirmada borrada', async () => {
  datos.borrado = { tipo: 'cuenta', fase: 'remoto', id: 'x', uid: 'A', generacion: 'g1' };
  await act(async () => mockSesion(null));
  await act(async () => { await expect(api.recuperarCopiaLocal()).rejects.toThrow(); });
  datos.borrado.fase = 'local';
  await act(async () => api.recuperarCopiaLocal());
  expect(datos.borrado).toBeNull();
  expect(datos.requiereVincular).toBe(true);
});
