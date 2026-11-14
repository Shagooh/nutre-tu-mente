import React from 'react';
import { act, create } from 'react-test-renderer';
import { router } from 'expo-router';
import { cuidadoDisponible } from '../cuidado-disponible';
import { abrirFlujo, destinoNotificacion, volver } from '../navegacion';
import CheckIn from '../screens/CheckIn';
import { Boton, Chip } from '../components/ui';

jest.mock('expo-router', () => ({ router: { push: jest.fn(), back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn() } }));
jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => ({ __esModule: true, default: require('react-native').View }));
beforeEach(() => jest.clearAllMocks());

test('solo enlaza destinos implementados, sin prometer secuencias o audios ausentes', () => {
  expect(cuidadoDisponible('ansiosa', 'comer', 3)).toMatchObject({ accion: null, recursos: [], apoyo: { href: '/me-esta-costando' } });
  expect(cuidadoDisponible('cansada', 'descansar', 1)).toMatchObject({ accion: null, recursos: [] });
  expect(cuidadoDisponible('sola', 'momento', 3)).toMatchObject({ accion: null, recursos: [] });
  expect(cuidadoDisponible('enojada', 'moverme', 2).accion).toContain('camina rápido 5 minutos');
  expect(cuidadoDisponible('no-se', 'no-se', 1).recursos).toEqual([{ href: '/respira', titulo: 'Respira 1 minuto' }]);
  expect(cuidadoDisponible('otra', 'comer', 3)).toBeNull();
});

test('volver usa historial y tiene un destino seguro al entrar por enlace directo', () => {
  router.canGoBack.mockReturnValue(true);
  volver();
  expect(router.back).toHaveBeenCalledTimes(1);
  router.canGoBack.mockReturnValue(false);
  volver('/aprende');
  expect(router.replace).toHaveBeenCalledWith('/aprende');
  volver({ nativeEvent: {} });
  expect(router.replace).toHaveBeenCalledWith('/');
});

test('flujos y notificaciones rechazan rutas ajenas a los destinos previstos', () => {
  abrirFlujo('cuesta');
  expect(router.push).toHaveBeenCalledWith('/me-esta-costando');
  abrirFlujo('https://ajeno.invalid');
  expect(router.push).toHaveBeenCalledTimes(1);
  expect(destinoNotificacion({ url: '/respira' })).toBe('/respira');
  for (const url of ['https://ajeno.invalid', '/cuenta', '/check-in?nota=privado', {}, null]) {
    expect(destinoNotificacion({ url })).toBeNull();
  }
});

test('después de guardar ofrece ayuda para intensidad mucho y conserva el cierre del formulario', async () => {
  const abrir = jest.fn();
  let vista;
  await act(async () => { vista = create(<CheckIn onGuardar={jest.fn(async () => {})} onCerrar={jest.fn()} onAbrirCuidado={abrir} />); });
  await act(async () => vista.root.findByProps({ accessibilityLabel: 'Ansiosa' }).props.onPress());
  for (const texto of ['mucho', 'Comer']) {
    await act(async () => vista.root.findAllByType(Chip).find((c) => c.props.texto === texto).props.onPress());
  }
  await act(async () => vista.root.findAllByType(Boton).find((b) => b.props.titulo === 'Guardar').props.onPress());
  await act(async () => vista.root.findAllByType(Boton).find((b) => b.props.titulo === 'Me está costando').props.onPress());
  expect(abrir).toHaveBeenCalledWith('/me-esta-costando');
  expect(JSON.stringify(vista.toJSON())).toContain('Tu registro está guardado.');
  expect(JSON.stringify(vista.toJSON())).not.toContain('¿Tengo hambre?');
  await act(async () => vista.unmount());
});
