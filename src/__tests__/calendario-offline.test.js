import React from 'react';
import { act, create } from 'react-test-renderer';
import { crearReloj } from '../reloj-bosque';
import { diaDelBosque, fechaConfirmada, identidadBosqueValida, migrarCalendario, validarCalendario } from '../contrato-bosque';
import { prepararDatos } from '../store';
import { crearPersistencia } from '../persistencia';
import { proyectarRoble } from '../roble-mensual';
import RobleMensual from '../components/RobleMensual';
import { Boton, Chip } from '../components/ui';

const legacy = (fecha, cambios = {}) => ({ id: fecha, fecha, animo: 3, necesidades: ['comer'], cuidado: 'Mi cuidado', ...cambios });

test('contrato temporal acepta históricos sin instante y rechaza versiones, tipos y fechas imposibles', () => {
  const valido = { schemaVersion: 1, diaBosque: '2028-02-29', instante: '2028-02-29T12:00:00.000Z' };
  expect(validarCalendario(valido)).toBe(true);
  expect(validarCalendario({ schemaVersion: 1, diaBosque: '2026-11-13' })).toBe(true);
  for (const cambios of [{ schemaVersion: 2 }, { diaBosque: '2026-02-29' }, { diaBosque: '2026-13-01' }, { diaBosque: null },
    { instante: '2028-02-29T12:00:00' }, { instante: '2028-02-30T12:00:00.000Z' }, { instante: 4 }]) {
    expect(validarCalendario({ ...valido, ...cambios })).toBe(false);
  }
  for (const id of ['', null, {}, 'a/b', 'a'.repeat(81)]) expect(identidadBosqueValida(id)).toBe(false);
  expect(identidadBosqueValida('bosque-local-1')).toBe(true);
});

test('migración idempotente conserva IDs, ánimo y fuente de fecha sin inventar emoción ni instante', () => {
  const originales = [legacy('2026-12-31'), legacy('2040-01-01', { _confirmadoMs: Date.parse('2027-01-01T01:00Z'), _s: true })];
  const uno = prepararDatos({ checkins: originales });
  const dos = prepararDatos(JSON.parse(JSON.stringify(uno)));
  expect(dos).toEqual(uno);
  expect(uno.checkins.map(diaDelBosque)).toEqual(['2026-12-31', '2026-12-31']);
  expect(uno.checkins[1]).toMatchObject({ id: '2040-01-01', fecha: '2040-01-01', animo: 3, _s: false });
  expect(uno.checkins[0].emocion).toBeUndefined();
  expect(uno.checkins[0].instante).toBeUndefined();
  expect(originales[0].schemaVersion).toBeUndefined();
  expect(migrarCalendario(uno.checkins[0])).toBe(uno.checkins[0]);
});

test('la migración solo publica después de disco; fallo e ilegibilidad conservan el blob', async () => {
  let raw = JSON.stringify({ checkins: [legacy('2026-11-10')] });
  const original = raw;
  const storage = { getItem: jest.fn(async () => raw), setItem: jest.fn(async (_, value) => { raw = value; }) };
  const p = crearPersistencia(storage, 'test', prepararDatos);
  const oyente = jest.fn();
  p.escuchar(oyente);
  storage.setItem.mockRejectedValueOnce(new Error('disco lleno'));
  await expect(p.cargar()).rejects.toThrow('disco lleno');
  expect(p.leerActual()).toBeNull();
  expect(oyente).not.toHaveBeenCalled();
  expect(raw).toBe(original);
  const guardado = await p.cargar();
  const reiniciado = crearPersistencia(storage, 'test', prepararDatos);
  expect(await reiniciado.cargar()).toEqual(guardado);
  expect(JSON.parse(raw).bosqueId).toBe(guardado.bosqueId);
  raw = '{';
  const roto = crearPersistencia(storage, 'test', prepararDatos);
  await expect(roto.cargar()).rejects.toThrow();
  expect(raw).toBe('{');
  await expect(roto.actualizar(() => ({}))).rejects.toThrow('storage/not-loaded');
});

test('tres días offline sobreviven reinicio y confirmación tardía sin mover diciembre a enero', () => {
  const datos = prepararDatos({ checkins: ['2026-12-30', '2026-12-31', '2027-01-01'].map((f) => legacy(f)) });
  const reinicio = prepararDatos(JSON.parse(JSON.stringify(datos)));
  expect(reinicio.bosqueId).toBe(datos.bosqueId);
  expect(proyectarRoble(datos.bosqueId, datos.checkins, '2026-12-31')).toMatchObject({ dias: 2 });
  const tardios = datos.checkins.map((c) => ({ ...c, _s: true, _confirmadoMs: Date.parse('2027-01-03T12:00Z') }));
  expect(tardios.every((c) => !fechaConfirmada(c))).toBe(true);
  expect(tardios.map(diaDelBosque)).toEqual(['2026-12-30', '2026-12-31', '2027-01-01']);
  expect(proyectarRoble(datos.bosqueId, tardios, '2027-01-03')).toMatchObject({ dias: 1, hojas: [{ fecha: '2027-01-01', provisional: true, sincronizada: true }] });
  expect(proyectarRoble(datos.bosqueId, tardios, '2027-02-01').dias).toBe(0);
});

test('captura exacta con referencia monotónica y cambio de día; reinicio vuelve a provisional local', () => {
  let tick = 0;
  let sesion = 0;
  const reloj = crearReloj(() => tick, () => ++sesion);
  reloj.ajustar(Date.parse('2027-01-01T02:59:59Z'));
  const anterior = reloj.capturar();
  expect(anterior).toMatchObject({ diaBosque: '2026-12-31', instante: '2027-01-01T02:59:59.000Z', schemaVersion: 1 });
  const mock = jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2040-01-01T12:00Z'));
  try {
    tick += 2000;
    expect(reloj.capturar().diaBosque).toBe('2027-01-01');
    expect(anterior.diaBosque).toBe('2026-12-31');
    reloj.reiniciar();
    expect(reloj.capturar().diaBosque).toBe('2040-01-01');
    expect(reloj.reciente(anterior._captura)).toBe(false);
  } finally { mock.mockRestore(); }
});

test('salto horario de Chile no inventa un día ni cambia las capturas anteriores', () => {
  let tick = 0;
  const reloj = crearReloj(() => tick, () => 'sesion');
  reloj.ajustar(Date.parse('2026-09-06T03:59:59Z'));
  const antes = reloj.capturar();
  tick = 2000;
  const despues = reloj.capturar();
  expect(antes).toMatchObject({ diaBosque: '2026-09-05', hora: '23:59' });
  expect(despues).toMatchObject({ diaBosque: '2026-09-06', hora: '01:00' });
  expect(antes.diaBosque).toBe('2026-09-05');
});

test('consulta sin cuenta separa días 30/31, indica provisional y permite revisar meses anteriores', async () => {
  const checkins = ['2026-12-30', '2026-12-31', '2027-01-01'].map((f) => migrarCalendario(legacy(f)));
  let vista;
  await act(async () => { vista = create(<RobleMensual bosqueId="local" checkins={checkins} grande />); });
  await act(async () => vista.root.findAllByType(Boton).find((b) => b.props.titulo === 'Ver días de mi árbol').props.onPress());
  await act(async () => vista.root.findAllByType(Chip).find((c) => c.props.texto === '2026-12').props.onPress());
  for (const fecha of ['2026-12-30', '2026-12-31']) {
    const boton = vista.root.findAllByProps({ accessibilityRole: 'button' }).find((b) => b.props.accessibilityLabel?.startsWith(fecha));
    expect(boton.props.accessibilityLabel).toContain('Fecha provisional');
    await act(async () => boton.props.onPress());
    expect(JSON.stringify(vista.toJSON())).toContain('Mi cuidado');
  }
  expect(JSON.stringify(vista.toJSON())).toContain('texto en revisión');
  await act(async () => vista.unmount());
});
