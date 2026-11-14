import { router } from 'expo-router';

export const RUTAS_FLUJOS = { checkin: '/check-in', cuesta: '/me-esta-costando', pausa: '/respira', cuenta: '/cuenta', bosque: '/bosque' };
export const DESTINOS_RECORDATORIOS = { manana: '/check-in', mediodia: '/respira', tarde: '/me-esta-costando', noche: '/check-in' };
export function destinoNotificacion(datos) {
  const url = datos?.url;
  return Object.values(DESTINOS_RECORDATORIOS).includes(url) ? url : null;
}
export function abrirFlujo(id) {
  const destino = RUTAS_FLUJOS[id];
  if (destino) router.push(destino);
}
export function volver(inicio = '/') {
  if (router.canGoBack()) router.back(); else router.replace(typeof inicio === 'string' ? inicio : '/');
}
