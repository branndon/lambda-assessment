import { project } from '../utils';
import type { MarkerProps } from '../utils';

/** Slab 0 — uniform dot grid across the top face */
export default function DotPattern({ idx }: MarkerProps) {
  const steps = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];
  return (
    <g>
      {steps.flatMap(r =>
        steps.map(c => {
          const [x, y] = project(r, c, idx);
          return (
            <circle
              key={`${r}${c}`}
              cx={x} cy={y} r={1.3}
              fill="rgba(255,255,255,0.32)"
            />
          );
        })
      )}
    </g>
  );
}
