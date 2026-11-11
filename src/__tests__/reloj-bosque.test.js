import { crearReloj, diaConfirmado } from '../reloj-bosque';

test('la hora civil modificada no mueve el día anclado; reiniciar invalida capturas', () => {
  let tick = 100;
  let id = 0;
  const reloj = crearReloj(() => tick, () => ++id);
  const ms = Date.parse('2026-12-01T02:59:58Z');
  reloj.ajustar(ms);
  const registro = reloj.capturar();
  expect(registro.fecha).toBe('2026-11-30');
  const relojManual = jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2040-01-01'));
  try {
    tick += 3000;
    expect(reloj.hoy()).toBe('2026-12-01');
    expect(diaConfirmado({ ...registro, fecha: '2040-01-01', _confirmadoMs: ms })).toBe('2026-11-30');
    expect(diaConfirmado(registro)).toBeNull();
    expect(reloj.reciente(registro._captura)).toBe(true);
    tick += 16000;
    expect(reloj.reciente(registro._captura)).toBe(false);
    const pendiente = reloj.capturar();
    reloj.reiniciar();
    expect(reloj.reciente(pendiente._captura)).toBe(false);
  } finally { relojManual.mockRestore(); }
});
