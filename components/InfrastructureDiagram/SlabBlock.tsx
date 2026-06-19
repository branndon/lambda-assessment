import {
  project, polygon,
  ACCENT_DIM, DIM_EDGE, TAG_COLOR,
  DEPTH_H, TR, SLAB_NAMES,
} from './utils';
import { SLAB_MARKERS } from './markers';
import RgbFrame from './RgbFrame';

interface SlabBlockProps {
  idx: number;
  lit: boolean;
}

/**
 * Renders one isometric slab: right face, front face, top face,
 * per-slab decorative marker (fades in/out), chromatic-aberration
 * border (fades in/out), and front-face label.
 */
export default function SlabBlock({ idx, lit }: SlabBlockProps) {
  const tl = project(-1, -1, idx), tr = project(1, -1, idx);
  const br = project( 1,  1, idx), bl = project(-1,  1, idx);
  const trB: [number, number] = [tr[0], tr[1] + DEPTH_H];
  const brB: [number, number] = [br[0], br[1] + DEPTH_H];
  const blB: [number, number] = [bl[0], bl[1] + DEPTH_H];

  const borderStroke = lit ? 'none' : DIM_EDGE;
  const sw           = 0.6;
  const topFill      = lit ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.02)';

  /* Always resolve so opacity can transition instead of mount/unmount */
  const Marker = SLAB_MARKERS[idx];

  return (
    <g>
      {/* Right face */}
      <polygon
        points={polygon([tr, br, brB, trB])}
        fill="rgba(255,255,255,0.05)"
        stroke={lit ? ACCENT_DIM : DIM_EDGE}
        strokeWidth={sw}
        style={{ transition: `stroke ${TR}` }}
      />
      {/* Front face */}
      <polygon
        points={polygon([br, bl, blB, brB])}
        fill="rgba(0,0,0,0.22)"
        stroke={lit ? ACCENT_DIM : DIM_EDGE}
        strokeWidth={sw}
        style={{ transition: `stroke ${TR}` }}
      />
      {/* Top face */}
      <polygon
        points={polygon([tl, tr, br, bl])}
        fill={topFill}
        stroke={borderStroke}
        strokeWidth={sw}
        style={{ transition: `fill ${TR}, stroke ${TR}` }}
      />

      {/* Decorative symbol — fades in when active */}
      <g style={{ opacity: lit ? 1 : 0, transition: `opacity ${TR}` }}>
        <Marker idx={idx} lit={lit} />
      </g>

      {/* Chromatic highlight — fades in when active */}
      <g style={{ opacity: lit ? 1 : 0, transition: `opacity ${TR}` }}>
        <RgbFrame idx={idx} />
      </g>

      {/* Label on front face */}
      <text
        x={(bl[0] + br[0]) / 2}
        y={(bl[1] + blB[1]) / 2 + 8}
        fill={TAG_COLOR}
        fontSize="12"
        fontFamily="'Suisse Intl Mono','Courier New',monospace"
        letterSpacing="0.05em"
        textAnchor="middle"
        transform={`rotate(20, ${(bl[0] + br[0]) / 2 - 80}, ${(bl[1] + blB[1]) / 2 + 8})`}
        style={{ userSelect: 'none' } as React.CSSProperties}
      >
        {SLAB_NAMES[idx]}
      </text>
    </g>
  );
}
