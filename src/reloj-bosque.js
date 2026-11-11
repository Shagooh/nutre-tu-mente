// Una referencia solo vale en la misma ejecución en primer plano.
import { randomUUID } from 'expo-crypto';

const formato = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

export function calendarioBosque(ms) {
  const p = Object.fromEntries(formato.formatToParts(ms).map(({ type, value }) => [type, value]));
  return { fecha: [p.year, p.month, p.day].join('-'), hora: [p.hour, p.minute].join(':') };
}

export function crearReloj(monotono, idSesion) {
  let sesion = idSesion();
  let referencia = null;
  function estimacion() {
    if (!referencia) return null;
    const delta = monotono() - referencia.tick;
    return delta >= 0 && delta < 6 * 3600000 ? referencia.ms + delta : null;
  }
  return {
    capturar() {
      const ms = estimacion();
      return {
        ...calendarioBosque(ms ?? Date.now()),
        _captura: { sesion, tick: monotono() },
      };
    },
    reciente(captura) {
      if (!captura || captura.sesion !== sesion) return false;
      const edad = monotono() - captura.tick;
      return edad >= 0 && edad <= 15000;
    },
    ajustar(ms) { if (Number.isFinite(ms)) referencia = { ms, tick: monotono() }; },
    hoyFiable() {
      const ms = estimacion();
      return ms == null ? null : calendarioBosque(ms).fecha;
    },
    hoy() { return calendarioBosque(estimacion() ?? Date.now()).fecha; },
    reiniciar() { sesion = idSesion(); referencia = null; },
  };
}

export const relojBosque = crearReloj(() => globalThis.performance?.now?.() ?? NaN, randomUUID);
export function diaConfirmado(registro) {
  return Number.isFinite(registro._confirmadoMs) ? calendarioBosque(registro._confirmadoMs).fecha : null;
}
