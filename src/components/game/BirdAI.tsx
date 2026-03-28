"use client";

import { useMemo } from "react";
import { useGameStore } from "@/lib/game";

export default function BirdAI() {
  const clouds = useGameStore((s) => s.clouds);
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);
  const monkey = useGameStore((s) => s.monkey);

  // Find first pest slot during render
  const pestSlotIndex = useMemo(() => {
    if (!monkey.isActive) return null;
    const cloud = clouds[activeCloudIndex];
    if (!cloud) return null;
    for (let i = 0; i < cloud.slots.length; i++) {
      if (cloud.slots[i].plant?.isPest) return i;
    }
    return null;
  }, [monkey.isActive, clouds, activeCloudIndex]);

  if (pestSlotIndex === null || !monkey.isActive) return null;

  const col = pestSlotIndex % 9;
  const x = col * (100 / 9) + 100 / 18;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      <div
        className="absolute text-2xl animate-bird-fly"
        style={{
          left: `${x}%`,
          top: "50%",
          "--bird-from-x": "-200px",
          "--bird-from-y": "-100px",
          "--bird-to-x": "0px",
          "--bird-to-y": "0px",
        } as React.CSSProperties}
      >
        🐦
      </div>
    </div>
  );
}
