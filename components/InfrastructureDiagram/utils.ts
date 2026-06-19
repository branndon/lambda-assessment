/* ── Isometric math ─────────────────────────────────────────── */
export const C30 = 0.866;   // cos 30°
export const S30 = 0.5;     // sin 30°

/* Slab geometry */
export const HALF_W  = 118;
export const HALF_D  = 70;
export const DEPTH_H = 36;
export const V_STEP  = 2 * HALF_D * S30 + DEPTH_H - 20;

/* SVG canvas */
export const SVG_W  = 670;
export const SVG_H  = 660;
export const ISO_OX = 282;
export const ISO_OY = 152;

/* Design tokens */
export const ACCENT_PURPLE = '#6236F4';
export const ACCENT_DIM    = '#b0afa6';
export const DIM_EDGE      = 'rgba(255,255,255,0.15)';
export const TAG_COLOR     = '#e7e6d9';
export const EXPLODE_PX    = 50;

/* Shared motion timing */
export const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
export const DUR  = '540ms';
export const TR   = `${DUR} ${EASE}`;

/* Layer names — index 0 = topmost rendered slab */
export const SLAB_NAMES = [
  'Purpose-built datacenters',
  'AI infrastructure',
  'Managed services',
  'Co-engineering',
] as const;

/* Right-column audience labels */
export const TIER_LABELS = [
  { text: 'AI DEVELOPERS',     pos: 1.5 },
  { text: 'ENTERPRISE',        pos: 2.5 },
  { text: 'SUPERINTELLIGENCE', pos: 3.5 },
] as const;

/* ── Isometric projection: (row, col, layer) → SVG (x, y) ── */
export function project(r: number, c: number, layer: number): [number, number] {
  return [
    ISO_OX + (r - c) * C30 * HALF_W,
    ISO_OY + layer * V_STEP + (r + c) * S30 * HALF_D,
  ];
}

/** Convert an array of (x,y) corners to a SVG points string */
export function polygon(corners: [number, number][]): string {
  return corners.map(([x, y]) => `${x},${y}`).join(' ');
}

/** Shared prop shape for all slab marker components */
export interface MarkerProps {
  idx: number;
  lit: boolean;
}
