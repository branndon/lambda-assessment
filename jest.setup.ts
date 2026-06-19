import '@testing-library/jest-dom';

// ── Canvas mock ───────────────────────────────────────────────
// jsdom doesn't implement canvas; returning null causes HeroBackground
// to exit its useEffect early — the component still renders correctly.
HTMLCanvasElement.prototype.getContext = jest.fn(
  () => null,
) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// ── Animation frame mock ─────────────────────────────────────
global.requestAnimationFrame = (cb) =>
  setTimeout(cb, 0) as unknown as number;
global.cancelAnimationFrame = (id) =>
  clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
