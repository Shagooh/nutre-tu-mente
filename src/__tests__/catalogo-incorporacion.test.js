import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BIENVENIDA } from '../content/bienvenida';
import { DIAGNOSTICO, PREFERENCIAS, PENDIENTES_EDITORIALES } from '../content/incorporacion';

const fuente = readFileSync(resolve(BIENVENIDA.fuente), 'utf8')
  .replaceAll('\\[', '[').replaceAll('\\]', ']');
const secciones = fuente.split(/^## \*\*\d+\\\. /m);

test.each([
  [BIENVENIDA, 2], [DIAGNOSTICO, 3], [PREFERENCIAS, 4],
])('identifica la edición en revisión de la sección %#', (catalogo, seccion) => {
  expect(catalogo).toMatchObject({
    fuente: 'docs/referencias/contenido-desarrollo-2026-10-26.md',
    version: '2026-10-26', fase: 'V1', estado: 'pendiente-revision-clinica', trato: 'neutro', seccion,
  });
});

test('las cuatro bienvenidas y el consentimiento conservan la copia entregada en §2', () => {
  const { pantallas, siguiente, saltar, consentimiento, transicion } = BIENVENIDA;
  expect(pantallas).toHaveLength(4);
  expect(pantallas[3].funciones).toHaveLength(4);
  const citas = [
    siguiente, saltar, ...pantallas.slice(0, 3).flatMap(p => [p.titulo, p.texto]),
    ...pantallas[3].funciones.map(([, descripcion]) => descripcion),
    consentimiento.aviso, consentimiento.boton, transicion,
  ];
  expect(citas).toEqual(Array.from(secciones[2].matchAll(/"([^"]+)"/g), m => m[1]));
  for (const [titulo, descripcion] of pantallas[3].funciones) {
    expect(secciones[2]).toContain(titulo + ' → "' + descripcion + '"');
  }
});

test.each([[DIAGNOSTICO, 'diag', 12], [PREFERENCIAS, 'pref', 7]])(
  'coteja preguntas, opciones completas y orden con la tabla original %#', (catalogo, prefijo, total) => {
    const filas = secciones[catalogo.seccion].split('\n').filter(linea => /^\| \d+ \|/.test(linea));
    expect(filas).toHaveLength(total);
    expect(catalogo.preguntas).toHaveLength(total);
    filas.forEach((fila, indice) => {
      const [, numero, texto, tipo, contenido] = fila.split('|').map(celda => celda.trim());
      const pregunta = catalogo.preguntas[indice];
      expect(pregunta).toMatchObject({ id: prefijo + '-' + numero, texto, tipo });
      const opciones = contenido.split(/\. (?:Define la variante|Si marca menos|Después de elegir)/)[0]
        .split(' · ').map(opcion => opcion.replace(/^"(.*)"$/, '$1'));
      expect(pregunta.opciones.map(o => o.texto)).toEqual(opciones);
      const ids = pregunta.opciones.map(o => o.id);
      expect(new Set(ids).size).toBe(opciones.length);
    });
  }
);

test('respeta omisiones, posición de validaciones y textos de nombre y resultado', () => {
  expect(DIAGNOSTICO.preguntas.map(p => p.omisible)).toEqual([...Array(11).fill(true), false]);
  for (const numero of [5, 8]) {
    const filas = secciones[3].split('\n');
    const indice = filas.findIndex(fila => fila.startsWith('| ' + numero + ' |'));
    expect(filas[indice + 1].trim()).toBe('| — | *Pantalla de validación* | — | "' + DIAGNOSTICO.validaciones['diag-' + numero] + '" |');
  }
  expect(Object.keys(DIAGNOSTICO.resultados)).toEqual(['Conciencia', 'Hábitos', 'Bienestar']);
  for (const [perfil, mensaje] of Object.entries(DIAGNOSTICO.resultados)) {
    expect(secciones[3]).toContain('| ' + perfil + ' | "' + mensaje + '" |');
  }
  for (const texto of [...Object.values(DIAGNOSTICO.nombre), DIAGNOSTICO.tituloFunciones, DIAGNOSTICO.botonResultado]) {
    expect(secciones[3]).toContain('"' + texto + '"');
  }
  expect(secciones[4]).toContain('Después de elegir: "' + PREFERENCIAS.mensajeTiempo + '"');
});

test('identifica variantes y textos pendientes para revisión editorial', () => {
  const pendientes = [];
  for (const pregunta of [...DIAGNOSTICO.preguntas, ...PREFERENCIAS.preguntas]) {
    for (const pieza of [pregunta, ...pregunta.opciones]) {
      if (pieza.trato === 'femenino') {
        expect(pieza.variantesPendientes).toEqual(['masculino', 'neutro']);
        pendientes.push(pieza === pregunta ? pregunta.id : pregunta.id + '/' + pieza.id);
      }
    }
  }
  expect(pendientes).toEqual(['diag-4/cansancio', 'diag-6', 'diag-9/compania', 'diag-9/tranquilidad', 'diag-11/juicio', 'pref-3/cuidados']);
  expect(PENDIENTES_EDITORIALES.map(p => p.id)).toEqual([
    'consentimiento-casilla', 'consentimiento-aviso', 'resultado-conciencia-momento-omitido',
    'resultado-conciencia-varios-momentos', 'orientacion-menor-de-edad',
  ]);
});
