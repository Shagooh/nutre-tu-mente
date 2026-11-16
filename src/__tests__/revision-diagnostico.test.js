import { fireEvent, render, screen } from '@testing-library/react-native';
import RevisionDiagnostico from '../screens/RevisionDiagnostico';
import { DIAGNOSTICO, PREFERENCIAS } from '../content/incorporacion';

const pulsar = texto => fireEvent.press(screen.getByText(texto));
const continuar = () => pulsar('Continuar');
const opcion = (numero, indice) => DIAGNOSTICO.preguntas[numero - 1].opciones[indice].texto;

test('revisa las doce preguntas, omite, vuelve, limita selecciones y detiene salidas pendientes', () => {
  const terminar = jest.fn();
  render(<RevisionDiagnostico onTerminar={terminar} />);
  pulsar('Probar con datos ficticios');
  for (let numero = 1; numero <= 11; numero++) {
    expect(screen.getByText(DIAGNOSTICO.preguntas[numero - 1].texto)).toBeTruthy();
    if ([2, 3, 11].includes(numero)) {
      const ultima = DIAGNOSTICO.preguntas[numero - 1].opciones.at(-1).texto;
      pulsar(opcion(numero, 0));
      pulsar(ultima);
      expect(screen.getByRole('button', { name: opcion(numero, 0) })).not.toBeSelected();
      pulsar(opcion(numero, 0));
      expect(screen.getByRole('button', { name: ultima })).not.toBeSelected();
    }
    if (numero === 9) {
      for (let i = 0; i < 4; i++) pulsar(opcion(numero, i));
      expect(screen.getByRole('button', { name: opcion(numero, 3) })).not.toBeSelected();
      pulsar(opcion(numero, 0));
      pulsar(opcion(numero, 3));
      continuar();
      pulsar('Atrás');
      expect(screen.getByRole('button', { name: opcion(numero, 3) })).toBeSelected();
    }
    pulsar('Saltar');
    if ([5, 8].includes(numero)) {
      expect(screen.getByText(DIAGNOSTICO.validaciones['diag-' + numero])).toBeTruthy();
      continuar();
    }
  }
  expect(screen.queryByText('Saltar')).toBeNull();
  expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled();
  pulsar(opcion(12, 0));
  continuar();
  expect(screen.getByText('Derivación pendiente de revisión clínica')).toBeTruthy();
  pulsar('Volver a la pregunta');
  pulsar('Ninguna');
  continuar();
  fireEvent.changeText(screen.getByLabelText('Apodo ficticio'), ' Sol ');
  continuar();
  expect(screen.getByText('Conciencia')).toBeTruthy();
  pulsar('Empezar');
  pulsar(PREFERENCIAS.preguntas[0].opciones[2].texto);
  continuar();
  pulsar('Menos de 18');
  continuar();
  expect(screen.getByText('Orientación para menores pendiente de revisión clínica')).toBeTruthy();
  pulsar('Volver a la pregunta');
  pulsar('25–34');
  continuar();
  pulsar('Saltar');
  for (const pref of PREFERENCIAS.preguntas.slice(3, 6)) {
    pulsar(pref.opciones[0].texto);
    continuar();
  }
  pulsar('Saltar');
  pulsar('Ir a Inicio');
  expect(terminar).toHaveBeenCalledWith('Sol', expect.objectContaining({ schemaVersion: 1,
    diagnostico: expect.objectContaining({ 'diag-9': null, 'diag-10': null, 'diag-12': ['ninguna'] }) }));
  pulsar('Reiniciar con respuestas vacías');
  expect(screen.getByText('Probar con datos ficticios')).toBeTruthy();
});
