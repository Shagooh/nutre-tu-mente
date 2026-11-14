import { relojBosque } from './reloj-bosque';
import { diaDelBosque, fechaConfirmada } from './contrato-bosque';
import { elegirCheckinDelDia } from './checkin-diario';
import { EMOCIONES_CHECKIN } from './content/checkin';

// La identidad es visual, no una credencial. El almacén ya está aislado por cuenta.
export function proyectarRoble(bosqueId, checkins, hoy = relojBosque.hoy()) {
  if (!bosqueId) return null;
  const fechas = new Map();
  for (const c of checkins) {
    const dia = diaDelBosque(c);
    if (dia) {
      if (!fechas.has(dia)) fechas.set(dia, []);
      fechas.get(dia).push(c);
    }
  }
  const mes = (hoy ?? relojBosque.hoy()).slice(0, 7);
  if (!mes) return null;
  const hojas = [...fechas.keys()].filter((dia) => dia.startsWith(mes)).sort().map((fecha) => {
    const elegido = elegirCheckinDelDia(fechas.get(fecha));
    return {
      fecha,
      registroId: elegido?.id ?? null,
      emocion: elegido?.emocion ?? null,
      intensidad: elegido?.intensidad ?? null,
      necesidad: elegido?.necesidad ?? null,
      provisional: !fechas.get(fecha).some(fechaConfirmada),
      sincronizada: fechas.get(fecha).every((c) => c._s === true),
    };
  });
  const dias = hojas.length;
  const treeId = bosqueId + '/' + mes;
  let seed = 17;
  for (const letra of treeId) seed = Math.imul(seed, 31) + letra.charCodeAt(0) | 0;
  const emotions = {};
  const leafSymbols = {};
  const frecuencias = new Map();
  hojas.forEach((hoja, i) => {
    if (!hoja.emocion) return;
    emotions[i + 1] = hoja.emocion;
    leafSymbols[i + 1] = EMOCIONES_CHECKIN.find((e) => e.id === hoja.emocion).icono;
    frecuencias.set(hoja.emocion, (frecuencias.get(hoja.emocion) || 0) + 1);
  });
  // Se cuenta una emoción por día, sin duplicar los días con varias capturas.
  const resumen = [...frecuencias].map(([emocion, dias]) => ({ emocion, dias }))
    .sort((a, b) => b.dias - a.dias || (a.emocion < b.emocion ? -1 : a.emocion > b.emocion ? 1 : 0)).slice(0, 3);
  return { mes, dias, hojas, resumen, tree: { treeId, seed, growthDay: Math.min(dias, 29), moods: {}, emotions, leafSymbols, leafCount: dias } };
}
