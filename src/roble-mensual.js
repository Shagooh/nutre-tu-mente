import { diaConfirmado } from './reloj-bosque';

// El almacén vinculado ya está aislado por cuenta. La fecha del dispositivo
// nunca selecciona el árbol cuando falta una referencia de servidor.
export function proyectarRoble(uid, checkins, hoyFiable) {
  if (!uid) return null;
  const fechas = new Set();
  let ultima = '';
  for (const c of checkins) {
    const dia = diaConfirmado(c);
    if (dia) {
      fechas.add(dia);
      if (dia > ultima) ultima = dia;
    }
  }
  const mes = (hoyFiable && hoyFiable > ultima ? hoyFiable : ultima).slice(0, 7);
  if (!mes) return null;
  const dias = [...fechas].filter((dia) => dia.startsWith(mes)).length;
  const treeId = uid + '/' + mes;
  let seed = 17;
  for (const letra of treeId) seed = Math.imul(seed, 31) + letra.charCodeAt(0) | 0;
  return { mes, dias, tree: { treeId, seed, growthDay: Math.min(dias, 29), moods: {} } };
}
