import { useCallback, useEffect, useRef, useState } from "react";

export function useGrowth(initial: number) {
  const [time, setTime] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const frame = useRef(0);
  const position = useRef(initial);
  const move = useCallback((value: number) => {
    position.current = value;
    setTime(value);
  }, []);
  const stop = useCallback(() => {
    cancelAnimationFrame(frame.current);
    setPlaying(false);
  }, []);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const interrupt = () => {
      stop();
      move(Math.round(position.current));
    };
    document.addEventListener("visibilitychange", interrupt);
    query.addEventListener("change", interrupt);
    return () => {
      cancelAnimationFrame(frame.current);
      document.removeEventListener("visibilitychange", interrupt);
      query.removeEventListener("change", interrupt);
    };
  }, [move, stop]);
  const go = (target: number, animate = true) => {
    stop();
    const from = position.current;
    if (
      !animate ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      move(target);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 450);
      move(from + (target - from) * t);
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };
  const play = () => {
    if (playing) {
      stop();
      move(Math.round(position.current));
      return;
    }
    stop();
    const from = position.current >= 30 ? 0 : Math.round(position.current);
    const start = performance.now();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setPlaying(true);
    move(from);
    const step = (now: number) => {
      const value = Math.min(30, from + (now - start) / 750);
      move(reduced ? Math.floor(value) : value);
      if (value < 30) frame.current = requestAnimationFrame(step);
      else setPlaying(false);
    };
    frame.current = requestAnimationFrame(step);
  };
  return { time, go, play, playing };
}
