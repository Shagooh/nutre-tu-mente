import { EMOCIONES_CHECKIN, INTENSIDADES_CHECKIN, NECESIDADES_CHECKIN } from './content/checkin';

// Instante de captura ISO con zona explícita; nunca usar orden de llegada ni hora del servidor.
// No interpretamos ánimo histórico como una emoción ni inventamos datos faltantes.
export function esCheckinEmocional(c) {
  return Boolean(c && typeof c.id === 'string' && c.id.length > 0
    && EMOCIONES_CHECKIN.some((e) => e.id === c.emocion)
    && INTENSIDADES_CHECKIN.some((i) => i.valor === c.intensidad)
    && NECESIDADES_CHECKIN.some((n) => n.id === c.necesidad)
    && typeof c.instante === 'string' && /(Z|[+-]\d{2}:\d{2})$/.test(c.instante)
    && Number.isFinite(Date.parse(c.instante)));
}

export function elegirCheckinDelDia(registros) {
  let elegido = null;
  for (const c of registros) {
    if (!esCheckinEmocional(c)) continue;
    if (!elegido || c.intensidad > elegido.intensidad
      || (c.intensidad === elegido.intensidad && (Date.parse(c.instante) > Date.parse(elegido.instante)
        || (Date.parse(c.instante) === Date.parse(elegido.instante) && c.id > elegido.id)))) elegido = c;
  }
  return elegido;
}
