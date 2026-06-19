import { project, polygon, ACCENT_DIM } from './utils';

/** Chromatic-aberration border drawn on top of the active slab's top face */
export default function RgbFrame({ idx }: { idx: number }) {
  const corners: [number, number][] = [
    project(-1, -1, idx), project(1, -1, idx),
    project(1,   1, idx), project(-1, 1, idx),
  ];
  return (
    <g>
      <polygon
        points={polygon(corners.map(([x, y]) => [x + 1.2, y - 1.2] as [number, number]))}
        fill="none" stroke="#00e6ff" strokeWidth="1" opacity="0.7"
      />
      <polygon
        points={polygon(corners.map(([x, y]) => [x - 1.2, y + 1.2] as [number, number]))}
        fill="none" stroke="#ff0060" strokeWidth="0.8" opacity="0.55"
      />
      <polygon
        points={polygon(corners)}
        fill="none" stroke={ACCENT_DIM} strokeWidth="1.6"
      />
    </g>
  );
}
