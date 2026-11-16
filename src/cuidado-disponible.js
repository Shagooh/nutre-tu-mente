import { respuestaCheckin } from './content/checkin';

// Solo recursos implementados. Son borradores de desarrollo, no aprobación clínica.
export const RECURSOS_CUIDADO = {
  'respira-1-min': { href: '/respira', titulo: 'Respira 1 minuto' },
  'me-esta-costando': { href: '/me-esta-costando', titulo: 'Me está costando' },
};
export function cuidadoDisponible(emocion, necesidad, intensidad) {
  const respuesta = respuestaCheckin(emocion, necesidad, intensidad);
  if (!respuesta) return null;
  const completa = respuesta.destinos.every((id) => RECURSOS_CUIDADO[id]);
  return {
    validacion: respuesta.validacion,
    accion: completa ? respuesta.accion : null,
    recursos: completa ? respuesta.destinos.map((id) => RECURSOS_CUIDADO[id]) : [],
    apoyo: respuesta.apoyo ? { ...RECURSOS_CUIDADO['me-esta-costando'], texto: respuesta.apoyo.texto } : null,
  };
}
