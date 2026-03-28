// ============================================================
// Khu Vườn Trên Mây - Growth Engine
// Manages game loop intervals for plant growth and monkey AI
// ============================================================

"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "./store";
import { MONKEY_ACTION_INTERVAL_MS } from "./constants";

export function useGameEngine() {
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const monkeyRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Growth tick + machine tick every second
    tickRef.current = setInterval(() => {
      const state = useGameStore.getState();
      state.tick();
      state.machineTick();
    }, 1000);

    // Monkey AI tick every 0.2s
    monkeyRef.current = setInterval(() => {
      const state = useGameStore.getState();
      if (state.monkey.isActive) {
        state.monkeyTick();
      }
    }, MONKEY_ACTION_INTERVAL_MS);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (monkeyRef.current) clearInterval(monkeyRef.current);
    };
  }, []);
}
