import React, { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import Ajustes from '../screens/Ajustes';
import Onboarding from '../screens/Onboarding';
import CheckIn from '../screens/CheckIn';
import { EstadoApp } from '../estado-app';
import { cambiarTrato } from '../trato-personal';

jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => ({ __esModule: true, default: require('react-native').View }));
jest.setTimeout(20000);

test.each(['Él', 'Ella', 'Neutro'])('bienvenida conserva %s al retroceder y permite omitir', (opcion) => {
  render(<Onboarding onTerminar={jest.fn()} />);
  fireEvent.press(screen.getByRole('button', { name: 'Saltar bienvenida' }));
  fireEvent.press(screen.getByRole('checkbox'));
  fireEvent.press(screen.getByRole('button', { name: 'Acepto y continúo' }));
  expect(screen.getByText('Sin elegir · usamos lenguaje neutro')).toBeTruthy();
  fireEvent.press(screen.getByRole('radio', { name: opcion }));
  fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
  expect(screen.getByLabelText('Tu nombre o apodo')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Atrás' }));
  expect(screen.getByRole('radio', { name: opcion })).toBeChecked();
});

test('Perfil antiguo conserva elección ante fallo y cambia lenguaje solo al guardar', async () => {
  const guardar = jest.fn().mockRejectedValueOnce(new Error('lleno')).mockResolvedValue(undefined);
  function AppPrueba() {
    const [perfil, setPerfil] = useState({ nombre: 'Ana', recordatorios: [], flor: 'roble' });
    return <EstadoApp.Provider value={{ datos: { perfil } }}>
      <Ajustes perfil={perfil} onCambiarPerfil={async cambio => { await guardar(cambio); setPerfil(p => cambiarTrato(p, cambio)); }} />
      <CheckIn onGuardar={jest.fn()} />
    </EstadoApp.Provider>;
  }
  render(<AppPrueba />);
  expect(screen.getByRole('radio', { name: 'Con ansiedad' })).toBeTruthy();
  fireEvent.press(screen.getByRole('radio', { name: 'Él' }));
  expect(screen.queryByRole('radio', { name: 'Ansioso' })).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Guardar cambios' }));
  await waitFor(() => expect(screen.getByText(/No pudimos guardar. Tu preferencia/)).toBeTruthy());
  expect(screen.getByRole('radio', { name: 'Con ansiedad' })).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Guardar cambios' }));
  await waitFor(() => expect(screen.getByRole('radio', { name: 'Ansioso' })).toBeTruthy());
  for (const [nombre, etiqueta] of [['Ella', 'Ansiosa'], ['Neutro', 'Con ansiedad']]) {
    fireEvent.press(screen.getByRole('radio', { name: nombre }));
    fireEvent.press(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(screen.getByRole('radio', { name: etiqueta })).toBeTruthy());
  }
  expect(guardar).toHaveBeenLastCalledWith({ trato: 'neutro' });
});
