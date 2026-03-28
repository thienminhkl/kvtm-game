// ============================================================
// Khu Vườn Trên Mây - Growth Engine
// Manages game loop intervals for plant growth and monkey AI
// ============================================================

"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "./store";
import { MONKEY_SCAN_INTERVAL_MS } from "./constants";

/**
 * Hook that starts the game engine timers.
 * - Growth tick: every 1 second
 * - Monkey AI tick: every MONKEY_SCAN_INTERVAL_MS
 *
 * Must be called from a client component.
 * Returns nothing; side-effect only.
 */
export function useGameEngine() {
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const monkeyRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Growth tick every second
    tickRef.current = setInterval(() => {
      useGameStore.getState().tick();
    }, 1000);

    // Monkey AI tick
    monkeyRef.current = setInterval(() => {
      const state = useGameStore.getState();
      if (state.monkey.isActive) {
        state.monkeyTick();
      }
    }, MONKEY_SCAN_INTERVAL_MS);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (monkeyRef.current) clearInterval(monkeyRef.current);
    };
  }, []);
}
