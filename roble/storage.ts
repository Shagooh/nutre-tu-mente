import { palettes, TreeConfig } from "./model";
export interface MonthlyTree extends TreeConfig {
  version: 1;
  month: string;
}
export type Forest = Record<string, MonthlyTree>;
export const storageKey = "nutrimind.roble-laboratorio.v1";
export function newTree(month: string): MonthlyTree {
  return {
    version: 1,
    month,
    treeId: month,
    seed: Math.imul(Number(month.replace("-", "")), 2654435761),
    growthDay: 0,
    moods: {},
  };
}
export function sample(month: string): MonthlyTree {
  const tree = newTree(month);
  const tones = [
    "calm",
    "calm",
    "happy",
    "neutral",
    "calm",
    "sad",
    "anxious",
    "calm",
    "energetic",
  ] as const;
  for (let day = 1; day <= 30; day++)
    tree.moods[day] = tones[(day * 5) % tones.length];
  return { ...tree, growthDay: 30 };
}
function valid(key: string, tree: MonthlyTree) {
  return (
    /^\d{4}-(0[1-9]|1[0-2])$/.test(key) &&
    tree &&
    tree.version === 1 &&
    tree.month === key &&
    tree.treeId === key &&
    Number.isSafeInteger(tree.seed) &&
    Number.isInteger(tree.growthDay) &&
    tree.growthDay >= 0 &&
    tree.growthDay <= 30 &&
    tree.moods &&
    typeof tree.moods === "object" &&
    !Array.isArray(tree.moods) &&
    Object.entries(tree.moods).every(
      ([d, m]) =>
        String(Number(d)) === d &&
        Number.isInteger(Number(d)) &&
        Number(d) >= 1 &&
        Number(d) <= tree.growthDay &&
        Object.hasOwn(palettes, m),
    )
  );
}
export function readForest(getStorage: () => Storage): {
  forest: Forest;
  saved: boolean;
  error: string;
} {
  try {
    const raw = getStorage().getItem(storageKey);
    if (raw === null) return { forest: {}, saved: false, error: "" };
    const data = JSON.parse(raw);
    if (
      data?.version !== 1 ||
      !data.trees ||
      typeof data.trees !== "object" ||
      Array.isArray(data.trees) ||
      !Object.entries(data.trees).every(([k, t]) => valid(k, t as MonthlyTree))
    )
      throw new Error();
    return { forest: data.trees, saved: true, error: "" };
  } catch {
    return {
      forest: {},
      saved: false,
      error: "No se pudo leer el bosque local. Puedes explorar en memoria.",
    };
  }
}
export function writeForest(getStorage: () => Storage, forest: Forest) {
  getStorage().setItem(
    storageKey,
    JSON.stringify({ version: 1, trees: forest }),
  );
}
