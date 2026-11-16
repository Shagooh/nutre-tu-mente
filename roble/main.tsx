import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { exportSvg, Oak, Thumbnail } from "./Oak";
import { Mood, palettes, phase, unassigned } from "./model";
import {
  Forest,
  MonthlyTree,
  newTree,
  readForest,
  sample,
  storageKey,
  writeForest,
} from "./storage";
import { useGrowth } from "./useGrowth";
import "./style.css";

const monthNames = Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat("es", { month: "long" }).format(new Date(2024, i, 1)),
);
const number = (n: number) => String(n).padStart(2, "0");
const now = new Date();
const today = now.getFullYear() + "-" + number(now.getMonth() + 1);
const getStorage = () => window.localStorage;
function Sprig() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" width="32" height="32">
      <path
        d="M5 28Q14 21 23 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M11 23Q1 22 3 12Q12 12 13 20M16 16Q10 13 12 6Q19 8 18 13M19 13Q21 3 29 3Q29 11 19 13M14 21Q20 13 28 15Q24 23 14 21"
        fill="currentColor"
      />
    </svg>
  );
}
function Editor({
  tree,
  update,
}: {
  tree: MonthlyTree;
  update: (tree: MonthlyTree) => void;
}) {
  const { time, go, play, playing } = useGrowth(tree.growthDay);
  const day = Math.round(time);
  const [picked, setPicked] = useState<number | null>(null);
  const active = picked !== null && picked <= day ? picked : day;
  const [monthYear, month] = tree.month.split("-");
  const color = palettes[tree.moods[active]] ?? unassigned;
  const select = (n: number) => {
    go(day, false);
    setPicked(n);
  };
  const exportFile = () => {
    const url = URL.createObjectURL(
      new Blob([exportSvg(tree, day)], { type: "image/svg+xml" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "roble-" + tree.month + "-dia-" + day + ".svg";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <article className="studio">
      <div className="plate">
        <div className="plateTitle">
          <span>Quercus robur</span>
          <span className="plateMonth">
            {monthNames[Number(month) - 1]} {monthYear}
          </span>
        </div>
        <div className="drawing">
          <Oak
            tree={tree}
            time={time}
            prefix="main-"
            selected={picked ?? undefined}
            onSelect={select}
          />
        </div>
        <div className="plateFooter">
          <span className="dayStamp">DÍA {number(day)}</span>
          <span>{phase(day)}</span>
          <button onClick={exportFile} aria-label="Descargar SVG">
            ↓ SVG
          </button>
        </div>
      </div>
      <section className="controls">
        <h2>El crecimiento</h2>
        <label htmlFor="time">
          Explorar día <strong>{number(day)} / 30</strong>
        </label>
        <input
          id="time"
          type="range"
          min="0"
          max="30"
          value={day}
          onChange={(e) => {
            const next = Number(e.target.value);
            setPicked(next);
            go(next, false);
          }}
        />
        <div className="actions">
          <button
            onClick={() => {
              setPicked(null);
              play();
            }}
          >
            {playing ? "Ⅱ Pausar" : "▷ Reproducir"}
          </button>
          <button
            disabled={tree.growthDay >= 30}
            onClick={() => {
              const next = tree.growthDay + 1;
              update({ ...tree, growthDay: next });
              setPicked(null);
              go(next);
            }}
          >
            Registrar día
          </button>
        </div>
        <hr />
        <h2>Emoción de la hoja</h2>
        <p className="selection" aria-live="polite">
          {active
            ? `Día ${number(active)} · ${active > tree.growthDay ? "Vista previa" : color.label}`
            : "La semilla aún no tiene registro."}
        </p>
        <div className="swatches">
          {(Object.keys(palettes) as Mood[]).map((m) => (
            <button
              key={m}
              aria-pressed={tree.moods[active] === m}
              disabled={!active || active > tree.growthDay}
              onClick={() => {
                go(day, false);
                setPicked(active);
                update({ ...tree, moods: { ...tree.moods, [active]: m } });
              }}
            >
              <i style={{ background: palettes[m].base }} />
              {palettes[m].label}
            </button>
          ))}
        </div>
        <label className="history">
          Historial del mes
          <select
            aria-label="Seleccionar hoja del historial"
            value={active <= tree.growthDay ? active : 0}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (n) {
                go(Math.max(day, n), false);
                setPicked(n);
              }
            }}
          >
            <option value="0">Elige un registro</option>
            {Array.from({ length: tree.growthDay }, (_, i) => (
              <option key={i} value={i + 1}>
                Día {number(i + 1)} ·{" "}
                {(palettes[tree.moods[i + 1]] ?? unassigned).label}
              </option>
            ))}
          </select>
        </label>
      </section>
    </article>
  );
}
function App() {
  const [loaded] = useState(() => readForest(getStorage));
  const [forest, setForest] = useState<Forest>(() =>
    loaded.saved ? loaded.forest : { [today]: sample(today) },
  );
  const [month, setMonth] = useState(
    () => Object.keys(forest).sort().at(-1) ?? today,
  );
  const [view, setView] = useState<"oak" | "forest">("oak");
  const [year, setYear] = useState(Number(month.slice(0, 4)));
  const [saved, setSaved] = useState(loaded.saved);
  const [message, setMessage] = useState(loaded.error);
  const tree = forest[month] ?? newTree(month);
  useEffect(() => {
    if (!saved) return;
    try {
      writeForest(getStorage, forest);
    } catch {
      setSaved(false);
      setMessage(
        "El guardado local no está disponible. Tus cambios siguen en esta sesión.",
      );
    }
  }, [forest, saved]);
  const update = (t: MonthlyTree) => setForest((f) => ({ ...f, [t.month]: t }));
  const open = (key: string) => {
    if (!forest[key]) update(newTree(key));
    setMonth(key);
    setView("oak");
  };
  const erase = () => {
    try {
      getStorage().removeItem(storageKey);
      setMessage("Se borraron los árboles de prueba.");
    } catch {
      setMessage(
        "No se pudo borrar el almacenamiento local. Puedes volver a intentarlo.",
      );
      return;
    }
    setSaved(false);
    setForest({});
    setMonth(today);
    setYear(now.getFullYear());
    setView("forest");
  };
  return (
    <>
      <header>
        <div className="brand">
          <Sprig /> Nutre tu mente
        </div>
        <nav aria-label="Vista">
          <button
            aria-current={view === "oak" ? "page" : undefined}
            onClick={() => setView("oak")}
          >
            Mi roble
          </button>
          <button
            aria-current={view === "forest" ? "page" : undefined}
            onClick={() => {
              setYear(Number(month.slice(0, 4)));
              setView("forest");
            }}
          >
            Bosque anual
          </button>
        </nav>
      </header>
      <main>
        <div className="heading">
          <h1>{view === "oak" ? "Roble emocional" : "Bosque anual"}</h1>
          <p>
            {view === "oak"
              ? "Explora las hojas de tu mes."
              : "Selecciona un mes para abrir su árbol."}
          </p>
        </div>
        {view === "oak" ? (
          <Editor key={month} tree={tree} update={update} />
        ) : (
          <section className="forest">
            <div className="year">
              <button
                aria-label="Año anterior"
                onClick={() => setYear((y) => Math.max(1000, y - 1))}
              >
                ←
              </button>
              <h2>{year}</h2>
              <button
                aria-label="Año siguiente"
                onClick={() => setYear((y) => Math.min(9999, y + 1))}
              >
                →
              </button>
            </div>
            <div className="months">
              {monthNames.map((name, i) => {
                const key = year + "-" + number(i + 1),
                  t = forest[key];
                return (
                  <button key={key} onClick={() => open(key)}>
                    {t ? (
                      <Thumbnail tree={t} />
                    ) : (
                      <span className="empty">＋</span>
                    )}
                    <strong>{name}</strong>
                    <small>{t ? `Día ${t.growthDay}` : "Crear árbol"}</small>
                  </button>
                );
              })}
            </div>
          </section>
        )}
        <footer>
          <span>
            {saved
              ? "Guardado en este navegador"
              : !loaded.saved && forest[today]?.growthDay === 30
                ? "Árbol inicial de muestra · Sesión de prueba"
                : "Sesión de prueba"}
          </span>
          <div>
            {!saved && (
              <button
                onClick={() => {
                  setMessage("");
                  setSaved(true);
                }}
              >
                Guardar en este navegador
              </button>
            )}
            <button onClick={erase}>Borrar datos de prueba</button>
          </div>
        </footer>
        {message && <p role="status">{message}</p>}
      </main>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
