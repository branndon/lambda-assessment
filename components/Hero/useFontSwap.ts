'use client';

import { useEffect, useState } from 'react';
import { SWAP_POOL } from './constants';

/**
 * Randomly highlights exactly 1 character from the heading on a recurring
 * interval, then restores it after a brief flash.
 *
 * Returns a Set of character indices that should be highlighted.
 */
export function useFontSwap(): Set<number> {
  const [pixelSet, setPixelSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    let restoreTimer: ReturnType<typeof setTimeout>;

    const swap = () => {
      const pool = [...SWAP_POOL].sort(() => Math.random() - 0.5);
      setPixelSet(new Set([pool[0]]));
      restoreTimer = setTimeout(
        () => setPixelSet(new Set()),
        300 + Math.random() * 250,
      );
    };

    const t0       = setTimeout(swap, 600);
    const interval = setInterval(swap, 1800 + Math.random() * 900);

    return () => {
      clearTimeout(t0);
      clearTimeout(restoreTimer);
      clearInterval(interval);
    };
  }, []);

  return pixelSet;
}
