import type { LightRay, MistCloud } from './types';
import { FOCAL_Y, SPECTRUM } from './constants';

/* ── Helpers ────────────────────────────────────────────────── */
function rng(lo: number, hi: number) { return lo + Math.random() * (hi - lo); }

/**
 * Parabolic Y offset that bends each ray toward FOCAL_Y.
 * Creates perspective convergence without radial math.
 */
function perspY(
  x: number, yBase: number, yFrac: number,
  W: number, H: number,
): number {
  const t    = (x / W - 0.5) * 2;
  const dist = Math.abs(yFrac - FOCAL_Y) / FOCAL_Y;
  const k    = 0.04 + dist * 0.07;
  const sign = yFrac <= FOCAL_Y ? -1 : 1;
  return yBase + sign * k * t * t * H;
}

/* ── Ray factory ────────────────────────────────────────────── */
export function buildRay(W: number, H: number, scattered = false): LightRay {
  const yFrac = rng(0.18, 0.70);
  const dir   = (Math.random() < 0.5 ? 1 : -1) as 1 | -1;
  const xHead = scattered
    ? rng(-W * 0.2, W * 1.2)
    : dir > 0 ? rng(-W, -100) : rng(W + 100, W * 2);
  return {
    yFrac,
    yBase:   yFrac * H,
    dir,
    xHead,
    speed:   rng(0.25, 1.3),
    length:  rng(120, 900),
    opacity: rng(0.10, 0.55),
    width:   rng(0.4, 1.6),
    tint:    SPECTRUM[Math.floor(Math.random() * SPECTRUM.length)],
  };
}

/** 3-pass bloom: glow → mid → core */
export function paintRay(
  ctx: CanvasRenderingContext2D,
  ray: LightRay,
  W: number,
  H: number,
) {
  const { yBase, yFrac, xHead, dir, length, opacity, width } = ray;
  const [r, g, b] = ray.tint;
  const xTail = xHead - dir * length;

  const STEPS = 14;
  const pts: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t  = i / STEPS;
    const px = xTail + (xHead - xTail) * t;
    pts.push([px, perspY(px, yBase, yFrac, W, H)]);
  }

  const onscreen = pts.some(
    ([px, py]) => px > -20 && px < W + 20 && py > -20 && py < H + 20,
  );
  if (!onscreen) return;

  const [x0, y0] = pts[0];
  const [x1, y1] = pts[STEPS];

  const buildGrad = () => {
    const grd = ctx.createLinearGradient(x0, y0, x1, y1);
    grd.addColorStop(0,    `rgba(${r},${g},${b},0)`);
    grd.addColorStop(0.35, `rgba(${r},${g},${b},0.5)`);
    grd.addColorStop(1,    `rgba(${r},${g},${b},1)`);
    return grd;
  };

  const tracePath = () => {
    ctx.beginPath();
    pts.forEach(([px, py], i) =>
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py),
    );
  };

  ctx.save();
  ctx.lineCap = 'round';

  ctx.globalAlpha = opacity * 0.06;
  ctx.strokeStyle = buildGrad();
  ctx.lineWidth   = width * 14;
  tracePath(); ctx.stroke();

  ctx.globalAlpha = opacity * 0.18;
  ctx.strokeStyle = buildGrad();
  ctx.lineWidth   = width * 5;
  tracePath(); ctx.stroke();

  ctx.globalAlpha = opacity;
  ctx.strokeStyle = buildGrad();
  ctx.lineWidth   = width;
  tracePath(); ctx.stroke();

  ctx.restore();
}

/* ── Mist cloud factory ─────────────────────────────────────── */
export function buildMist(W: number, H: number, scattered = false): MistCloud {
  const yFrac = rng(0.20, 0.66);
  const dir   = (Math.random() < 0.5 ? 1 : -1) as 1 | -1;
  return {
    x:       scattered ? rng(0, W) : (dir > 0 ? rng(-400, -50) : rng(W + 50, W + 400)),
    y:       yFrac * H,
    yFrac,
    dir,
    speed:   rng(0.08, 0.35),
    rx:      rng(180, 380),
    ry:      rng(60, 140),
    opacity: rng(0.05, 0.12),
  };
}

/** Soft radial mist cloud */
export function paintMist(
  ctx: CanvasRenderingContext2D,
  mist: MistCloud,
  W: number,
) {
  const { x, y, rx, ry, opacity } = mist;
  if (x + rx < -20 || x - rx > W + 20) return;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, ry / rx);

  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  grd.addColorStop(0,   `rgba(220, 235, 255, ${opacity})`);
  grd.addColorStop(0.4, `rgba(180, 210, 255, ${opacity * 0.5})`);
  grd.addColorStop(1,   'rgba(0, 0, 0, 0)');

  ctx.globalAlpha = 1;
  ctx.fillStyle   = grd;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
