// ============================================================
// Khu Vườn Trên Mây - Growth Engine
// Manages game loop intervals for plant growth, monkey AI, auto-save
// ============================================================

"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "./store";
import { MONKEY_ACTION_INTERVAL_MS } from "./constants";

const AUTO_SAVE_INTERVAL_MS = 30000; // Save every 30 seconds

export function useGameEngine() {
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const monkeyRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Load saved game on mount
    const state = useGameStore.getState();
    state.loadGame();

    // Growth tick + machine tick every second
    tickRef.current = setInterval(() => {
      const s = useGameStore.getState();
      s.tick();
      s.machineTick();
    }, 1000);

    // Monkey AI tick every 0.2s
    monkeyRef.current = setInterval(() => {
      const s = useGameStore.getState();
      if (s.monkey.isActive) {
        s.monkeyTick();
      }
    }, MONKEY_ACTION_INTERVAL_MS);

    // Auto-save every 30 seconds
    saveRef.current = setInterval(() => {
      useGameStore.getState().saveGame();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (monkeyRef.current) clearInterval(monkeyRef.current);
      if (saveRef.current) clearInterval(saveRef.current);
    };
  }, []);
}
