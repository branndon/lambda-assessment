import { renderHook, act } from '@testing-library/react';
import { useFontSwap } from '@/components/Hero/useFontSwap';
import { SWAP_POOL } from '@/components/Hero/constants';

/**
 * useFontSwap uses setTimeout + setInterval internally.
 * We freeze Math.random = 0 in timing-sensitive tests so all random
 * durations become their minimum (restore = 300 ms, interval = 1800 ms),
 * making the schedule deterministic:
 *
 *   t=   0 ms — mount; interval created (period 1800 ms)
 *   t= 600 ms — t0 fires → swap (size=1)
 *   t= 900 ms — restore timer fires (size=0)
 *   t=1800 ms — interval fires → swap (size=1)
 *   t=2100 ms — restore timer fires (size=0)
 */
describe('useFontSwap()', () => {
  beforeEach(() => jest.useFakeTimers());

  afterEach(() => {
    // Drain remaining timers inside act() so React state updates
    // triggered by cleanup don't produce "not wrapped in act" warnings.
    act(() => { jest.runOnlyPendingTimers(); });
    jest.useRealTimers();
  });

  it('returns an empty Set on mount (no highlight yet)', () => {
    const { result } = renderHook(() => useFontSwap());
    expect(result.current).toBeInstanceOf(Set);
    expect(result.current.size).toBe(0);
  });

  it('highlights exactly 1 character after the initial 600 ms delay', () => {
    const { result } = renderHook(() => useFontSwap());
    act(() => { jest.advanceTimersByTime(600); });
    expect(result.current.size).toBe(1);
  });

  it('highlighted index is a valid member of SWAP_POOL', () => {
    const { result } = renderHook(() => useFontSwap());
    act(() => { jest.advanceTimersByTime(600); });
    const [idx] = [...result.current];
    expect(typeof idx).toBe('number');
    expect(SWAP_POOL).toContain(idx);
  });

  it('clears the highlight after the flash window (300-550 ms after swap)', () => {
    const { result } = renderHook(() => useFontSwap());
    act(() => { jest.advanceTimersByTime(600); });   // swap fires
    expect(result.current.size).toBe(1);
    act(() => { jest.advanceTimersByTime(600); });   // covers the 300-550 ms restore range
    expect(result.current.size).toBe(0);
  });

  it('fires again on the recurring setInterval', () => {
    // Pin Math.random to 0 → restore=300 ms, interval period=1800 ms
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0);

    const { result } = renderHook(() => useFontSwap());
    act(() => { jest.advanceTimersByTime(600); });   // t0 → swap (size=1)
    act(() => { jest.advanceTimersByTime(300); });   // restore (size=0)
    act(() => { jest.advanceTimersByTime(901); });   // total=1801 ms → interval fired at 1800 ms (size=1)

    expect(result.current.size).toBe(1);
    spy.mockRestore();
  });

  it('cleans up all timers on unmount without throwing', () => {
    const { unmount } = renderHook(() => useFontSwap());
    act(() => { jest.advanceTimersByTime(600); });
    expect(() => { unmount(); }).not.toThrow();
  });
});
