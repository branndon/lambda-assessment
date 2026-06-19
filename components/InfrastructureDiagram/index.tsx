'use client';

import SlabBlock from './SlabBlock';
import { SVG_W, SVG_H, project, TIER_LABELS, EXPLODE_PX, TAG_COLOR, TR } from './utils';

interface Props {
  activeIndex?: number;
}

/**
 * Isometric infrastructure stack illustration.
 * Pass `activeIndex` (0–3) to highlight the corresponding layer and
 * animate the gap-open effect.
 */
export default function AiInfrastructureDiagram({ activeIndex = 0 }: Props) {
  /** Layers at or below the active one slide down to open the gap */
  const shiftOf = (i: number) =>
    activeIndex > 0 && i >= activeIndex ? EXPLODE_PX : 0;

  return (
    <div style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: '100%', height: 'auto' }}
      >
        {/* Painter's algorithm: bottom slab first */}
        {([3, 2, 1, 0] as const).map(i => (
          <g
            key={i}
            style={{
              transform:  `translateY(${shiftOf(i)}px)`,
              transition: `transform ${TR}`,
            }}
          >
            <SlabBlock idx={i} lit={i === activeIndex} />
          </g>
        ))}

        {/* Right-column tier labels — animated via CSS transform, not y attribute */}
        {TIER_LABELS.map(({ text, pos }, i) => {
          const [x, y] = project(1, -1, pos);
          const shift  = activeIndex > 0 && pos > activeIndex ? EXPLODE_PX : 0;
          return (
            <text
              key={i}
              x={x + 11}
              y={y + 4}
              fill={TAG_COLOR}
              fontSize="11"
              fontFamily="'Suisse Intl Mono','Courier New',monospace"
              letterSpacing="0.08em"
              style={{
                userSelect:  'none',
                transform:   `translateY(${shift}px)`,
                transition:  `transform ${TR}`,
              } as React.CSSProperties}
            >
              {text}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
