import React from 'react';
import { act, create } from 'react-test-renderer';
import { TextInput } from 'react-native';
import Onboarding from '../screens/Onboarding';
import Planta from '../components/Planta';
import Ajustes from '../screens/Ajustes';
import { Boton, Escala, Opcion } from '../components/ui';
import { BIENVENIDA } from '../content/bienvenida';
import { SLOTS } from '../content';

jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => ({ __esModule: true, default: require('react-native').View }));
jest.setTimeout(15000);

const boton = (tree, titulo) => tree.root.findAllByType(Boton).find((x) => x.props.titulo === titulo);
const texto = (tree) => JSON.stringify(tree.toJSON());
async function pulsar(tree, titulo = 'Continuar') {
  expect(boton(tree, titulo).props.disabled).not.toBe(true);
  await act(async () => { await boton(tree, titulo).props.onPress(); });
}
async function montar(props = {}) {
  let tree;
  await act(async () => { tree = create(<Onboarding onTerminar={jest.fn()} {...props} />); });
  return tree;
}
async function aceptar(tree) {
  expect(boton(tree, 'Acepto y continúo').props.disabled).toBe(true);
  await act(async () => tree.root.findAllByProps({ accessibilityRole: 'checkbox' })[0].props.onPress());
  await pulsar(tree, 'Acepto y continúo');
}
async function hastaBellota(tree) {
  await pulsar(tree, 'Saltar bienvenida');
  await aceptar(tree);
  await act(async () => tree.root.findByType(TextInput).props.onChangeText('  Ana  '));
  await pulsar(tree); // nombre
  await act(async () => tree.root.findAllByType(Opcion)[0].props.onPress());
  await pulsar(tree); // objetivo
  await act(async () => tree.root.findAllByType(Opcion)[2].props.onPress());
  await pulsar(tree); // momento
  // Elegir momento no activa recordatorios a escondidas.
  expect(tree.root.findAllByType(Opcion).every((x) => !x.props.activo)).toBe(true);
  await pulsar(tree); // sin recordatorios
  await pulsar(tree); // estilo por defecto
  expect(boton(tree, 'Continuar').props.disabled).toBe(true);
  await act(async () => tree.root.findByType(Escala).props.onCambio(3));
  await pulsar(tree); // espacio mental histórico 1–5
}

test('cuatro bienvenidas en orden; Saltar nunca evita el consentimiento', async () => {
  const tree = await montar();
  for (const pagina of BIENVENIDA.pantallas) {
    expect(texto(tree)).toContain(pagina.titulo);
    expect(texto(tree)).toContain('Contenido en revisión');
    await pulsar(tree);
  }
  await aceptar(tree);
  await act(async () => tree.unmount());
  const otra = await montar();
  await pulsar(otra, 'Saltar bienvenida');
  expect(boton(otra, 'Acepto y continúo').props.disabled).toBe(true);
  expect(otra.root.findAllByType(TextInput)).toHaveLength(0);
  await act(async () => otra.unmount());
});

test('solo ofrece roble; espera guardado, evita doble envío y permite reintento sin perder respuestas', async () => {
  let rechazar;
  const guardar = jest.fn(() => new Promise((_, reject) => { rechazar = reject; }));
  const tree = await montar({ onTerminar: guardar });
  await hastaBellota(tree);
  expect(texto(tree)).toContain('Todo empieza con una bellota');
  expect(tree.root.findAllByProps({ accessibilityRole: 'radio' })[0].props.accessibilityLabel).toBe('Roble, única especie disponible');
  expect(texto(tree)).not.toMatch(/Elige tu flor|Girasol|Tulipán/);
  await pulsar(tree, 'Atrás');
  expect(tree.root.findByType(Escala).props.valor).toBe(3);
  await pulsar(tree);
  await pulsar(tree);
  const enviar = boton(tree, 'Empezar').props.onPress;
  let pendiente;
  await act(async () => { pendiente = enviar(); enviar(); });
  expect(guardar).toHaveBeenCalledTimes(1);
  expect(boton(tree, 'Guardando…').props.disabled).toBe(true);
  expect(boton(tree, 'Atrás').props.disabled).toBe(true);
  const [perfil, espacio] = guardar.mock.calls[0];
  expect(perfil).toMatchObject({ nombre: 'Ana', flor: 'roble' });
  expect(perfil.recordatorios.every((r) => !r.activo)).toBe(true);
  expect(espacio).toBe(3);
  await act(async () => { rechazar(new Error('disco lleno')); await pendiente; });
  expect(texto(tree)).toContain('Tus respuestas siguen aquí');
  guardar.mockResolvedValueOnce({});
  await pulsar(tree, 'Empezar');
  expect(guardar.mock.calls[1][0]).toEqual(perfil);
  expect(guardar.mock.calls[1][1]).toBe(3);
  await act(async () => tree.unmount());
});

test('Inicio/Progreso no sustituyen roble por girasol y los perfiles históricos conservan su flor', async () => {
  let tree;
  await act(async () => { tree = create(<Planta flor="roble" pts={999} grande />); });
  expect(texto(tree)).toContain('Bellota de roble, semilla antes del primer check-in');
  expect(texto(tree)).toContain('Roble · Bellota');
  expect(texto(tree)).not.toContain('Girasol');
  await act(async () => tree.update(<Planta flor="rosa" pts={0} />));
  expect(texto(tree)).not.toContain('Bellota de roble, semilla antes del primer check-in');
  expect(texto(tree)).toContain('Rosa');
  await act(async () => tree.unmount());
});

test('Ajustes conserva el roble sin ofrecer flores y mantiene las elecciones antiguas', async () => {
  const props = { perfil: { nombre: 'Ana', flor: 'roble', recordatorios: SLOTS.map((s) => ({ ...s, activo: false })) } };
  let tree;
  await act(async () => { tree = create(<Ajustes {...props} />); });
  expect(texto(tree)).toContain('MI ÁRBOL');
  expect(texto(tree)).not.toContain('Girasol');
  await act(async () => tree.update(<Ajustes {...props} perfil={{ ...props.perfil, flor: 'rosa' }} />));
  expect(texto(tree)).toContain('MI FLOR');
  expect(texto(tree)).toContain('Rosa');
  await act(async () => tree.unmount());
});
