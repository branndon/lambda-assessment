'use client';

import { useEffect, useRef } from 'react';
import type { LightRay, MistCloud } from './types';
import { RAY_COUNT, MIST_COUNT, FOCAL_Y } from './constants';
import { buildRay, paintRay, buildMist, paintMist } from './particleEngine';

/**
 * Full-bleed canvas animation for the hero section.
 * Renders 220 light rays + 7 mist clouds with a parabolic perspective curve
 * converging on FOCAL_Y. Isolated from DOM content changes so that the
 * font-swap animation in the heading never triggers a canvas reinit.
 *
 * Perf notes:
 *  - Gradients are created once per resize and cached in refs instead of
 *    being recreated every animation frame (~60×/s saving 3 gradient allocs).
 *  - The resize handler is debounced (150 ms) to avoid thrashing during
 *    continuous window drag.
 *  - The animation loop is skipped entirely when the user prefers reduced
 *    motion (prefers-reduced-motion: reduce).
 */
export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raysRef   = useRef<LightRay[]>([]);
  const mistsRef  = useRef<MistCloud[]>([]);
  const rafRef    = useRef<number>(0);

  /* Cached gradients — recreated only on resize */
  const gradFogRef   = useRef<CanvasGradient | null>(null);
  const gradFloorRef = useRef<CanvasGradient | null>(null);
  const gradReflRef  = useRef<CanvasGradient | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* Skip animation entirely for users who prefer reduced motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const resize = () => {
      // Read viewport — intentionally NOT using a ResizeObserver on the
      // section, because font-swap changes heading metrics briefly and would
      // trigger a full particle reinit, causing a visible background flash.
      const W = Math.max(window.innerWidth, 1800);
      const H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      raysRef.current  = Array.from({ length: RAY_COUNT },  () => buildRay(W, H, true));
      mistsRef.current = Array.from({ length: MIST_COUNT }, () => buildMist(W, H, true));

      /* ── Cache gradient objects (depend on W / H only) ── */
      const fog = ctx.createRadialGradient(
        W / 2, H * FOCAL_Y, 0,
        W / 2, H * FOCAL_Y, W * 0.65,
      );
      fog.addColorStop(0,    'rgba(20, 40, 100, 0.14)');
      fog.addColorStop(0.45, 'rgba(15, 25,  70, 0.07)');
      fog.addColorStop(1,    'rgba(0,   0,   0, 0)');
      gradFogRef.current = fog;

      const floor = ctx.createLinearGradient(0, H * 0.48, 0, H);
      floor.addColorStop(0, 'rgba(11,11,11,0)');
      floor.addColorStop(1, 'rgba(11,11,11,0.97)');
      gradFloorRef.current = floor;

      const refl = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, W * 0.3);
      refl.addColorStop(0, 'rgba(60, 80, 180, 0.06)');
      refl.addColorStop(1, 'rgba(0,   0,   0, 0)');
      gradReflRef.current = refl;
    };

    /* Debounce resize — avoid full particle rebuild on every pixel change */
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedResize = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(resize, 150);
    };

    const initId = setTimeout(resize, 0);
    window.addEventListener('resize', debouncedResize);

    const frame = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      /* Central nebula fog (cached gradient) */
      if (gradFogRef.current) {
        ctx.fillStyle = gradFogRef.current;
        ctx.fillRect(0, 0, W, H);
      }

      /* Rays */
      for (const ray of raysRef.current) {
        paintRay(ctx, ray, W, H);
        ray.xHead += ray.dir * ray.speed;
        const offscreen = ray.dir > 0
          ? ray.xHead - ray.length > W + 50
          : ray.xHead + ray.length < -50;
        if (offscreen) Object.assign(ray, buildRay(W, H, false));
      }

      /* Mist clouds */
      for (const mist of mistsRef.current) {
        paintMist(ctx, mist, W);
        mist.x += mist.dir * mist.speed;
        const offscreen = mist.dir > 0
          ? mist.x - mist.rx > W + 50
          : mist.x + mist.rx < -50;
        if (offscreen) Object.assign(mist, buildMist(W, H, false));
      }

      /* Floor gradient — bottom fade to near-black (cached) */
      if (gradFloorRef.current) {
        ctx.fillStyle = gradFloorRef.current;
        ctx.fillRect(0, 0, W, H);
      }

      /* Subtle floor reflection (cached) */
      if (gradReflRef.current) {
        ctx.fillStyle = gradReflRef.current;
        ctx.fillRect(0, H * 0.7, W, H * 0.3);
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      clearTimeout(initId);
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener('resize', debouncedResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div aria-hidden="true" className="_backgroundAnimation_15jea_2">
      <canvas
        ref={canvasRef}
        style={{
          position:  'absolute',
          top:       0,
          left:      '50%',
          transform: 'translateX(-50%)',
          width:     '100%',
          height:    '100%',
          minWidth:  '1800px',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      />
    </div>
  );
}
