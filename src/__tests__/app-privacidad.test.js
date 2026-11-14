import React from 'react';
import { act, create } from 'react-test-renderer';
import * as Sentry from '@sentry/react-native';
import { iniciarReportes, detenerReportes } from '../reportes';

let mockDatos = null;
jest.mock('../store', () => ({ useStore: () => ({ datos: mockDatos, actualizar: jest.fn(), reintentar: jest.fn() }) }));
jest.mock('../useNube', () => ({ useNube: () => ({}) }));
jest.mock('../firebase', () => ({ nubeActiva: false }));
jest.mock('../cuenta', () => ({}));
jest.mock('../notifications', () => ({ programarRecordatorios: jest.fn() }));
jest.mock('../screens/Onboarding', () => () => null);
jest.mock('../screens/Hoy', () => () => null);
jest.mock('../components/Planta', () => () => null);
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(), setTag: jest.fn(), wrap: (Component) => Component,
  captureException: jest.fn(), withScope: jest.fn(),
}));
jest.mock('../reportes', () => ({ iniciarReportes: jest.fn(), detenerReportes: jest.fn() }));

test('importar App no inicia Sentry y renderizar respeta consentimiento/borrado', async () => {
  const App = require('../../App').default;
  expect(Sentry.init).not.toHaveBeenCalled();
  let tree;
  await act(async () => { tree = create(<App />); });
  expect(iniciarReportes).not.toHaveBeenCalled();
  mockDatos = { perfil: { consentimiento: '2026-11-07', nombre: 'A', recordatorios: [] }, checkins: [], cuestas: [], lecciones: [] };
  await act(async () => { tree.update(<App />); });
  expect(iniciarReportes).toHaveBeenCalledTimes(1);
  mockDatos = { perfil: null };
  await act(async () => { tree.update(<App />); });
  expect(detenerReportes).toHaveBeenCalled();
  expect(Sentry.init).not.toHaveBeenCalled();
  await act(async () => { tree.unmount(); });
});
