import React from 'react';
import { act, create } from 'react-test-renderer';
import CheckIn from '../screens/CheckIn';
import MeCuesta from '../screens/MeCuesta';
import { Boton, Escala, Opcion } from '../components/ui';
import { ANIMOS } from '../content';
jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => ({ __esModule: true, default: require('react-native').View }));
// La primera carga del renderer nativo en Windows puede superar cinco segundos.
jest.setTimeout(15000);

test('check-in espera disco; un rechazo conserva formulario y permite reintentar', async () => {
  let rechazar;
  const guardar = jest.fn(() => new Promise((_, reject) => { rechazar = reject; }));
  let tree;
  await act(async () => { tree = create(<CheckIn onGuardar={guardar} onCerrar={jest.fn()} />); });
  await act(async () => { tree.root.findAllByProps({ accessibilityLabel: ANIMOS[0].texto })[0].props.onPress(); });
  let promesa;
  await act(async () => { promesa = tree.root.findAllByType(Boton).find((x) => x.props.titulo === 'Guardar').props.onPress(); });
  expect(JSON.stringify(tree.toJSON())).not.toContain('Gracias por detenerte');
  await act(async () => { rechazar(new Error('lleno')); await promesa; });
  expect(JSON.stringify(tree.toJSON())).toContain('Tus respuestas siguen aquí');
  expect(tree.root.findAllByType(Boton).find((x) => x.props.titulo === 'Guardar').props.disabled).toBe(false);
  guardar.mockResolvedValueOnce({});
  await act(async () => { await tree.root.findAllByType(Boton).find((x) => x.props.titulo === 'Guardar').props.onPress(); });
  expect(JSON.stringify(tree.toJSON())).toContain('Gracias por detenerte');
  await act(async () => tree.unmount());
});

test('cuesta no cierra antes del commit y un fallo conserva respuestas', async () => {
  const cerrar = jest.fn();
  const guardar = jest.fn().mockRejectedValueOnce(new Error('lleno')).mockResolvedValueOnce({});
  let tree;
  await act(async () => { tree = create(<MeCuesta onGuardar={guardar} onCerrar={cerrar} />); });
  const continuar = async () => {
    await act(async () => { await tree.root.findAllByType(Boton).find((x) => ['Continuar', 'Listo'].includes(x.props.titulo)).props.onPress(); });
  };
  await act(async () => tree.root.findByType(Escala).props.onCambio(3));
  await continuar();
  await act(async () => tree.root.findAllByType(Boton).find((x) => x.props.titulo === 'Saltar la respiración').props.onPress());
  await act(async () => tree.root.findAllByType(Opcion)[0].props.onPress());
  await continuar();
  // La necesidad se elige con Chip, el siguiente paso usa Opcion.
  const { Chip } = require('../components/ui');
  await act(async () => tree.root.findAllByType(Chip)[0].props.onPress());
  await continuar();
  await act(async () => tree.root.findAllByType(Chip)[0].props.onPress());
  await continuar();
  await act(async () => tree.root.findByType(Escala).props.onCambio(4));
  await continuar();
  expect(cerrar).not.toHaveBeenCalled();
  expect(JSON.stringify(tree.toJSON())).toContain('Tus respuestas siguen aquí');
  await continuar();
  expect(cerrar).toHaveBeenCalledTimes(1);
  await act(async () => tree.unmount());
});
