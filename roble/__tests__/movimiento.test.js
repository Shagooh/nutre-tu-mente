import React from "react";
import { act, create } from "react-test-renderer";
import { useGrowth } from "../useGrowth";

test("el reloj se interrumpe, respeta el movimiento reducido y se libera al desmontar", () => {
  let clock,
    frameId = 0;
  const frames = new Map();
  const previous = new Map();
  const override = (key, value) => {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      value,
      configurable: true,
      writable: true,
    });
  };
  const listeners = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const media = { ...listeners, matches: false };
  override("window", { matchMedia: () => media });
  override("document", listeners);
  override("requestAnimationFrame", (cb) => {
    frames.set(++frameId, cb);
    return frameId;
  });
  override("cancelAnimationFrame", (id) => frames.delete(id));
  function Probe() {
    clock = useGrowth(0);
    return null;
  }
  let view;
  try {
    act(() => {
      view = create(<Probe />);
    });
    act(() => clock.go(1));
    expect(frames.size).toBe(1);
    act(() => clock.go(12, false));
    expect(clock.time).toBe(12);
    expect(frames.size).toBe(0);
    media.matches = true;
    expect(window.matchMedia().matches).toBe(true);
    act(() => clock.go(13));
    expect(clock.time).toBe(13);
    expect(frames.size).toBe(0);
    act(() => clock.play());
    const next = Array.from(frames.values())[0];
    frames.clear();
    act(() => next(performance.now() + 320));
    expect(clock.time).toBe(13);
    act(() => clock.play());
    expect(clock.playing).toBe(false);
    expect(frames.size).toBe(0);
    media.matches = false;
    act(() => clock.go(14));
    act(() => view.unmount());
    expect(frames.size).toBe(0);
    expect(listeners.removeEventListener).toHaveBeenCalled();
  } finally {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
