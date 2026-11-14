import { diaConfirmado } from './reloj-bosque';
import { esCheckinEmocional } from './checkin-diario';

export const VERSION_CALENDARIO = 1;
export function fechaBosqueValida(fecha) {
  if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const ms = Date.parse(fecha + 'T12:00:00Z');
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === fecha;
}
export const identidadBosqueValida = (id) => typeof id === 'string' && /^[A-Za-z0-9-]{1,80}$/.test(id);

// La versión 1 amplía únicamente el calendario. No activa diagnóstico ni datos clínicos V1.
export function validarCalendario(c) {
  if (![VERSION_CALENDARIO, 2].includes(c?.schemaVersion) || !fechaBosqueValida(c.diaBosque)) return false;
  if (c.schemaVersion === 2 && (!esCheckinEmocional(c)
    || !Object.keys(c).every((key) => ['schemaVersion', 'id', 'fecha', 'hora', 'diaBosque', 'instante',
      'emocion', 'intensidad', 'necesidad', 'cuidado', '_s', '_captura', '_confirmadoMs'].includes(key))
    || !/^[A-Za-z0-9_-]{1,128}$/.test(c.id)
    || !fechaBosqueValida(c.fecha) || !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(c.hora)
    || ('animo' in c) || ('necesidades' in c)
    || (c.cuidado !== undefined && (typeof c.cuidado !== 'string' || c.cuidado.length > 280)))) return false;
  if (c.instante === undefined) return true; // Históricos: nunca inventar instante.
  return typeof c.instante === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(c.instante)
    && Number.isFinite(Date.parse(c.instante)) && new Date(c.instante).toISOString() === c.instante;
}

export function migrarCalendario(c) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) throw new Error('storage/invalid');
  if (c.schemaVersion !== undefined) {
    if (!validarCalendario(c)) throw new Error('storage/invalid');
    return c;
  }
  const diaBosque = diaConfirmado(c) ?? c.fecha;
  if (!fechaBosqueValida(diaBosque)) throw new Error('storage/invalid');
  const siguiente = { ...c, schemaVersion: VERSION_CALENDARIO, diaBosque };
  if (!validarCalendario(siguiente)) throw new Error('storage/invalid');
  // También deben subirse los metadatos añadidos a registros ya sincronizados.
  if (c._s) siguiente._s = false;
  return siguiente;
}

export function diaDelBosque(c) {
  return c.schemaVersion === undefined ? diaConfirmado(c) ?? (fechaBosqueValida(c.fecha) ? c.fecha : null)
    : validarCalendario(c) ? c.diaBosque : null;
}
export const fechaConfirmada = (c) => Boolean(diaDelBosque(c) && diaDelBosque(c) === diaConfirmado(c));
