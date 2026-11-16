import { observarAperturas, programarRecordatorios } from '../notifications';
import * as N from 'expo-notifications';
import { Platform } from 'react-native';

jest.mock('expo-router', () => ({ router: {} }));
jest.mock('expo-notifications', () => ({
  addNotificationResponseReceivedListener: jest.fn(), getLastNotificationResponse: jest.fn(), clearLastNotificationResponse: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => {}), getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(async () => {}), SchedulableTriggerInputTypes: { DAILY: 'daily' },
  setNotificationChannelAsync: jest.fn(async () => {}), AndroidImportance: { DEFAULT: 3 },
}));
const respuesta = (id, url, date = 1) => ({ actionIdentifier: 'abrir', notification: { date, request: { identifier: id, content: { data: { url } } } } });
beforeEach(() => { jest.clearAllMocks(); });

test('los recordatorios se guardan con el destino específico sin datos personales', async () => {
  await programarRecordatorios(['manana', 'mediodia', 'tarde', 'noche'].map((id) => ({ id, activo: true, h: 10, m: 0 })));
  expect(N.scheduleNotificationAsync.mock.calls.map(([r]) => r.content.data)).toEqual([
    { url: '/check-in' }, { url: '/respira' }, { url: '/me-esta-costando' }, { url: '/check-in' },
  ]);
});

test('arranque y escucha abren una vez, limpian la respuesta y se desuscriben', () => {
  const quitar = jest.fn();
  let listener;
  N.addNotificationResponseReceivedListener.mockImplementation((fn) => { listener = fn; return { remove: quitar }; });
  const inicial = respuesta('a', '/check-in');
  N.getLastNotificationResponse.mockReturnValue(inicial);
  const abrir = jest.fn();
  const cerrar = observarAperturas(abrir);
  listener(inicial);
  listener(respuesta('b', 'https://ajeno.invalid'));
  listener(respuesta('c', '/respira'));
  listener(respuesta('a', '/check-in', 2)); // Otro día del mismo aviso repetitivo.
  expect(abrir.mock.calls).toEqual([['/check-in'], ['/respira'], ['/check-in']]);
  expect(N.clearLastNotificationResponse).toHaveBeenCalledTimes(4);
  cerrar();
  expect(quitar).toHaveBeenCalledTimes(1);
});

test('la web no registra listeners nativos', () => {
  const anterior = Platform.OS;
  Platform.OS = 'web';
  try { observarAperturas(jest.fn())(); } finally { Platform.OS = anterior; }
  expect(N.addNotificationResponseReceivedListener).not.toHaveBeenCalled();
});
