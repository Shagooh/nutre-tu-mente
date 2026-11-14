import type { Emotion } from './emotions';

export const palettes = {
  happy: {
    label: "Alegría",
    base: "#e5b84d",
    shadow: "#b38835",
    highlight: "#ffe49c",
    vein: "#65532a",
  },
  calm: {
    label: "Calma",
    base: "#7fa768",
    shadow: "#527d50",
    highlight: "#ccdd8c",
    vein: "#385c43",
  },
  sad: {
    label: "Tristeza",
    base: "#88afc4",
    shadow: "#61859c",
    highlight: "#c7dfdf",
    vein: "#405e73",
  },
  anxious: {
    label: "Inquietud",
    base: "#af94b6",
    shadow: "#897597",
    highlight: "#e6cce4",
    vein: "#64536e",
  },
  energetic: {
    label: "Energía",
    base: "#df9469",
    shadow: "#b17553",
    highlight: "#ffd3a1",
    vein: "#714f39",
  },
  neutral: {
    label: "Neutral",
    base: "#a9b38b",
    shadow: "#758365",
    highlight: "#dce1af",
    vein: "#536246",
  },
};
export type Mood = keyof typeof palettes;
export interface TreeConfig {
  treeId: string;
  seed: number;
  growthDay: number;
  moods: Record<number, Mood>;
  emotions?: Record<number, Emotion>;
  leafSymbols?: Record<number, string>;
  leafCount?: number;
}
export const unassigned = {
  label: "Sin seleccionar",
  base: "#8cb261",
  shadow: "#57804a",
  highlight: "#c6de84",
  vein: "#385c39",
};
export function phase(day: number) {
  return day === 0
    ? "Semilla"
    : day <= 3
      ? "Germinación"
      : day <= 7
        ? "Plántula"
        : day <= 12
          ? "Árbol joven"
          : day <= 18
            ? "Desarrollo"
            : day <= 25
              ? "Maduración"
              : "Roble adulto";
}
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export function ease(n: number) {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
}

// Each channel is addressable. Adding another leaf never consumes randomness from older days.
export function variation(seed: number, channel: number) {
  let n = Math.imul(seed ^ Math.imul(channel, 0x9e3779b9), 0x85ebca6b);
  n ^= n >>> 13;
  return ((Math.imul(n, 0xc2b2ae35) >>> 0) / 4294967296) * 2 - 1;
}
