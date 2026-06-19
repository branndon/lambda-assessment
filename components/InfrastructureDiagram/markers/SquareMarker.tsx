import { project, polygon, ACCENT_DIM, ACCENT_PURPLE } from '../utils';
import type { MarkerProps } from '../utils';

/** Slab 1 — concentric dotted isometric squares + small RGB-aberration square at centre */
export default function SquareMarker({ idx, lit }: MarkerProps) {
  const ringScales = [0.88, 0.78, 0.68, 0.58, 0.48, 0.38, 0.28, 0.18];

  const isoSquare = (s: number): [number, number][] => [
    project(-s, -s, idx), project(s, -s, idx),
    project(s,   s, idx), project(-s,  s, idx),
  ];

  const cs     = 0.11;
  const centre = isoSquare(cs);
  const mainStroke = lit ? ACCENT_DIM : ACCENT_PURPLE;

  return (
    <g>
      {/* Concentric dotted rings */}
      {ringScales.map(s => (
        <polygon
          key={s}
          points={polygon(isoSquare(s))}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.65"
          strokeDasharray="1.8 4"
        />
      ))}

      {/* Central square — RGB aberration + fill */}
      <polygon
        points={polygon(centre.map(([x, y]) => [x + 1, y - 1] as [number, number]))}
        fill="none" stroke="#00e6ff" strokeWidth="0.8" opacity="0.7"
      />
      <polygon
        points={polygon(centre.map(([x, y]) => [x - 1, y + 1] as [number, number]))}
        fill="none" stroke="#ff0060" strokeWidth="0.6" opacity="0.55"
      />
      <polygon
        points={polygon(centre)}
        fill="rgba(98,54,244,0.25)"
        stroke={mainStroke}
        strokeWidth="1.4"
      />
    </g>
  );
}
