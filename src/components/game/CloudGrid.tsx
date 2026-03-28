"use client";

import { useGameStore } from "@/lib/game";
import PotSlot from "./PotSlot";
import BirdAI from "./BirdAI";

export default function CloudGrid() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);
  const cloud = useGameStore((s) => s.clouds[s.activeCloudIndex]);
  const monkey = useGameStore((s) => s.monkey);

  if (!cloud) return null;

  return (
    <div className="relative w-full max-w-[620px]">
      {/* Cloud grid with cloud-styled background */}
      <div className="relative p-3 rounded-2xl bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/10 animate-cloud-float">
        {/* Decorative cloud puffs */}
        <div className="absolute -top-3 left-[10%] w-12 h-6 bg-white/10 rounded-full blur-sm" />
        <div className="absolute -top-2 left-[40%] w-16 h-7 bg-white/10 rounded-full blur-sm" />
        <div className="absolute -top-3 right-[15%] w-10 h-5 bg-white/10 rounded-full blur-sm" />

        {/* Slot grid */}
        <div className="relative grid grid-cols-9 gap-1.5">
          {cloud.slots.map((slot, index) => (
            <div key={slot.id} className="relative">
              <PotSlot slot={slot} />
              {monkey.isActive && monkey.currentSlotIndex === index && !monkey.isActing && (
                <div className="absolute inset-0 rounded-lg border-2 border-green-400/60 animate-scan-pulse pointer-events-none" />
              )}
              {monkey.isActive && monkey.currentSlotIndex === index && monkey.isActing && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm pointer-events-none">🐒</div>
              )}
            </div>
          ))}
        </div>

        {/* Bird AI overlay */}
        <BirdAI />
      </div>

      {/* Layer number - bottom right corner */}
      <div className="absolute -bottom-1 -right-2 flex items-center gap-0.5">
        <span className="text-[10px] text-neutral-500">Tầng</span>
        <span className="text-lg font-bold text-white/80 leading-none">
          {activeCloudIndex + 1}
        </span>
      </div>
    </div>
  );
}
