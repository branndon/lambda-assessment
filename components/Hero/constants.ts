export const RAY_COUNT  = 220;
export const MIST_COUNT = 7;

/** Convergence point: all rays bend toward this Y fraction */
export const FOCAL_Y = 0.44;

/** Colour palette — mostly cool whites / blues, occasional accent */
export const SPECTRUM: [number, number, number][] = [
  [255, 255, 255],
  [255, 255, 255],
  [210, 230, 255],
  [210, 230, 255],
  [160, 205, 255],
  [100, 175, 255],
  [  0, 210, 255],
  [ 80, 150, 255],
  [200,  90,  90],
  [ 80, 210, 160],
];

/* ── Heading copy ── */
export const LINE1        = 'The ';
export const LINE1_NOWRAP = 'Superintelligence';
export const LINE2        = 'Cloud';
export const FULL_TEXT    = `${LINE1}${LINE1_NOWRAP} ${LINE2}`;

/**
 * Indices of non-space characters in FULL_TEXT — used by the font-swap
 * animation to pick random characters to highlight each tick.
 */
export const SWAP_POOL: number[] = FULL_TEXT.split('').reduce<number[]>(
  (acc, ch, i) => { if (ch !== ' ') acc.push(i); return acc; },
  [],
);
