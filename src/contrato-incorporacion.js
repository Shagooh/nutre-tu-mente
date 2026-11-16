import { DIAGNOSTICO, PREFERENCIAS } from './content/incorporacion';

const exclusivas = { 'diag-2': 'ninguna', 'diag-3': 'nada', 'diag-11': 'nada', 'diag-12': 'ninguna' };
const limites = { 'diag-9': 3, 'pref-4': 2 };
const perfiles = { conciencia: 'Conciencia', habitos: 'Hábitos', bienestar: 'Bienestar' };

export function perfilDiagnostico(respuestas) {
  return perfiles[respuestas['diag-10']?.[0]] ?? 'Conciencia';
}

function maximo(pregunta) {
  return pregunta.tipo.startsWith('Única') ? 1 : limites[pregunta.id] ?? pregunta.opciones.length;
}

export function seleccionarRespuesta(pregunta, anteriores, id) {
  if (anteriores.includes(id)) return anteriores.filter(valor => valor !== id);
  const exclusiva = exclusivas[pregunta.id];
  if (maximo(pregunta) === 1 || id === exclusiva) return [id];
  const otras = anteriores.filter(valor => valor !== exclusiva);
  return otras.length < maximo(pregunta) ? [...otras, id] : anteriores;
}

function respuestasValidas(respuestas, preguntas) {
  if (!respuestas || typeof respuestas !== 'object' || Array.isArray(respuestas)
    || Object.keys(respuestas).length !== preguntas.length) return false;
  return preguntas.every(p => {
    if (!Object.hasOwn(respuestas, p.id)) return false;
    const valor = respuestas[p.id];
    if (valor === null) return p.omisible || p.tipo.includes('opcional');
    return Array.isArray(valor) && valor.length > 0 && valor.length <= maximo(p)
      && new Set(valor).size === valor.length
      && valor.every(id => p.opciones.some(o => o.id === id))
      && (valor.length === 1 || !valor.includes(exclusivas[p.id]));
  });
}

// diag-1 conserva sus cuatro IDs originales. El seguimiento mental usa valor 1–5.
export function incorporacionValida(datos) {
  return datos?.schemaVersion === 1 && Object.keys(datos).length === 3
    && respuestasValidas(datos.diagnostico, DIAGNOSTICO.preguntas)
    && respuestasValidas(datos.preferencias, PREFERENCIAS.preguntas);
}

// Contrato de la elección mensual. Las hojas se derivan de los registros diarios.
const especies = ['roble', 'araucaria', 'quillay', 'cerezo', 'sauce', 'olivo', 'jacaranda'];
export function arbolMensualValido(arbol) {
  return arbol?.schemaVersion === 1 && typeof arbol.mes === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(arbol.mes)
    && especies.includes(arbol.especie)
    && Object.keys(arbol).every(k => ['schemaVersion', 'mes', 'especie', 'nombre'].includes(k))
    && (!Object.hasOwn(arbol, 'nombre') || (typeof arbol.nombre === 'string' && arbol.nombre.trim().length > 0));
}

export function crearPerfilRevision(nombre, incorporacion) {
  if (typeof nombre !== 'string' || !nombre.trim() || nombre.trim().length > 30
    || !incorporacionValida(incorporacion) || incorporacion.diagnostico['diag-12'][0] !== 'ninguna'
    || incorporacion.preferencias['pref-2'][0] === 'menor-18') throw new Error('revision/incompleta');
  return { schemaVersion: 1, nombre: nombre.trim(), incorporacion, flor: 'roble',
    estilo: incorporacion.preferencias['pref-4'][0], recordatorios: [] };
}
