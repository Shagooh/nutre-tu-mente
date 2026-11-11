import { clamp, ease, variation } from "./model";

type Point = [number, number];
type Axis = {
  start: Point;
  controlOffset: Point;
  tipOffset: Point;
  extension: number;
  width: number;
  kind: number;
  elbow: number;
  sway: number;
};
type Limb = [
  parent: number,
  at: number,
  birth: number,
  duration: number,
  cx: number,
  cy: number,
  x: number,
  y: number,
  width: number,
];
// Coordinates are offsets from the insertion on the parent, in the adult pose.
// The asymmetric elbows give the oak its low fork and spreading scaffold.
const limbs: Limb[] = [
  [-1, 0, 2, 20, -55, -270, 12, -555, 58],
  [0, 0.38, 8, 13, -115, -28, -195, -198, 34],
  [0, 0.49, 9, 13, 100, -15, 206, -187, 33],
  [0, 0.65, 12, 12, -80, -35, -119, -190, 23],
  [0, 0.74, 13, 12, 93, -32, 130, -158, 22],
  [1, 0.56, 13, 10, -59, 16, -151, -61, 17],
  [2, 0.62, 14, 11, 81, 14, 155, -77, 18],
  [1, 0.83, 15, 10, 13, -59, -48, -129, 16],
  [2, 0.82, 16, 10, -22, -60, 35, -130, 15],
  [3, 0.69, 17, 9, -55, -12, -103, -82, 13],
  [4, 0.8, 18, 9, 42, -25, 81, -91, 12],
  [0, 0.9, 18, 10, -7, -63, -60, -107, 14],
  [0, 0.94, 19, 10, 43, -33, 66, -100, 13],
  [5, 0.77, 19, 8, -36, 0, -63, -57, 10],
  [6, 0.68, 20, 8, 43, 3, 70, -45, 10],
  [7, 0.8, 21, 7, -49, 3, -80, -39, 10],
  [8, 0.7, 22, 7, 57, -4, 86, -46, 10],
  [3, 0.94, 22, 8, -6, -57, 26, -104, 11],
  [4, 0.65, 23, 7, -22, -55, -26, -110, 10],
];
export function along(a: Axis, t: number): Point {
  const s = 1 - t;
  // Two unequal bends between the socket and the tip give each limb its own rhythm.
  const kink =
    Math.sin(Math.PI * t) * Math.sin(Math.PI * (2 * t + a.elbow)) * a.sway;
  return [
    a.start[0] +
      a.extension *
        (2 * s * t * a.controlOffset[0] + t * t * a.tipOffset[0] + kink),
    a.start[1] +
      a.extension *
        (2 * s * t * a.controlOffset[1] + t * t * a.tipOffset[1] - kink * 0.35),
  ];
}
function tangent(a: Axis, t: number): Point {
  // Extension changes size only. Use the derivative of the full-length
  // local curve, even while its rendered ends still share the same pixel.
  const phase = Math.PI * (2 * t + a.elbow);
  const dk =
    a.sway *
    Math.PI *
    (Math.cos(Math.PI * t) * Math.sin(phase) +
      2 * Math.sin(Math.PI * t) * Math.cos(phase));
  const dx = 2 * (1 - 2 * t) * a.controlOffset[0] + 2 * t * a.tipOffset[0] + dk;
  const dy =
    2 * (1 - 2 * t) * a.controlOffset[1] + 2 * t * a.tipOffset[1] - 0.35 * dk;
  const length = Math.hypot(dx, dy) || 1;
  return [dx / length, dy / length];
}
function radius(a: Axis, t: number) {
  const knot = 1 + 0.24 * Math.exp(-Math.pow((t - a.elbow) / 0.085, 2));
  return a.width * Math.pow(1 - t, 0.76) * knot;
}
function surface(a: Axis, t: number, side: number): Point {
  const p = along(a, t),
    [dx, dy] = tangent(a, t),
    r = radius(a, t) * side;
  return [p[0] - dy * r, p[1] + dx * r];
}
export function skeleton(seed: number, day: number): Axis[] {
  const axes: Axis[] = [];
  for (const [parent, at, birth, duration, cx, cy, x, y, width] of limbs) {
    const id = axes.length,
      trunk = parent < 0;
    const start: Point = trunk
      ? [507, 834]
      : surface(axes[parent], at, Math.sign(x) * 0.91);
    const age = day - birth + 1;
    const length = trunk
      ? 0.13 * ease(age / 2) + 0.87 * ease((age - 2) / (duration - 2))
      : ease(age / duration);
    // A sapling gains height well before its trunk or its root flare thickens.
    const girth = ease(
      (day - Math.max(birth, 9)) / (trunk ? 19 : duration + 2),
    );
    const bend = variation(seed, id + 1) * 0.1;
    axes.push({
      start,
      controlOffset: [cx + cy * bend, cy],
      tipOffset: [x + y * bend, y],
      extension: length,
      width:
        (trunk ? 2.3 + width * girth : 1.5 + width * girth) *
        clamp(length * 14),
      elbow: 0.48 + 0.22 * variation(seed, 90 + id),
      sway:
        (trunk ? 14 : 19) *
        (0.75 + 0.25 * variation(seed, id + 62)) *
        (id % 2 ? -1 : 1),
      kind: trunk ? 0 : parent === 0 ? 1 : 2,
    });
  }
  return axes;
}
const steps = Array.from({ length: 19 }, (_, i) => i / 18);
const coords = (p: Point) => p.map((n) => n.toFixed(1)).join(" ");
export function ribbon(axes: Axis[], index: number) {
  const a = axes[index];
  const left = steps.map((t) => coords(surface(a, t, 1)));
  const right = steps.map((t) => coords(surface(a, t, -1))).reverse();
  if (index === 0) return "M" + left.concat(right).join(" L") + "Z";
  // Sweep the two edges of a branch into different points on the parent's
  // flank. Ending both on the same cross-section leaves a square notch.
  const [parent, at, , , , x] = limbs[index];
  const host = axes[parent],
    side = Math.sign(x);
  const direction = tangent(host, at),
    edge = surface(a, 0, 1);
  const upper =
    (edge[0] - a.start[0]) * direction[0] +
      (edge[1] - a.start[1]) * direction[1] >=
    0
      ? 1
      : -1;
  const length = Math.hypot(...host.tipOffset) * host.extension;
  const span = Math.min(0.13, (2.1 * a.width) / (length || 1));
  const collar = (sign: number) => {
    const t = clamp(at + sign * span);
    return {
      inner: coords(surface(host, t, side * 0.65)),
      bend: coords(surface(host, clamp(at + sign * span * 0.48), side * 0.98)),
    };
  };
  const first = collar(upper),
    last = collar(-upper);
  return (
    "M" +
    first.inner +
    " Q" +
    first.bend +
    " " +
    left[2] +
    " L" +
    left.slice(3).concat(right.slice(0, -2)).join(" L") +
    " Q" +
    last.bend +
    " " +
    last.inner +
    "Z"
  );
}
export function grain(a: Axis) {
  const points = steps.slice(1, 15).map((t) => coords(surface(a, t, 0.46)));
  return "M" + points.join(" L");
}
export function knot(a: Axis) {
  const center = surface(a, a.elbow, -0.3),
    [dx, dy] = tangent(a, a.elbow);
  const size = radius(a, a.elbow) * 0.42;
  return `translate(${coords(center)}) rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}) scale(${size})`;
}

// Each early leaf starts at a different height. As its supporting limb lengthens,
// sampling the same limb carries that leaf continuously from the stem to the crown.
const attachments = [
  1, 2, 3, 4, 11, 12, 0, 0, 1, 2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 3, 4, 9, 10, 11,
  12, 13, 14, 15, 16, 17,
];
const youngHeights = [0.22, 0.35, 0.45, 0.57, 0.65, 0.75, 0.87, 0.99];
const youngTilts = [-112, 92, -58, 73, -97, 106, -49, 24];
export const shellScale = (time: number) => 0.84 * (1 - ease((time - 2) / 6));

export function bouquet(seed: number, day: number, time: number, axes: Axis[]) {
  const id = attachments[day - 1],
    axis = axes[id],
    personal = (n: number) => variation(seed, day * 503 + n);
  const mature = ease((time - 8) / 12);
  const trunk = axes[0];
  const side = day % 2 ? -1 : 1;
  const branchAt = 0.56 + 0.38 * (0.5 + 0.5 * personal(1));
  const settle = day <= 8 ? ease((time - 8) / 8) : 1;
  let anchor = along(axis, branchAt);
  if (settle < 1) {
    const socket = id === 0 ? branchAt : limbs[id][1];
    const height = youngHeights[day - 1] * (1 - settle) + socket * settle;
    anchor = along(trunk, height);
    if (id !== 0) {
      const center = along(trunk, socket),
        onBranch = along(axis, branchAt * settle);
      anchor = [
        anchor[0] +
          onBranch[0] -
          axis.start[0] +
          (axis.start[0] - center[0]) * settle,
        anchor[1] +
          onBranch[1] -
          axis.start[1] +
          (axis.start[1] - center[1]) * settle,
      ];
    }
  }
  const [tx, ty] = tangent(axis, branchAt);
  const axisAngle = (Math.atan2(tx, -ty) * 180) / Math.PI;
  const youngAngle = side * (58 + 15 * personal(3));
  const grownAngle = axisAngle + personal(4) * 62;
  const angle = youngAngle + (grownAngle - youngAngle) * settle;
  const birth = ease(time - day + 1);
  const length =
    (18 + 6 * personal(5) + (52 + 24 * personal(6)) * mature) * birth;
  const curl = personal(7) * 27;
  const rad = (degrees: number) => (degrees * Math.PI) / 180;
  const onShoot = (t: number): Point => {
    const theta = rad(angle + curl * t);
    return [
      anchor[0] + Math.sin(theta) * length * t,
      anchor[1] - Math.cos(theta) * length * t,
    ];
  };
  let twig =
    "M" +
    coords(anchor) +
    " Q" +
    coords(onShoot(0.52)) +
    " " +
    coords(onShoot(1));
  const total = 4 + Math.floor((personal(8) + 1) * 2.45);
  const leaves = [];
  for (let i = 0; i < total; i++) {
    const emerge =
      i === 0 ? birth : ease((time - Math.max(8, day - 1) - i * 0.28) / 2.5);
    if (!emerge) continue;
    const t = i === 0 ? 1 : 0.13 + (0.79 * (i - 0.5)) / total;
    const pos = onShoot(t);
    const handed = i % 2 === 0 ? 1 : -1;
    const swing =
      i === 0 ? personal(9) * 33 : handed * (36 + 34 * (1 + personal(11 + i)));
    const grownTilt = angle + curl * t + swing;
    const tilt =
      (youngTilts[day - 1] ?? grownTilt) * (1 - settle) +
      grownTilt * settle +
      personal(18) * 8 * (1 - settle) +
      (1 - emerge) * 17;
    const size =
      (0.25 +
        0.13 * ease((time - 3) / 5) +
        (0.26 + 0.12 * personal(25 + i)) * mature) *
      (0.85 + 0.22 * personal(40 + i)) *
      emerge;
    leaves.push({
      x: pos[0],
      y: pos[1],
      angle: tilt,
      sx: size * (0.68 + 0.28 * personal(60 + i)),
      sy: size * (0.89 + 0.23 * personal(80 + i)),
      variant: Math.floor((personal(110 + i) + 1) * 1.5),
      opacity: ease(emerge / 0.18),
    });
  }
  if (day <= 3 && time < 8 && leaves.length) {
    // Keep one blade per record. It unfolds from the cutaway, independently
    // of the shrinking shell, then stays at the end of its growing petiole.
    const blade = leaves[0],
      scale = shellScale(time);
    const unfolded = ease(
      (time - 3 - (day - 1) * 0.25) / (4 + (3 - day) * 0.25),
    );
    const startX = 507 + (477 + (day - 1) * 12 - 507) * scale;
    const startY = 833 + (821 - (day - 1) * 3 - 833) * scale;
    const blend = (start: number, end: number) =>
      start + (end - start) * unfolded;
    blade.x = blend(startX, blade.x);
    blade.y = blend(startY, blade.y);
    blade.sx = blend(0.13 * birth, blade.sx);
    blade.sy = blend(0.12 * birth, blade.sy);
    blade.angle = blend(18, blade.angle);
    const mid = onShoot(0.52);
    twig = unfolded
      ? "M" +
        coords([blend(startX, anchor[0]), blend(startY, anchor[1])]) +
        " Q" +
        coords([blend(startX, mid[0]), blend(startY, mid[1])]) +
        " " +
        coords([blade.x, blade.y])
      : "";
  }
  // A second spray fills the depth of the mature crown. Its leaves are painted
  // as a compound silhouette, with a separate shoot and a seed-specific bearing.
  const rearGrowth = mature * birth;
  const rearAt = Math.min(0.98, branchAt + 0.12);
  const rearStart = along(axis, rearAt);
  const rearAngle =
    angle + (personal(132) > 0 ? 1 : -1) * (43 + 31 * personal(133));
  const reach = (66 + 27 * personal(134)) * rearGrowth;
  const backLeaves = [];
  const rearTip: Point = [
    rearStart[0] + Math.sin(rad(rearAngle)) * reach,
    rearStart[1] - Math.cos(rad(rearAngle)) * reach,
  ];
  if (rearGrowth > 0) {
    const count = 4 + Math.floor((1 + personal(136)) * 2.49);
    for (let i = 0; i < count; i++) {
      const t = 0.15 + (0.85 * i) / (count - 1);
      const bladeAngle =
        rearAngle +
        (i === count - 1
          ? 0
          : (i % 2 ? 1 : -1) * (43 + 28 * personal(140 + i)));
      backLeaves.push({
        x: rearStart[0] + (rearTip[0] - rearStart[0]) * t,
        y: rearStart[1] + (rearTip[1] - rearStart[1]) * t,
        angle: bladeAngle,
        sx: rearGrowth * (0.65 + 0.18 * personal(150 + i)),
        sy: rearGrowth * (0.72 + 0.22 * personal(160 + i)),
        variant: (day + i) % 3,
      });
    }
  }
  return {
    rearGrowth,
    twig,
    leaves,
    backLeaves,
    rearTwig: "M" + coords(rearStart) + " L" + coords(rearTip),
  };
}
