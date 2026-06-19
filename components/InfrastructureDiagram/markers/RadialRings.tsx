import { project, C30, S30, HALF_W, HALF_D, ACCENT_DIM, ACCENT_PURPLE } from '../utils';
import type { MarkerProps } from '../utils';

/** Slab 2 — concentric elliptical rings (target / radar) */
export default function RadialRings({ idx, lit }: MarkerProps) {
  const [cx, cy] = project(0, 0, idx);
  const rx0 = C30 * HALF_W;
  const ry0 = S30 * HALF_D;
  const mainStroke = lit ? ACCENT_DIM : ACCENT_PURPLE;

  return (
    <g>
      {[0.28, 0.52, 0.76, 1.0].map((scale, i) => {
        const rx    = rx0 * scale;
        const ry    = ry0 * scale;
        const outer = i === 3;
        return (
          <g key={i}>
            <ellipse
              cx={cx} cy={cy} rx={rx} ry={ry}
              fill="none"
              stroke={
                outer
                  ? mainStroke
                  : `rgba(${i % 2 === 0 ? '98,54,244' : '255,255,255'},${0.55 - i * 0.08})`
              }
              strokeWidth={outer ? 1.6 : 0.9}
            />
            {outer && (
              <>
                <ellipse cx={cx + 1} cy={cy - 1} rx={rx} ry={ry}
                  fill="none" stroke="#00e6ff" strokeWidth="0.7" opacity="0.6" />
                <ellipse cx={cx - 1} cy={cy + 1} rx={rx} ry={ry}
                  fill="none" stroke="#ff0060" strokeWidth="0.5" opacity="0.5" />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}
