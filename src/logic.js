import { ANIMOS, ETAPAS, FLORES, FRASES } from './content';

const dos = (n) => String(n).padStart(2, '0');
export const hoyISO = (d = new Date()) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
export const horaTexto = (h, m) => `${dos(h)}:${dos(m)}`;

const diaDelAnio = (d = new Date()) =>
  Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);

export function fraseDelDia(estilo = 'autocuidado') {
  const lista = FRASES[estilo] || FRASES.autocuidado;
  return lista[diaDelAnio() % lista.length];
}

export function saludo() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

// Puntos de cuidado: solo suben, nunca bajan.
export function puntos(d) {
  const diasCheck = new Set(d.checkins.map((c) => c.fecha)).size;
  const porDia = {};
  d.cuestas.forEach((c) => {
    porDia[c.fecha] = Math.min(3, (porDia[c.fecha] || 0) + 1);
  });
  const deCuesta = Object.values(porDia).reduce((a, b) => a + b, 0);
  return diasCheck + deCuesta + 2 * d.lecciones.length;
}

export function etapaPlanta(pts, floraId) {
  const etapa = [...ETAPAS].reverse().find((e) => pts >= e.desde);
  const flor = FLORES.find((f) => f.id === floraId) || FLORES[0];
  return { ...etapa, emoji: etapa.emoji || flor.final, flor };
}

export function ultimos7(d) {
  const nombres = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const f = new Date();
    f.setDate(f.getDate() - i);
    const fecha = hoyISO(f);
    const del = d.checkins.filter((c) => c.fecha === fecha);
    const animo = del.length ? Math.round(del.reduce((a, c) => a + c.animo, 0) / del.length) : null;
    dias.push({ fecha, etiqueta: nombres[f.getDay()], animo, emoji: animo ? ANIMOS[animo - 1].emoji : null });
  }
  return dias;
}

export function cambioCalma(d) {
  const con = d.cuestas.filter((c) => c.calmaAntes && c.calmaDespues);
  if (!con.length) return null;
  const prom = con.reduce((a, c) => a + (c.calmaDespues - c.calmaAntes), 0) / con.length;
  return { promedio: Math.round(prom * 10) / 10, veces: con.length };
}

export function cuestasUltimaSemana(d) {
  const limite = new Date();
  limite.setDate(limite.getDate() - 6);
  const desde = hoyISO(limite);
  return d.cuestas.filter((c) => c.fecha >= desde).length;
}

export function diasDesde(fechaISO) {
  if (!fechaISO) return Infinity;
  const [y, m, dd] = fechaISO.split('-').map(Number);
  return Math.floor((new Date() - new Date(y, m - 1, dd)) / 86400000);
}

export function logros(d) {
  const diasCheck = new Set(d.checkins.map((c) => c.fecha)).size;
  const respiraciones = d.cuestas.filter((c) => c.respiro).length;
  return [
    { id: 'l1', emoji: '🌱', texto: 'Hiciste tu primer check-in', ok: d.checkins.length >= 1 },
    { id: 'l2', emoji: '🤍', texto: 'Te acompañaste en un momento difícil', ok: d.cuestas.length >= 1 },
    { id: 'l3', emoji: '🌬️', texto: 'Respiraste con calma 5 veces', ok: respiraciones >= 5 },
    { id: 'l4', emoji: '📖', texto: 'Leíste tu primera mini lección', ok: d.lecciones.length >= 1 },
    { id: 'l5', emoji: '🌿', texto: 'Te escuchaste en 3 días distintos', ok: diasCheck >= 3 },
    { id: 'l6', emoji: '🔁', texto: 'Volviste después de un tiempo', ok: d.retornos >= 1 },
    { id: 'l7', emoji: '🌸', texto: 'Tu planta floreció', ok: puntos(d) >= 15 },
  ];
}
