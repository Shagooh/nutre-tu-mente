import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { exportSvg, Thumbnail } from "../Oak";
import { bouquet, skeleton } from "../geometry";
import { palettes } from "../model";
import {
  newTree,
  sample,
  readForest,
  writeForest,
  storageKey,
} from "../storage";

const tree = sample("2026-11");
test("las hojas visibles mantienen una orientación continua cuando brota su rama", () => {
  for (const month of ["2026-02", "2026-11"]) {
    const { seed } = sample(month);
    let maxTurn = 0;
    const previous = new Map();
    for (let frame = 8 * 45; frame <= 19 * 45; frame++) {
      const time = frame / 45;
      const axes = skeleton(seed, time);
      for (let day = 1; day <= 8; day++) {
        const leaf = bouquet(seed, day, time, axes).leaves[0];
        const earlier = previous.get(day);
        if (earlier !== undefined) {
          const turn = Math.abs(((leaf.angle - earlier + 540) % 360) - 180);
          maxTurn = Math.max(maxTurn, turn);
        }
        previous.set(day, leaf.angle);
      }
    }
    expect(maxTurn).toBeLessThan(8);
  }
});
test("doce copas adultas usan doce imágenes estáticas en el DOM del bosque", () => {
  const forest = Array.from({ length: 12 }, (_, i) =>
    sample("2026-" + String(i + 1).padStart(2, "0")),
  );
  const markup = renderToStaticMarkup(
    <div>
      {forest.map((t) => (
        <Thumbnail tree={t} key={t.month} />
      ))}
    </div>,
  );
  expect(markup.match(/<img /g)).toHaveLength(12);
  expect(markup).not.toContain("<svg");
  expect(markup).not.toContain("leaf-highlight");
});
function daily(markup) {
  return markup
    .split(/(?=<g id="day-)/)
    .slice(1)
    .map((part) => part.split("<title>")[1].split("</svg>")[0]);
}
test("treinta avances distintos y acumulativos, reproducibles desde cualquier posición", () => {
  const states = Array.from({ length: 31 }, (_, day) => exportSvg(tree, day));
  expect(new Set(states).size).toBe(31);
  for (const [day, svg] of states.entries()) {
    expect(svg.match(/data-day="/g)?.length ?? 0).toBe(day);
    expect(svg).not.toMatch(/NaN|Infinity/);
    for (let i = 1; i <= day; i++)
      expect(svg).toContain('id="day-' + String(i).padStart(2, "0") + '"');
  }
  expect(exportSvg(tree, 10)).toBe(states[10]);
  expect(exportSvg(tree, 30)).toBe(states[30]);
  expect(skeleton(tree.seed + 1, 30)).not.toEqual(skeleton(tree.seed, 30));
});
test("solo se recolorea el grupo diario corregido, incluidas sus cuatro capas", () => {
  const before = daily(exportSvg(tree, 30));
  const after = daily(
    exportSvg({ ...tree, moods: { ...tree.moods, 12: "happy" } }, 30),
  );
  expect(
    after.map((s, i) => (s !== before[i] ? i + 1 : null)).filter(Boolean),
  ).toEqual([12]);
  for (const [key, color] of Object.entries(palettes.happy)) {
    if (key !== "label") expect(after[11]).toContain(color);
  }
});
test("la semilla da paso a ocho hojas y cada uno de los primeros registros conserva su color", () => {
  const juvenile = exportSvg(tree, 8);
  expect(juvenile.match(/class="leaf-base"/g)).toHaveLength(8);
  expect(juvenile).toMatch(/<g id="seed"[^>]*><\/g>/);
  for (const age of [3, 4, 5, 5.5, 6, 7, 8]) {
    const groups = daily(exportSvg(tree, age));
    for (const group of groups.slice(0, 3)) {
      expect(group.match(/class="leaf-base"/g)).toHaveLength(1);
      expect(group).not.toMatch(/opacity="(?!1")/);
    }
  }
  for (const day of [1, 2, 3]) {
    for (const age of [3, 6, 8, 30]) {
      const original = daily(exportSvg(tree, age));
      const edited = daily(
        exportSvg(
          { ...tree, moods: { ...tree.moods, [day]: "energetic" } },
          age,
        ),
      );
      expect(edited[day - 1]).toContain(palettes.energetic.base);
      expect(
        edited.filter((group, index) => group !== original[index]),
      ).toHaveLength(1);
    }
  }
});
test("exportación autónoma con identificadores canónicos únicos", () => {
  const svg = exportSvg(tree, 30);
  const ids = Array.from(svg.matchAll(/ id="([^"]+)"/g), (m) => m[1]);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).toEqual(
    expect.arrayContaining([
      "tree",
      "roots",
      "seed",
      "trunk",
      "primary-branches",
      "secondary-branches",
      "foliage",
    ]),
  );
  expect(svg).toContain('viewBox="0 0 1024 1024"');
  expect(svg).not.toMatch(/<image|<script/);
});
function memory() {
  const map = new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
  };
}
test("bosque local conserva los doce meses por año y las dos paletas tras recargar", () => {
  const storage = memory();
  const trees = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => {
      const month = "2026-" + String(i + 1).padStart(2, "0");
      return [month, sample(month)];
    }),
  );
  trees["2027-01"] = newTree("2027-01");
  trees["2026-11"].moods[12] = "sad";
  writeForest(() => storage, trees);
  const read = readForest(() => storage);
  expect(read).toEqual({ forest: trees, saved: true, error: "" });
  expect(read.forest["2026-11"].moods[11]).toBe(tree.moods[11]);
  expect(exportSvg(read.forest["2026-11"], 30)).toBe(
    exportSvg(trees["2026-11"], 30),
  );
});
test("datos incompatibles, corruptos o bloqueados dejan disponible la sesión", () => {
  const store = memory();
  expect(readForest(() => store).saved).toBe(false);
  for (const raw of [
    "{",
    JSON.stringify({
      version: 1,
      trees: { "2026-11": { ...tree, growthDay: 31 } },
    }),
    JSON.stringify({
      version: 1,
      trees: { "2026-11": { ...tree, moods: { 12: "unknown" } } },
    }),
  ]) {
    store.setItem(storageKey, raw);
    expect(readForest(() => store)).toMatchObject({
      saved: false,
      forest: {},
      error: expect.any(String),
    });
  }
  expect(
    readForest(() => {
      throw Error();
    }).error,
  ).toBeTruthy();
});
