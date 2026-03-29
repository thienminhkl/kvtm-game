"use client";

import { useGameStore } from "@/lib/game";
import PotSlot from "./PotSlot";
import BirdAI from "./BirdAI";

export default function CloudGrid() {
  const cloud = useGameStore((s) => s.clouds[s.activeCloudIndex]);
  const monkey = useGameStore((s) => s.monkey);

  if (!cloud) return null;

  return (
    <div className="relative w-full max-w-[580px]">
      {/* Cloud puffs top */}
      <div className="absolute -top-4 left-[5%] w-16 h-8 cloud-puff" />
      <div className="absolute -top-5 left-[30%] w-24 h-10 cloud-puff" />
      <div className="absolute -top-4 right-[10%] w-14 h-7 cloud-puff" />

      <div className="cloud-feather-top h-4 w-full" />

      {/* Cloud body */}
      <div className="cloud-body relative px-4 py-3 animate-cloud-float">
        {/* 9 slots with slight arc */}
        <div className="relative grid grid-cols-9 gap-1.5">
          {cloud.slots.map((slot, index) => {
            const offset = Math.abs(index - 4) * -0.5;
            return (
              <div key={slot.id} className="relative" style={{ transform: `translateY(${offset}px)` }}>
                <PotSlot slot={slot} />
                {monkey.isActive && monkey.currentSlotIndex === index && !monkey.isActing && (
                  <div className="absolute inset-0 rounded-lg border-2 border-green-400/60 animate-scan-pulse pointer-events-none" />
                )}
                {monkey.isActive && monkey.currentSlotIndex === index && monkey.isActing && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm pointer-events-none">🐒</div>
                )}
              </div>
            );
          })}
        </div>
        <BirdAI />
      </div>

      <div className="cloud-feather-bottom h-4 w-full" />

      {/* Cloud puffs bottom */}
      <div className="absolute -bottom-3 left-[15%] w-12 h-6 cloud-puff" />
      <div className="absolute -bottom-4 left-[50%] w-18 h-8 cloud-puff" />
      <div className="absolute -bottom-3 right-[20%] w-10 h-5 cloud-puff" />

      {/* Hanging decorations */}
      <div className="absolute -bottom-8 left-[12%] animate-hang-sway text-sm opacity-50">🎐</div>
      <div className="absolute -bottom-6 right-[18%] animate-hang-sway text-xs opacity-40" style={{ animationDelay: "2s" }}>🏮</div>
    </div>
  );
}
