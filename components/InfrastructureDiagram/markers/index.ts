import DotPattern    from './DotPattern';
import SquareMarker  from './SquareMarker';
import RadialRings   from './RadialRings';
import EllipseMarker from './EllipseMarker';
import type { MarkerProps } from '../utils';

export { DotPattern, SquareMarker, RadialRings, EllipseMarker };

/** Maps slab index (0–3) to its decorative symbol component. */
export const SLAB_MARKERS: React.FC<MarkerProps>[] = [
  DotPattern,
  SquareMarker,
  RadialRings,
  EllipseMarker,
];
