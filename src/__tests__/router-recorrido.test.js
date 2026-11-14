import { renderRouter, screen, fireEvent, act } from 'expo-router/testing-library';
import { router } from 'expo-router';
import { datosVacios } from '../store';
import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import Inicio from '../app/(tabs)/index';
import Herramientas from '../app/(tabs)/herramientas';
import Aprende from '../app/(tabs)/aprende';
import Perfil from '../app/(tabs)/perfil';
import CheckIn from '../app/check-in';
import MeCuesta from '../app/me-esta-costando';
import Respira from '../app/respira';
import Cuenta from '../app/cuenta';
import Progreso from '../app/progreso';
import Leccion from '../app/leccion/[id]';
import Bienvenida from '../app/bienvenida';
import Bosque from '../app/bosque';
import { relojBosque } from '../reloj-bosque';

let mockDatos;
let mockSetDatos;
let mockNotificar;
const mockActualizar = jest.fn(async () => {});
jest.mock('../store', () => ({
  ...jest.requireActual('../store'),
  useStore: () => {
    const [datos, setDatos] = require('react').useState(mockDatos);
    mockSetDatos = setDatos;
    return { datos, actualizar: mockActualizar, cerrarVuelve: jest.fn() };
  },
}));
jest.mock('../useNube', () => ({ useNube: () => ({ usuario: null, estadoSync: { estado: 'inactivo' }, borrar: jest.fn() }) }));
jest.mock('../firebase', () => ({ nubeActiva: false }));
jest.mock('../cuenta', () => ({ entrar: jest.fn(), recuperar: jest.fn(), registrar: jest.fn() }));
jest.mock('../notifications', () => ({ programarRecordatorios: jest.fn(), observarAperturas: (fn) => { mockNotificar = fn; return () => {}; } }));
jest.mock('../reportes', () => ({ iniciarReportes: jest.fn(), detenerReportes: jest.fn() }));
jest.mock('@sentry/react-native', () => ({ wrap: (C) => C }));
jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => ({ __esModule: true, default: require('react-native').View }));
jest.setTimeout(20000);

const rutas = {
  _layout: RootLayout, '(tabs)/_layout': TabsLayout, '(tabs)/index': Inicio,
  '(tabs)/herramientas': Herramientas, '(tabs)/aprende': Aprende, '(tabs)/perfil': Perfil,
  'check-in': CheckIn, 'me-esta-costando': MeCuesta, respira: Respira, cuenta: Cuenta,
  progreso: Progreso, bosque: Bosque, 'leccion/[id]': Leccion, bienvenida: Bienvenida,
};
beforeEach(() => {
  mockDatos = { ...datosVacios(), perfil: { nombre: 'Prueba', flor: 'roble', estilo: 'autocuidado', recordatorios: [], consentimiento: '2026-11-14' } };
  jest.clearAllMocks();
});
afterEach(() => jest.restoreAllMocks());

const emocional = (dia, emocion = 'ansiosa', extra = {}) => ({
  schemaVersion: 2, id: 'registro-' + dia, fecha: dia, diaBosque: dia, hora: '09:00',
  instante: dia + 'T12:00:00.000Z', emocion, intensidad: 3, necesidad: 'no-se', cuidado: 'Mi cuidado de ese día', ...extra,
});

test('Inicio → Mi bosque → hoja → respiración vuelve al mismo mes y detalle sin guardar otra vez', () => {
  jest.spyOn(relojBosque, 'hoy').mockReturnValue('2026-12-01');
  mockDatos.checkins = [emocional('2026-11-30')];
  renderRouter(rutas, { initialUrl: '/' });
  fireEvent.press(screen.getByText('Mi bosque'));
  expect(screen).toHavePathname('/bosque');
  expect(screen.getByText('Este mes aún no tiene registros.')).toBeTruthy();
  fireEvent.press(screen.getByText('2026-11'));
  const hoja = () => screen.getByRole('button', { name: /2026-11-30 · Ansiosa/ });
  expect(hoja().props.accessibilityState.expanded).toBe(false);
  fireEvent.press(hoja());
  expect(hoja().props.accessibilityState).toMatchObject({ selected: true, expanded: true });
  expect(screen.getByText('Cuidado que escribiste: Mi cuidado de ese día')).toBeTruthy();
  expect(screen.getByText('Emoción: Ansiosa · Intensidad: mucho')).toBeTruthy();
  expect(screen.getByText('Necesidad: No sé')).toBeTruthy();
  fireEvent.press(screen.getByText('Respira 1 minuto'));
  expect(screen).toHavePathname('/respira');
  act(() => router.back());
  expect(screen).toHavePathname('/bosque');
  expect(screen.getByText('Registro de 2026-11-30')).toBeTruthy();
  expect(hoja().props.accessibilityState.expanded).toBe(true);
  expect(mockActualizar).not.toHaveBeenCalled();
  fireEvent.press(hoja());
  expect(screen.queryByText('Registro de 2026-11-30')).toBeNull();
  fireEvent.press(screen.getByText('Volver'));
  expect(screen).toHavePathname('/');
});

test('Mi bosque conserva meses al reabrir, resume tres emociones ganadoras y separa días 30/31', () => {
  jest.spyOn(relojBosque, 'hoy').mockReturnValue('2027-01-01');
  mockDatos.checkins = [
    emocional('2026-12-01', 'contenta'), emocional('2026-12-02', 'contenta'),
    emocional('2026-12-03', 'triste'), emocional('2026-12-04', 'triste'),
    emocional('2026-12-30', 'ansiosa'), emocional('2026-12-31', 'enojada'),
    emocional('2026-12-31', 'sola', { id: 'registro-empate', instante: '2026-12-31T13:00:00.000Z' }),
  ];
  renderRouter(rutas, { initialUrl: '/bosque' });
  fireEvent.press(screen.getByText('2026-12'));
  expect(screen.getByText('☀️ Contenta · 2 días')).toBeTruthy();
  expect(screen.getByText('💧 Triste · 2 días')).toBeTruthy();
  expect(screen.getByText('🌀 Ansiosa · 1 día')).toBeTruthy();
  expect(screen.queryByText('🫂 Sola · 1 día')).toBeNull();
  expect(screen.getByLabelText('Roble · 2026-12 · 6 días registrados')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: /2026-12-31 · Sola/ }));
  expect(screen.getByText('Emoción: Sola · Intensidad: mucho')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: /2026-12-30 · Ansiosa/ }));
  expect(screen.getByText('Registro de 2026-12-30')).toBeTruthy();
  expect(screen.queryByText('Registro de 2026-12-31')).toBeNull();
  act(() => router.replace('/'));
  fireEvent.press(screen.getByText('Mi bosque'));
  fireEvent.press(screen.getByText('2026-12'));
  expect(screen.getByLabelText('Roble · 2026-12 · 6 días registrados')).toBeTruthy();
  expect(mockDatos.checkins).toHaveLength(7);
});

test('hoja histórica conserva ánimo y cuidado sin atribuirle emoción, intensidad o respuesta nueva', () => {
  jest.spyOn(relojBosque, 'hoy').mockReturnValue('2026-11-14');
  mockDatos.checkins = [{ schemaVersion: 1, id: 'historico', fecha: '2026-11-13', diaBosque: '2026-11-13', animo: 2, necesidades: ['descanso'], cuidado: 'Cuidado histórico' }];
  renderRouter(rutas, { initialUrl: '/bosque' });
  fireEvent.press(screen.getByRole('button', { name: /2026-11-13 · Registro histórico/ }));
  expect(screen.getByText(/Ánimo original: 2/)).toBeTruthy();
  expect(screen.getByText('Cuidado que escribiste: Cuidado histórico')).toBeTruthy();
  expect(screen.queryByText(/Intensidad:/)).toBeNull();
  expect(screen.queryByText('Respira 1 minuto')).toBeNull();
});

test('el cuidado de una hoja aplica apoyo mucho sin anunciar la secuencia o el audio ausentes', () => {
  jest.spyOn(relojBosque, 'hoy').mockReturnValue('2026-11-14');
  mockDatos.checkins = [emocional('2026-11-13', 'ansiosa', { necesidad: 'comer' })];
  renderRouter(rutas, { initialUrl: '/bosque' });
  fireEvent.press(screen.getByRole('button', { name: /2026-11-13 · Ansiosa/ }));
  expect(screen.queryByText('Respira 1 minuto')).toBeNull();
  expect(screen.queryByText(/Primero respiremos/)).toBeNull();
  expect(screen.queryByText(/audio de relajación/)).toBeNull();
  fireEvent.press(screen.getByText('Me está costando'));
  expect(screen).toHavePathname('/me-esta-costando');
  act(() => router.back());
  expect(screen.getByText('Registro de 2026-11-13')).toBeTruthy();
});

test('Mi bosque exige perfil y bloquea consultas durante un borrado pendiente', () => {
  mockDatos.borrado = { tipo: 'todo', fase: 'remoto' };
  renderRouter(rutas, { initialUrl: '/bosque' });
  expect(screen.getByText('Reanudar borrado')).toBeTruthy();
  expect(screen.queryByText('Mi bosque')).toBeNull();
});

test('el enlace directo al bosque sin perfil vuelve a bienvenida', () => {
  mockDatos.perfil = null;
  renderRouter(rutas, { initialUrl: '/bosque' });
  expect(screen).toHavePathname('/bienvenida');
  expect(screen.queryByText('Mi bosque')).toBeNull();
});

test('cambiar de almacenamiento descarta el mes y la hoja de la cuenta anterior', () => {
  jest.spyOn(relojBosque, 'hoy').mockReturnValue('2026-12-01');
  mockDatos.checkins = [emocional('2026-11-30')];
  renderRouter(rutas, { initialUrl: '/bosque' });
  fireEvent.press(screen.getByText('2026-11'));
  fireEvent.press(screen.getByRole('button', { name: /2026-11-30 · Ansiosa/ }));
  act(() => mockSetDatos({ ...mockDatos, bosqueId: 'otro-bosque', checkins: [] }));
  expect(screen.queryByText('2026-11')).toBeNull();
  expect(screen.queryByText('Registro de 2026-11-30')).toBeNull();
  expect(screen.queryByText(/Mi cuidado de ese día/)).toBeNull();
  expect(screen.getByText('Este mes aún no tiene registros.')).toBeTruthy();
});

test('un enlace al bosque de un perfil histórico conserva su especie', () => {
  mockDatos.perfil.flor = 'girasol';
  renderRouter(rutas, { initialUrl: '/bosque' });
  expect(screen.getByText(/Tu elección anterior se conserva/)).toBeTruthy();
  expect(screen.queryByText('Roble de prueba · diseño provisional')).toBeNull();
});

test('Inicio abre check-in, atrás vuelve al origen y Perfil conserva el acceso a Progreso', () => {
  renderRouter(rutas, { initialUrl: '/' });
  expect(screen).toHavePathname('/');
  for (const nombre of ['Inicio', 'Herramientas', 'Aprende', 'Perfil']) expect(screen.getByLabelText(nombre)).toBeTruthy();
  fireEvent.press(screen.getByText('Hacer mi check-in'));
  expect(screen).toHavePathname('/check-in');
  fireEvent.press(screen.getByText('‹ Cerrar'));
  expect(screen).toHavePathname('/');
  act(() => router.navigate('/perfil'));
  fireEvent.press(screen.getByText('Mi progreso'));
  expect(screen).toHavePathname('/progreso');
  fireEvent.press(screen.getByText('Volver a Perfil'));
  expect(screen).toHavePathname('/perfil');
});

test('enlace directo sin perfil conserva el consentimiento y no abre la herramienta', () => {
  mockDatos.perfil = null;
  renderRouter(rutas, { initialUrl: '/check-in' });
  expect(screen).toHavePathname('/bienvenida');
  expect(screen.queryByText('¿Con qué intensidad?')).toBeNull();
});

test('Aprende abre una lección por ruta y vuelve a su lista', () => {
  renderRouter(rutas, { initialUrl: '/aprende' });
  fireEvent.press(screen.getByText('Comer con presencia'));
  expect(screen).toHavePathname('/leccion/comer-presente');
  fireEvent.press(screen.getByText('‹ Aprende'));
  expect(screen).toHavePathname('/aprende');
});

test('un borrado pendiente bloquea también el enlace directo a check-in', () => {
  mockDatos.borrado = { tipo: 'todo', fase: 'remoto' };
  renderRouter(rutas, { initialUrl: '/check-in' });
  expect(screen.getByText('Reanudar borrado')).toBeTruthy();
  expect(screen.queryByText('¿Con qué intensidad?')).toBeNull();
});

test('un identificador de lección inexistente ofrece regreso y no produce una pantalla vacía', () => {
  renderRouter(rutas, { initialUrl: '/leccion/no-existe' });
  expect(screen.getByText('No encontramos esta lección')).toBeTruthy();
  fireEvent.press(screen.getByText('Volver a Aprende'));
  expect(screen).toHavePathname('/aprende');
});

test('la carga del teléfono conserva el enlace directo hasta restaurar el perfil', () => {
  const restaurados = mockDatos;
  mockDatos = null;
  renderRouter(rutas, { initialUrl: '/check-in' });
  expect(screen.queryByText('¿Con qué intensidad?')).toBeNull();
  act(() => mockSetDatos(restaurados));
  expect(screen).toHavePathname('/check-in');
  expect(screen.getByText('¿Con qué intensidad?')).toBeTruthy();
});

test('abrir una notificación espera el consentimiento y después llega a su herramienta', () => {
  const completo = mockDatos;
  mockDatos = { ...mockDatos, perfil: null };
  renderRouter(rutas, { initialUrl: '/' });
  act(() => mockNotificar('/respira'));
  expect(screen).toHavePathname('/bienvenida');
  act(() => mockSetDatos(completo));
  expect(screen).toHavePathname('/respira');
});
