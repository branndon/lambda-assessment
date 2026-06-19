import { project, C30, S30, HALF_W, HALF_D, ACCENT_DIM, ACCENT_PURPLE } from '../utils';
import type { MarkerProps } from '../utils';

/** Slab 3 — large ring + filled inner oval + orbital glow dots + outer dotted rings */
export default function EllipseMarker({ idx, lit }: MarkerProps) {
  const [cx, cy] = project(0, 0, idx);
  const rx = C30 * HALF_W;
  const ry = S30 * HALF_D;

  /* Inner filled oval — ~40% scale */
  const irx      = rx * 0.40;
  const iry      = ry * 0.46;
  const dotSteps = [-0.3, -0.15, 0, 0.15, 0.3];
  const innerDots: [number, number][] = [];
  dotSteps.forEach(r =>
    dotSteps.forEach(c => {
      const [x, y] = project(r * 0.44, c * 0.44, idx);
      const nx = (x - cx) / irx, ny = (y - cy) / iry;
      if (nx * nx + ny * ny < 0.88) innerDots.push([x, y]);
    })
  );

  const glow1: [number, number] = [cx + rx * 0.85, cy - ry * 0.10];
  const glow2: [number, number] = [cx - rx * 0.25, cy + ry * 0.90];
  const mainStroke = lit ? ACCENT_DIM : ACCENT_PURPLE;

  return (
    <g>
      {/* Outer concentric dotted rings */}
      {[1.32, 1.68].map((scale, i) => (
        <ellipse
          key={`outer-${i}`}
          cx={cx} cy={cy}
          rx={rx * scale} ry={ry * scale}
          fill="none"
          stroke="rgba(255,255,255,0.13)"
          strokeWidth="0.8"
          strokeDasharray={`1.5 ${4 + i * 1.5}`}
        />
      ))}

      {/* Main ring — RGB aberration then base stroke */}
      <ellipse cx={cx + 1} cy={cy - 1} rx={rx} ry={ry}
        fill="none" stroke="#00e6ff" strokeWidth="0.7" opacity="0.6" />
      <ellipse cx={cx - 1} cy={cy + 1} rx={rx} ry={ry}
        fill="none" stroke="#ff0060" strokeWidth="0.5" opacity="0.5" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
        fill="none" stroke={mainStroke} strokeWidth="1.6" />

      {/* Inner filled lens */}
      <ellipse cx={cx} cy={cy} rx={irx} ry={iry} fill="rgba(4,4,4,0.92)" />

      {/* Dot grid inside inner oval */}
      {innerDots.map(([x, y], i) => (
        <circle key={`idot-${i}`} cx={x} cy={y} r={1.2}
          fill="rgba(255,255,255,0.55)" />
      ))}

      {/* Glowing orbital markers */}
      <circle cx={glow1[0]} cy={glow1[1]} r={3} fill="#aaffaa" opacity={0.9} />
      <circle cx={glow2[0]} cy={glow2[1]} r={3} fill="#aaffaa" opacity={0.9} />
    </g>
  );
}
