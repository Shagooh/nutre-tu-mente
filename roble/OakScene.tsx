import React from "react";
import { bouquet, grain, knot, ribbon, shellScale, skeleton } from "./geometry";
import { ease, palettes, TreeConfig, unassigned } from "./model";
import { emotionalPalettes } from './emotions';

const ink = "#373d2c";
const lobes = [
  "M0 0Q-7 -7 -13 -11C-41 -13 -44 -31 -26 -32C-49 -39 -49 -57 -31 -54C-49 -73 -40 -88 -25 -76C-37 -98 -27 -110 -14 -98C-17 -119 -3 -132 4 -124C15 -115 11 -100 13 -96C32 -111 42 -95 27 -79C49 -89 48 -67 31 -57C56 -61 48 -39 26 -34C42 -32 34 -16 13 -14Q6 -10 0 0Z",
  "M0 0Q-9 -12 -18 -13C-38 -14 -45 -33 -24 -34C-53 -43 -46 -60 -27 -54C-46 -72 -38 -91 -23 -77C-30 -100 -17 -109 -8 -95C-6 -120 11 -127 15 -112Q19 -101 13 -88C35 -101 43 -84 25 -70C47 -78 52 -57 30 -48C50 -48 46 -28 22 -26C36 -18 21 -8 9 -9Z",
  "M0 0Q-11 -9 -18 -11C-41 -13 -38 -30 -22 -28C-48 -37 -47 -55 -29 -51C-45 -70 -37 -86 -21 -74C-31 -97 -18 -105 -8 -93C-14 -113 2 -128 11 -119C21 -109 12 -96 15 -91C36 -103 40 -85 24 -70C45 -83 52 -64 33 -51C55 -53 47 -33 27 -31C43 -25 29 -13 12 -12Z",
];
const veins =
  "M0 0Q3 -51 3 -108M2 -34Q14 -39 25 -44M3 -52Q-13 -57 -25 -66M4 -74Q17 -77 25 -88";
// All coordinates in these three silhouettes are absolute pairs. Flatten each
// rear spray into one path so its small leaves do not add hundreds of DOM nodes.
const profiles = lobes.map((path) =>
  Array.from(path.matchAll(/([MCQ])([^A-Z]+)/g), ([, command, points]) => ({
    command,
    points: points.trim().split(/\s+/).map(Number),
  })),
);
function rearBlade(leaf: ReturnType<typeof bouquet>["backLeaves"][number]) {
  const r = (leaf.angle * Math.PI) / 180,
    c = Math.cos(r),
    s = Math.sin(r);
  return (
    profiles[leaf.variant]
      .map(({ command, points }) => {
        const xy = [];
        for (let i = 0; i < points.length; i += 2) {
          const x = points[i] * leaf.sx,
            y = points[i + 1] * leaf.sy;
          xy.push(
            (leaf.x + c * x - s * y).toFixed(2),
            (leaf.y + s * x + c * y).toFixed(2),
          );
        }
        return command + xy.join(" ");
      })
      .join("") + "Z"
  );
}
const cap =
  "M445 804C443 781 458 767 482 766C507 764 525 778 527 793Q491 817 445 804Z";
const webElements = { Svg: "svg", Group: "g", Path: "path", Ellipse: "ellipse", Title: "title" } as const;
type OakProps = {
  elements?: Record<keyof typeof webElements, React.ElementType>;
  size?: number;
  tree: TreeConfig;
  time?: number;
  prefix?: string;
  small?: boolean;
  selected?: number;
  onSelect?: (day: number) => void;
  LeafSymbol?: React.ElementType;
};
export function Oak({
  tree,
  elements = webElements,
  size,
  time = tree.growthDay,
  prefix = "",
  small = false,
  selected,
  onSelect,
  LeafSymbol = 'text',
}: OakProps) {
  const { Svg, Group, Path, Ellipse, Title } = elements;
  const axes = skeleton(tree.seed, time);
  const days = Array.from({ length: tree.leafCount ?? Math.ceil(time) }, (_, i) => i + 1);
  // Paint the inspected bouquet in front of overlapping newer foliage.
  if (selected && days.includes(selected)) {
    days.splice(selected - 1, 1);
    days.push(selected);
  }
  const zoom = 1 + 1.25 * (1 - ease(time / 16));
  const seedScale = shellScale(time);
  const outlines = axes.map((_, index) => ribbon(axes, index));
  const wood = (kind: number) =>
    axes.map((a, i) => {
      if (a.kind !== kind || a.width < 0.05) return null;
      return (
        <Group key={i}>
          <Path d={outlines[i]} fill="#986f48" />
          {!small && (
            <Path
              d={grain(a)}
              fill="none"
              stroke="#d6ac73"
              strokeLinecap="round"
              strokeWidth={a.width * 0.17}
            />
          )}
          {!small && i > 0 && a.width > 3 && (
            <Path
              transform={knot(a)}
              d="M-2.1 0Q-.7 -1.05 .35 -.6Q1.4 -.24 2.3 0Q.3 -.16 -.15 .47Q-.85 .87 -2.1 0Z"
              fill="#714d34"
            />
          )}
        </Group>
      );
    });
  const seedTransform = `translate(507 833) scale(${seedScale}) translate(-507 -833)`;
  const root = ease(time / 2),
    flare = ease((time - 10) / 18);
  return (
    <Svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      aria-label={`Roble, día ${Math.ceil(time)}`}
      role="img"
    >
      <Group
        id={prefix + "tree"}
        transform={`translate(512 ${842 - 225 * (zoom - 1)}) scale(${zoom}) translate(-512 -842)`}
      >
        <Ellipse
          cx="510"
          cy={834 + flare * 16}
          rx={65 + flare * 105}
          ry={8 + flare * 8}
          fill="#526238"
          opacity=".16"
        />
        <Group id={prefix + "roots"}>
          <Path
            d="M483 838Q498 847 488 864T495 891Q481 881 483 871Q474 862 483 850Z"
            transform={`${seedTransform} translate(483 838) scale(${root}) translate(-483 -838)`}
            fill="#d6ae7b"
            stroke={ink}
            strokeWidth="3"
          />
          <Path
            transform={`translate(507 833) scale(${flare})`}
            d="M-52 -61Q-53 -10 -89 0Q-125 3 -141 21Q-108 11 -77 15Q-45 21 -24 11Q-28 29 -50 39Q-22 39 2 20Q23 7 46 17Q87 34 112 24Q79 16 58 -8Q48 -28 47 -58Z"
            fill="#996e47"
            stroke={ink}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </Group>
        <Group fill={ink} stroke={ink} strokeLinejoin="round" aria-hidden="true">
          {axes.map(
            (a, i) =>
              a.width > 0.05 && (
                <Path
                  key={i}
                  d={outlines[i].slice(0, -1)}
                  strokeWidth={Math.min(4, a.width * 0.35)}
                />
              ),
          )}
        </Group>
        <Group id={prefix + "trunk"}>
          {wood(0)}
          <Group
            transform={`translate(507 833) scale(${flare})`}
            fill="none"
            strokeLinecap="round"
          >
            <Path
              d="M-91 7Q-51 2 -38 -45T-30 -145M36 6Q12 -16 16 -63T6 -156"
              stroke="#6f503a"
              strokeWidth="4"
            />
            <Path
              d="M-19 -96C-38 -107 -37 -135 -24 -146C-13 -153 -4 -135 -7 -117Q-9 -101 -19 -96ZM-21 -106Q-32 -122 -22 -135Q-14 -126 -21 -106Z"
              fill="#795337"
              stroke="#614b34"
              strokeWidth="2"
            />
            <Path
              d="M-36 -147Q-27 -169 -31 -202M24 -71Q19 -57 25 -42"
              stroke="#dbb581"
              strokeWidth="3"
            />
          </Group>
        </Group>
        <Group id={prefix + "primary-branches"}>{wood(1)}</Group>
        <Group id={prefix + "secondary-branches"}>{wood(2)}</Group>
        <Group id={prefix + "seed"} transform={seedTransform}>
          {seedScale > 0 && (
            <>
              <Path
                d="M448 792Q479 778 522 793C529 815 506 839 484 844Q467 846 462 833Q446 822 448 792Z"
                fill="#d19a61"
                stroke={ink}
                strokeWidth="4"
              />
              <Path
                d="M456 803Q458 827 476 836"
                stroke="#f4cc8c"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <Path d={cap} fill="#786144" stroke={ink} strokeWidth="4" />
              {time > 0 && (
                <Path
                  d="M466 808Q486 809 512 796Q513 814 490 831Q472 836 466 822Z"
                  fill="#ead298"
                  stroke="#946d47"
                  strokeWidth="2"
                  opacity={ease(time)}
                />
              )}
              <Path
                d="M456 789l6 -5 6 2m6 -10 7 -4 6 3m7 8 7 -4 7 3M480 768Q472 754 478 750Q485 747 485 766"
                fill="#896942"
                stroke="#564a35"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          )}
        </Group>
        <Group id={prefix + "foliage"}>
          {days.map((day) => {
            const emotion = tree.emotions?.[day];
            const color = (emotion && emotionalPalettes[emotion]) || palettes[tree.moods[day]] || unassigned;
            const chosen = day === selected;
            const common = {
              id: prefix + "day-" + String(day).padStart(2, "0"),
              "data-day": day,
              onClick: onSelect ? () => onSelect(day) : undefined,
              style: onSelect ? { cursor: "pointer" } : undefined,
            };
            // Los días 30/31 usan la copa adulta 29 y anclajes propios consultables.
            const spray = bouquet(tree.seed, day, tree.leafCount ? Math.max(time, day) : time, axes);
            return (
              <Group key={day} {...common}>
                <Title>{`Día ${day} · ${color.label}`}</Title>
                <Group>
                  {spray.backLeaves.length > 0 && (
                    <Group aria-hidden="true">
                      <Path
                        d={spray.rearTwig}
                        fill="none"
                        stroke="#65553a"
                        strokeWidth={2 * spray.rearGrowth}
                      />
                      <Path
                        d={spray.backLeaves.map(rearBlade).join("")}
                        fill={color.shadow}
                        stroke={color.vein}
                        strokeWidth={1.4 * spray.rearGrowth}
                        strokeLinejoin="round"
                      />
                    </Group>
                  )}
                  <Path
                    d={spray.twig}
                    fill="none"
                    stroke="#66593c"
                    strokeWidth={1.4 + 2 * ease((time - 8) / 13)}
                    strokeLinecap="round"
                  />
                  {spray.leaves.map((leaf, i) => (
                    <Group
                      key={i}
                      opacity={leaf.opacity}
                      transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.sx} ${leaf.sy})`}
                    >
                      <Path
                        className="leaf-base"
                        d={lobes[leaf.variant]}
                        fill={color.base}
                        stroke={chosen ? "#fff9cb" : ink}
                        strokeWidth={chosen ? 6 : 2.9}
                        strokeLinejoin="round"
                      />
                      {i === 0 && tree.leafSymbols?.[day] ? (
                        <LeafSymbol x={4} y={-54} fontSize={32} textAnchor="middle" fill={color.vein}>
                          {tree.leafSymbols[day]}
                        </LeafSymbol>
                      ) : null}
                      {!small && (
                        <>
                          <Path
                            className="leaf-shadow"
                            d="M0 -3Q10 -24 22 -28Q9 -27 6 -35Q21 -51 29 -54Q14 -51 7 -49Q12 -68 21 -74Q9 -69 5 -67L4 -108Q-2 -53 0 -3Z"
                            fill={color.shadow}
                          />
                          <Path
                            className="leaf-highlight"
                            d="M-23 -59Q-30 -68 -26 -72M-11 -88Q-16 -96 -14 -98"
                            stroke={color.highlight}
                            fill="none"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <Path
                            className="leaf-vein"
                            d={veins}
                            fill="none"
                            stroke={color.vein}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                    </Group>
                  ))}
                </Group>
              </Group>
            );
          })}
        </Group>
      </Group>
    </Svg>
  );
}
