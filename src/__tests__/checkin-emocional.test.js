import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { EMOCIONES_CHECKIN, NECESIDADES_CHECKIN, RESPUESTAS_ESPECIALES, INVITACION_LOGRO, APOYO_INTENSIDAD, respuestaCheckin } from '../content/checkin';
import { elegirCheckinDelDia } from '../checkin-diario';
import { proyectarRoble } from '../roble-mensual';

const registro = (cambios = {}) => ({
  id: 'a', emocion: 'ansiosa', intensidad: 3, necesidad: 'comer',
  instante: '2026-11-13T12:00:00.000Z', _confirmadoMs: Date.parse('2026-11-13T12:00Z'),
  ...cambios,
});

test('catálogo exacto con diez emociones, siete necesidades y procedencia editorial por pieza', () => {
  expect(EMOCIONES_CHECKIN.map((e) => [e.texto, e.color])).toEqual([
    ['Tranquila', 'Verde'], ['Contenta', 'Amarillo'], ['Cansada', 'Lila'], ['Ansiosa', 'Naranjo'],
    ['Estresada', 'Morado'], ['Triste', 'Celeste'], ['Enojada o frustrada', 'Rojo'],
    ['Aburrida', 'Beige'], ['Sola', 'Azul'], ['No sé', 'Blanco perla'],
  ]);
  expect(NECESIDADES_CHECKIN).toHaveLength(7);
  expect(new Set(EMOCIONES_CHECKIN.map((e) => e.id)).size).toBe(10);
  expect(new Set(NECESIDADES_CHECKIN.map((n) => n.id)).size).toBe(7);
  for (const p of [...EMOCIONES_CHECKIN, ...NECESIDADES_CHECKIN, ...RESPUESTAS_ESPECIALES, INVITACION_LOGRO, APOYO_INTENSIDAD]) {
    expect(p).toMatchObject({ seccion: 8, version: '2026-10-26', estado: 'pendiente-revision-clinica', trato: 'tu', fase: 'V1' });
    expect(p.fuente).toBeTruthy();
  }
});

test('los textos clínicos permanecen literales respecto a la sección 8 de la fuente', () => {
  const fuente = fs.readFileSync(path.join(process.cwd(), 'docs/referencias/contenido-desarrollo-2026-10-26.md'), 'utf8');
  const seccion = fuente.slice(fuente.indexOf('## **8\\.'), fuente.indexOf('## **9\\.')).replace(/\\_/g, '_');
  for (const e of EMOCIONES_CHECKIN) expect(seccion).toContain(e.validacion);
  for (const n of [...NECESIDADES_CHECKIN, ...RESPUESTAS_ESPECIALES]) expect(seccion).toContain(n.accion);
  expect(seccion).toContain(INVITACION_LOGRO.texto);
  expect(seccion).toContain(APOYO_INTENSIDAD.texto);
});

test('todas las combinaciones resuelven la excepción antes de la acción normal', () => {
  for (const e of EMOCIONES_CHECKIN) for (const n of NECESIDADES_CHECKIN) {
    const especial = RESPUESTAS_ESPECIALES.find((r) => r.emociones.includes(e.id) && r.necesidad === n.id);
    const respuesta = respuestaCheckin(e.id, n.id, 2);
    expect(respuesta.validacion).toBe(e.validacion);
    expect(respuesta.accion).toBe((especial || n).accion);
    expect(respuesta.destinos).toEqual((especial || n).destinos);
    expect(Boolean(respuesta.logro)).toBe(['tranquila', 'contenta'].includes(e.id));
  }
  expect(respuestaCheckin('ansiosa', 'comer', 3).destinos).toEqual(['respira-1-min', 'tengo-hambre']);
  expect(respuestaCheckin('enojada', 'moverme', 3).destinos).toEqual([]);
});

test('ofrece apoyo solo para las cinco emociones previstas con intensidad mucho', () => {
  for (const e of EMOCIONES_CHECKIN) for (const intensidad of [1, 2, 3]) {
    expect(Boolean(respuestaCheckin(e.id, 'no-se', intensidad).apoyo)).toBe(
      intensidad === 3 && ['ansiosa', 'estresada', 'triste', 'enojada', 'sola'].includes(e.id)
    );
  }
  expect(respuestaCheckin('inexistente', 'comer', 3)).toBeNull();
  expect(respuestaCheckin('ansiosa', 'inexistente', 3)).toBeNull();
  expect(respuestaCheckin('ansiosa', 'comer', 5)).toBeNull();
});

test('tres check-ins dan una hoja y gana el último de intensidad máxima en todo orden de llegada', () => {
  const a = registro();
  const b = registro({ id: 'b', emocion: 'triste', instante: '2026-11-13T13:00:00Z' });
  const c = registro({ id: 'c', emocion: 'contenta', intensidad: 1, instante: '2026-11-13T14:00:00Z' });
  for (const lista of [[a, b, c], [a, c, b], [b, a, c], [b, c, a], [c, a, b], [c, b, a]]) {
    expect(elegirCheckinDelDia(lista)).toBe(b);
    expect(proyectarRoble('A', lista, null)).toMatchObject({ dias: 1, hojas: [{ fecha: '2026-11-13', registroId: 'b', emocion: 'triste', intensidad: 3, necesidad: 'comer' }] });
  }
  expect(a).toEqual(registro());
});

test('desempata por ID con el mismo instante aunque la zona o representación ISO difieran', () => {
  const a = registro({ id: 'a', instante: '2026-11-13T12:00:00Z' });
  const z = registro({ id: 'z', emocion: 'sola', instante: '2026-11-13T09:00:00-03:00' });
  expect(elegirCheckinDelDia([a, z])).toBe(z);
  expect(elegirCheckinDelDia([z, a])).toBe(z);
});

test('no convierte históricos ni registros incompletos y no usa provisionales para una hoja confirmada', () => {
  const historico = { id: 'old-1', animo: 5, necesidades: ['comer'], _confirmadoMs: registro()._confirmadoMs };
  const invalidos = [registro({ emocion: 'otra' }), registro({ intensidad: 5 }), registro({ necesidad: 'otra' }),
    registro({ instante: '2026-11-13T12:00' }), registro({ instante: 'inválido' }), registro({ id: '' })];
  expect(elegirCheckinDelDia([historico, ...invalidos])).toBeNull();
  expect(proyectarRoble('A', [historico, registro({ _confirmadoMs: undefined })], null)).toMatchObject({
    dias: 1, hojas: [{ fecha: '2026-11-13', emocion: null, intensidad: null, necesidad: null, registroId: null }],
  });
});

test('las fechas de recepción confirmadas agrupan la hoja y los días 30/31 conservan su detalle', () => {
  const lista = Array.from({ length: 31 }, (_, i) => registro({
    id: String(i), _confirmadoMs: Date.parse(`2026-12-${String(i + 1).padStart(2, '0')}T12:00Z`),
  }));
  const roble = proyectarRoble('A', [...lista].reverse(), '2026-12-31');
  expect(roble.tree.growthDay).toBe(29);
  expect(roble.hojas).toHaveLength(31);
  expect(roble.hojas.slice(-2).map((h) => [h.fecha, h.registroId])).toEqual([['2026-12-30', '29'], ['2026-12-31', '30']]);
  expect(proyectarRoble('A', lista, '2027-01-01').hojas).toEqual([]);
});
