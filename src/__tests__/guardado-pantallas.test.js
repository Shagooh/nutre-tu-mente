import React from 'react';
import { act, create } from 'react-test-renderer';
import CheckIn from '../screens/CheckIn';
import MeCuesta from '../screens/MeCuesta';
import { Boton, Chip, Escala, Opcion } from '../components/ui';
jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => ({ __esModule: true, default: require('react-native').View }));
// La primera carga del renderer nativo en Windows puede superar cinco segundos.
jest.setTimeout(15000);

test('check-in espera disco; un rechazo conserva formulario y permite reintentar', async () => {
  let rechazar;
  const guardar = jest.fn(() => new Promise((_, reject) => { rechazar = reject; }));
  let tree;
  await act(async () => { tree = create(<CheckIn onGuardar={guardar} onCerrar={jest.fn()} />); });
  await act(async () => { tree.root.findAllByProps({ accessibilityLabel: 'Tranquila' })[0].props.onPress(); });
  await act(async () => tree.root.findAllByType(Chip).find((c) => c.props.texto === 'poco').props.onPress());
  await act(async () => tree.root.findAllByType(Chip).find((c) => c.props.texto === 'Descansar').props.onPress());
  let promesa;
  await act(async () => {
    const enviar = tree.root.findAllByType(Boton).find((x) => x.props.titulo === 'Guardar').props.onPress;
    promesa = enviar();
    enviar();
  });
  expect(guardar).toHaveBeenCalledTimes(1);
  expect(JSON.stringify(tree.toJSON())).not.toContain('Gracias por mirarte hoy.');
  await act(async () => { rechazar(new Error('lleno')); await promesa; });
  expect(JSON.stringify(tree.toJSON())).toContain('Tus respuestas siguen aquí');
  expect(tree.root.findAllByType(Boton).find((x) => x.props.titulo === 'Guardar').props.disabled).toBe(false);
  guardar.mockResolvedValueOnce({});
  await act(async () => { await tree.root.findAllByType(Boton).find((x) => x.props.titulo === 'Guardar').props.onPress(); });
  expect(JSON.stringify(tree.toJSON())).toContain('Gracias por mirarte hoy.');
  expect(guardar.mock.calls[1][0].id).toBe(guardar.mock.calls[0][0].id);
  expect(guardar.mock.calls[1][0]).toMatchObject({ schemaVersion: 2, emocion: 'tranquila', intensidad: 1, necesidad: 'descansar' });
  expect(guardar.mock.calls[1][0].diaBosque).toBe(guardar.mock.calls[0][0].diaBosque);
  expect(guardar.mock.calls[1][0].instante).toBe(guardar.mock.calls[0][0].instante);
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
