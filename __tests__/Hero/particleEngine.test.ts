import { buildRay, buildMist, paintRay, paintMist } from '@/components/Hero/particleEngine';

/* ── Minimal CanvasRenderingContext2D mock ────────────────────
   Only the methods called by paintRay / paintMist are needed.
─────────────────────────────────────────────────────────────── */
function makeCtx(): CanvasRenderingContext2D {
  const gradientStub = { addColorStop: jest.fn() };
  return {
    save:                 jest.fn(),
    restore:              jest.fn(),
    beginPath:            jest.fn(),
    moveTo:               jest.fn(),
    lineTo:               jest.fn(),
    stroke:               jest.fn(),
    fill:                 jest.fn(),
    arc:                  jest.fn(),
    translate:            jest.fn(),
    scale:                jest.fn(),
    fillRect:             jest.fn(),
    createLinearGradient: jest.fn().mockReturnValue(gradientStub),
    createRadialGradient: jest.fn().mockReturnValue(gradientStub),
    lineCap:              '',
    lineWidth:            0,
    globalAlpha:          1,
    strokeStyle:          '',
    fillStyle:            '',
  } as unknown as CanvasRenderingContext2D;
}

/* ═══════════════════════════════════════════════════════════════
   buildRay()
═══════════════════════════════════════════════════════════════ */
describe('buildRay()', () => {
  it('returns an object with all required fields', () => {
    const ray = buildRay(1920, 1080);
    expect(ray).toHaveProperty('yFrac');
    expect(ray).toHaveProperty('yBase');
    expect(ray).toHaveProperty('dir');
    expect(ray).toHaveProperty('xHead');
    expect(ray).toHaveProperty('speed');
    expect(ray).toHaveProperty('length');
    expect(ray).toHaveProperty('opacity');
    expect(ray).toHaveProperty('width');
    expect(ray).toHaveProperty('tint');
  });

  it('dir is either 1 or -1', () => {
    const ray = buildRay(1920, 1080);
    expect([1, -1]).toContain(ray.dir);
  });

  it('tint is an RGB triple with values 0-255', () => {
    const ray = buildRay(1920, 1080);
    expect(ray.tint).toHaveLength(3);
    ray.tint.forEach(channel => {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(255);
    });
  });

  it('yBase equals yFrac * H', () => {
    const H = 1080;
    const ray = buildRay(1920, H);
    expect(ray.yBase).toBeCloseTo(ray.yFrac * H);
  });

  it('scattered=true places xHead within viewport', () => {
    const W = 1920;
    const ray = buildRay(W, 1080, true);
    expect(ray.xHead).toBeGreaterThanOrEqual(-W * 0.2);
    expect(ray.xHead).toBeLessThanOrEqual(W * 1.2);
  });

  it('scattered=false places xHead off-screen for dir=1 (left side)', () => {
    // Force dir=1 by mocking Math.random temporarily
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.1); // < 0.5 → dir=1
    const W = 1920;
    const ray = buildRay(W, 1080, false);
    expect(ray.xHead).toBeLessThanOrEqual(-100);
    spy.mockRestore();
  });
});

/* ═══════════════════════════════════════════════════════════════
   buildMist()
═══════════════════════════════════════════════════════════════ */
describe('buildMist()', () => {
  it('returns an object with all required fields', () => {
    const mist = buildMist(1920, 1080);
    expect(mist).toHaveProperty('x');
    expect(mist).toHaveProperty('y');
    expect(mist).toHaveProperty('yFrac');
    expect(mist).toHaveProperty('dir');
    expect(mist).toHaveProperty('speed');
    expect(mist).toHaveProperty('rx');
    expect(mist).toHaveProperty('ry');
    expect(mist).toHaveProperty('opacity');
  });

  it('dir is either 1 or -1', () => {
    const mist = buildMist(1920, 1080);
    expect([1, -1]).toContain(mist.dir);
  });

  it('scattered=true places x within viewport', () => {
    const W = 1920;
    const mist = buildMist(W, 1080, true);
    expect(mist.x).toBeGreaterThanOrEqual(0);
    expect(mist.x).toBeLessThanOrEqual(W);
  });

  it('y equals yFrac * H', () => {
    const H = 1080;
    const mist = buildMist(1920, H);
    expect(mist.y).toBeCloseTo(mist.yFrac * H);
  });
});

/* ═══════════════════════════════════════════════════════════════
   paintRay()
═══════════════════════════════════════════════════════════════ */

/**
 * Build a ray with its head guaranteed to be in the centre of a
 * 1920×1080 viewport so paintRay always passes the onscreen check.
 */
function makeOnScreenRay(): ReturnType<typeof buildRay> {
  const ray = buildRay(1920, 1080, true);
  ray.xHead  = 960;  // exact centre
  ray.yFrac  = 0.5;
  ray.yBase  = 540;
  ray.dir    = 1;
  ray.length = 400;
  return ray;
}

describe('paintRay()', () => {
  it('does not throw for an on-screen ray', () => {
    const ctx = makeCtx();
    expect(() => paintRay(ctx, makeOnScreenRay(), 1920, 1080)).not.toThrow();
  });

  it('calls ctx.save and ctx.restore (preserves canvas state)', () => {
    const ctx = makeCtx();
    paintRay(ctx, makeOnScreenRay(), 1920, 1080);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });

  it('calls ctx.stroke exactly 3 times (3-pass bloom)', () => {
    const ctx = makeCtx();
    paintRay(ctx, makeOnScreenRay(), 1920, 1080);
    expect(ctx.stroke).toHaveBeenCalledTimes(3);
  });

  it('calls ctx.createLinearGradient once per bloom pass (3 total)', () => {
    const ctx = makeCtx();
    paintRay(ctx, makeOnScreenRay(), 1920, 1080);
    expect(ctx.createLinearGradient).toHaveBeenCalledTimes(3);
  });

  it('skips drawing when ray is entirely off-screen', () => {
    const ctx = makeCtx();
    const ray = makeOnScreenRay();
    ray.xHead  = 5000;  // far right
    ray.dir    = 1;
    ray.length = 100;   // tail at 4900 — nothing near viewport
    paintRay(ctx, ray, 1920, 1080);
    expect(ctx.stroke).not.toHaveBeenCalled();
  });
});

/* ═══════════════════════════════════════════════════════════════
   paintMist()
═══════════════════════════════════════════════════════════════ */
describe('paintMist()', () => {
  it('does not throw for an on-screen cloud', () => {
    const ctx = makeCtx();
    const mist = buildMist(1920, 1080, true);
    expect(() => paintMist(ctx, mist, 1920)).not.toThrow();
  });

  it('calls ctx.save and ctx.restore (preserves canvas state)', () => {
    const ctx = makeCtx();
    const mist = buildMist(1920, 1080, true);
    paintMist(ctx, mist, 1920);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });

  it('calls ctx.fill to draw the cloud shape', () => {
    const ctx = makeCtx();
    const mist = buildMist(1920, 1080, true);
    paintMist(ctx, mist, 1920);
    expect(ctx.fill).toHaveBeenCalled();
  });

  it('skips drawing when cloud is off-screen', () => {
    const ctx = makeCtx();
    const mist = buildMist(1920, 1080, false);
    mist.x  = -1000; // far off left edge
    mist.rx = 100;
    paintMist(ctx, mist, 1920);
    expect(ctx.fill).not.toHaveBeenCalled();
  });
});
