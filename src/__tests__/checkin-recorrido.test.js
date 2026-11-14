import React from 'react';
import { act, create } from 'react-test-renderer';
import { renderToStaticMarkup } from 'react-dom/server';
import { Oak } from '../../roble/OakScene';
import { emotionalPalettes } from '../../roble/emotions';
import CheckIn from '../screens/CheckIn';
import RobleMensual from '../components/RobleMensual';
import Hoy from '../screens/Hoy';
import Planta from '../components/Planta';
import { Boton, Chip } from '../components/ui';
import { EMOCIONES_CHECKIN } from '../content/checkin';
import { migrarCalendario, validarCalendario } from '../contrato-bosque';
import { prepararDatos } from '../store';
import { proyectarRoble } from '../roble-mensual';
import { ultimos7 } from '../logic';
import { relojBosque } from '../reloj-bosque';

jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => ({ __esModule: true, default: require('react-native').View }));
jest.setTimeout(15000);
const registro = (cambios = {}) => ({
  schemaVersion: 2, id: 'emocional-1', fecha: '2026-11-13', hora: '09:00', diaBosque: '2026-11-13',
  instante: '2026-11-13T12:00:00.000Z', emocion: 'ansiosa', intensidad: 3, necesidad: 'comer', cuidado: 'Mi cuidado', ...cambios,
});

test('el formulario exige los tres campos, guarda una sola necesidad y no anuncia contenido faltante', async () => {
  const guardar = jest.fn(async () => {});
  let vista;
  await act(async () => { vista = create(<CheckIn onGuardar={guardar} onCerrar={jest.fn()} />); });
  const boton = () => vista.root.findAllByType(Boton).find((b) => b.props.titulo === 'Guardar');
  const elegir = async (texto) => act(async () => vista.root.findAllByType(Chip).find((c) => c.props.texto === texto).props.onPress());
  expect(boton().props.disabled).toBe(true);
  await act(async () => boton().props.onPress());
  expect(guardar).not.toHaveBeenCalled();
  await act(async () => vista.root.findByProps({ accessibilityLabel: 'Ansiosa' }).props.onPress());
  expect(boton().props.disabled).toBe(true);
  await elegir('mucho');
  expect(boton().props.disabled).toBe(true);
  await elegir('Descansar');
  await elegir('Comer');
  expect(boton().props.disabled).toBe(false);
  await act(async () => boton().props.onPress());
  const c = guardar.mock.calls[0][0];
  expect(c).toMatchObject({ schemaVersion: 2, emocion: 'ansiosa', intensidad: 3, necesidad: 'comer' });
  expect(c.necesidades).toBeUndefined();
  expect(c.animo).toBeUndefined();
  expect(validarCalendario(c)).toBe(true);
  const texto = JSON.stringify(vista.toJSON());
  expect(texto).toContain('Gracias por mirarte hoy.');
  expect(texto).toContain('revisión clínica');
  expect(texto).not.toContain('audio de relajación');
  expect(texto).not.toContain('Tu árbol tiene una hoja nueva');
  await act(async () => vista.unmount());
});

test('esquema nuevo válido e idempotente; históricos conservan su ánimo y no reciben emoción', () => {
  const c = registro();
  expect(validarCalendario(c)).toBe(true);
  expect(migrarCalendario(c)).toBe(c);
  for (const cambio of [{ emocion: 'otra' }, { intensidad: 4 }, { necesidad: ['comer'] }, { instante: undefined },
    { id: 'no/valido' }, { animo: 3 }, { necesidades: [] }, { cuidado: 'x'.repeat(281) }, { peso: 60 }]) {
    expect(validarCalendario(registro(cambio))).toBe(false);
    expect(() => prepararDatos({ checkins: [registro(cambio)] })).toThrow('storage/invalid');
  }
  const datos = prepararDatos({ checkins: [c, { id: 'old-1', fecha: '2026-11-12', animo: 2, necesidades: ['descanso'] }] });
  expect(prepararDatos(JSON.parse(JSON.stringify(datos)))).toEqual(datos);
  expect(datos.checkins[1]).toMatchObject({ schemaVersion: 1, animo: 2, necesidades: ['descanso'] });
  expect(datos.checkins[1].emocion).toBeUndefined();
});

test.each([['2026-02', 28], ['2028-02', 29], ['2026-04', 30], ['2026-12', 31]])('mes %s conserva %s hojas, sus colores y el índice gráfico acotado', (mes, dias) => {
  const checkins = Array.from({ length: dias }, (_, i) => registro({
    id: 'dia-' + i, fecha: `${mes}-${String(i + 1).padStart(2, '0')}`, diaBosque: `${mes}-${String(i + 1).padStart(2, '0')}`,
    emocion: EMOCIONES_CHECKIN[i % 10].id,
  }));
  const roble = proyectarRoble('bosque', checkins, mes + '-01');
  expect(roble.dias).toBe(dias);
  expect(roble.tree.growthDay).toBe(Math.min(dias, 29));
  const svg = renderToStaticMarkup(<Oak tree={roble.tree} />);
  expect(svg.match(/data-day=/g)).toHaveLength(dias);
  expect(svg).not.toContain('NaN');
  expect(svg).toContain(`id="day-${dias}"`);
  for (const e of EMOCIONES_CHECKIN) {
    expect(svg).toContain(emotionalPalettes[e.id].base);
    expect(svg).toContain(e.icono);
  }
});

test('la hoja y las tres emociones del mes usan un registro ganador por fecha y convergen', () => {
  const lista = [registro({ id: 'a', emocion: 'contenta', intensidad: 1 }),
    registro({ id: 'b', emocion: 'triste', instante: '2026-11-13T13:00:00.000Z' }),
    registro({ id: 'c', emocion: 'estresada', instante: '2026-11-13T14:00:00.000Z' }),
    registro({ id: 'd', diaBosque: '2026-11-14', emocion: 'contenta' })];
  const uno = proyectarRoble('bosque', lista, '2026-11-30');
  expect(uno).toEqual(proyectarRoble('bosque', [...lista].reverse(), '2026-11-30'));
  expect(uno.tree.emotions).toEqual({ 1: 'estresada', 2: 'contenta' });
  expect(uno.resumen).toEqual([{ emocion: 'contenta', dias: 1 }, { emocion: 'estresada', dias: 1 }]);
  expect(uno.hojas[0].registroId).toBe('c');
  expect(proyectarRoble('bosque', lista, '2026-12-01').dias).toBe(0);
  expect(proyectarRoble('bosque', [], '2026-11-30').tree.growthDay).toBe(0);
});

test('tocar hoja muestra intensidad, necesidad y cuidado; leyenda y resumen no dependen solo del color', async () => {
  const c = registro();
  let vista;
  await act(async () => { vista = create(<RobleMensual bosqueId="bosque" checkins={[c]} grande />); });
  await act(async () => vista.root.findAllByType(Boton).find((b) => b.props.titulo === 'Ver días de mi árbol').props.onPress());
  await act(async () => vista.root.findAllByType(Chip).find((b) => b.props.texto === '2026-11').props.onPress());
  await act(async () => vista.root.findAllByProps({ accessibilityRole: 'button' }).find((b) => b.props.accessibilityLabel?.startsWith('2026-11-13')).props.onPress());
  const texto = JSON.stringify(vista.toJSON());
  for (const valor of ['Ansiosa', 'mucho', 'Comer', 'Mi cuidado', 'Colores e iconos provisionales', 'Emociones de ']) expect(texto).toContain(valor);
  expect(vista.root.findAllByProps({ accessibilityLabel: 'Ansiosa · Naranjo' }).length).toBeGreaterThan(0);
  await act(async () => vista.unmount());
});

test('Mi bosque cambia a semilla al comenzar otro mes y conserva el árbol anterior consultable', async () => {
  jest.useFakeTimers();
  const reloj = jest.spyOn(relojBosque, 'hoy').mockReturnValue('2026-12-31');
  let vista;
  try {
    const c = registro({ fecha: '2026-12-31', diaBosque: '2026-12-31', instante: '2026-12-31T12:00:00.000Z' });
    await act(async () => { vista = create(<RobleMensual bosqueId="bosque" checkins={[c]} archivo />); });
    expect(vista.root.findAllByProps({ accessibilityLabel: 'Roble · 2026-12 · 1 día registrado' }).length).toBeGreaterThan(0);
    reloj.mockReturnValue('2027-01-01');
    await act(async () => jest.advanceTimersByTime(60000));
    expect(vista.root.findAllByProps({ accessibilityLabel: 'Roble · Bellota' }).length).toBeGreaterThan(0);
    expect(JSON.stringify(vista.toJSON())).toContain('Este mes aún no tiene registros.');
    await act(async () => vista.root.findAllByType(Chip).find((c) => c.props.texto === '2026-12').props.onPress());
    expect(vista.root.findAllByProps({ accessibilityLabel: 'Roble · 2026-12 · 1 día registrado' }).length).toBeGreaterThan(0);
  } finally {
    if (vista) await act(async () => vista.unmount());
    reloj.mockRestore();
    jest.useRealTimers();
  }
});

test('el resumen semanal mezcla históricos y nuevos sin convertir emociones a puntajes', () => {
  const reloj = jest.spyOn(relojBosque, 'hoy').mockReturnValue('2026-11-13');
  try {
    const dias = ultimos7({ checkins: [registro(), { id: 'viejo', fecha: '2026-11-12', animo: 4 }] });
    expect(dias[6]).toMatchObject({ emocion: 'ansiosa', descripcion: 'Ansiosa', animo: null });
    expect(dias[5]).toMatchObject({ emocion: null, animo: 4 });
  } finally { reloj.mockRestore(); }
});

test('el recorrido del roble no usa puntos de herramientas ni lecciones para crecer', async () => {
  const reloj = jest.spyOn(relojBosque, 'hoy').mockReturnValue('2026-11-13');
  try {
  const datos = { bosqueId: 'bosque', perfil: { flor: 'roble', nombre: 'Prueba', estilo: 'autocuidado' },
    checkins: [registro()], cuestas: [], lecciones: [], mental: [], retornos: 0 };
  let vista;
  await act(async () => { vista = create(<Hoy datos={datos} onAbrir={jest.fn()} />); });
  expect(vista.root.findByType(Planta).props.pts).toBeUndefined();
  const tree = vista.root.findByType(Oak).props.tree;
  const mas = { ...datos, cuestas: [{ fecha: '2026-11-13', calmaAntes: 2, calmaDespues: 4 }], lecciones: ['pausa'] };
  await act(async () => vista.update(<Hoy datos={mas} onAbrir={jest.fn()} />));
  expect(vista.root.findByType(Oak).props.tree).toEqual(tree);
  await act(async () => vista.unmount());
  } finally { reloj.mockRestore(); }
});
