import { proyectarRoble } from '../roble-mensual';
import React from 'react';
import { act, create } from 'react-test-renderer';
import Planta from '../components/Planta';
const dia = (fecha) => ({ _confirmadoMs: Date.parse(fecha + 'T12:00Z') });
test('el último mes confirmado sobrevive al reinicio y los días provisionales o repetidos no suman', () => {
  const lista = [dia('2026-10-31'), dia('2026-11-01'), dia('2026-11-01'), { fecha: '2099-12-10' }];
  expect(proyectarRoble('A', lista, null)).toMatchObject({ mes: '2026-11', dias: 1 });
  expect(proyectarRoble('A', lista, '2026-12-01')).toMatchObject({ mes: '2026-12', dias: 0 });
  expect(proyectarRoble(null, lista, null)).toBeNull();
  expect(proyectarRoble('A', lista, null).tree.seed).not.toBe(proyectarRoble('B', lista, null).tree.seed);
});
test('31 fechas siguen contando aunque el último dibujo corresponda al índice 29', () => {
  const lista = Array.from({ length: 31 }, (_, i) => dia('2026-12-' + String(i + 1).padStart(2, '0')));
  expect(proyectarRoble('A', lista, null)).toMatchObject({ dias: 31, tree: { growthDay: 29 } });
});

test('el primer día confirmado sustituye la bellota por el SVG del brote', async () => {
  let vista;
  await act(async () => { vista = create(<Planta flor="roble" uid="A" checkins={[]} grande />); });
  expect(JSON.stringify(vista.toJSON())).toContain('Roble · Bellota');
  await act(async () => vista.update(<Planta flor="roble" uid="A" checkins={[dia('2026-11-01')]} grande />));
  const resultado = JSON.stringify(vista.toJSON());
  expect(resultado).toContain('Roble · 2026-11 · 1 día registrado');
  expect(resultado).toContain('day-01');
  await act(async () => vista.unmount());
});
