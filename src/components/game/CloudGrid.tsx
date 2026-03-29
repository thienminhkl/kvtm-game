"use client";

import { useGameStore } from "@/lib/game";
import PotSlot from "./PotSlot";
import BirdAI from "./BirdAI";

const HANGING_DECORS = ["🎐", "🏮", "🪁", "🎈"];

export default function CloudGrid() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);
  const cloud = useGameStore((s) => s.clouds[s.activeCloudIndex]);
  const monkey = useGameStore((s) => s.monkey);

  if (!cloud) return null;

  const decor = HANGING_DECORS[activeCloudIndex % HANGING_DECORS.length];

  return (
    <div className="relative w-full max-w-[620px]">
      {/* Cloud feathered top edge */}
      <div className="cloud-feather-top h-3 w-full rounded-t-2xl" />

      {/* Main cloud platform */}
      <div className="relative cloud-platform p-3 border border-white/15 animate-cloud-float">
        {/* Cloud puffs on top */}
        <div className="absolute -top-2 left-[8%] w-14 h-7 bg-white/12 rounded-full blur-md" />
        <div className="absolute -top-3 left-[35%] w-20 h-8 bg-white/10 rounded-full blur-md" />
        <div className="absolute -top-2 right-[12%] w-12 h-6 bg-white/12 rounded-full blur-md" />

        {/* Hanging decorations from cloud bottom */}
        <div className="absolute -bottom-6 left-[15%] animate-hang-sway text-lg opacity-50">
          {decor}
        </div>
        <div className="absolute -bottom-4 right-[25%] animate-hang-sway text-sm opacity-40" style={{ animationDelay: "2s" }}>
          {HANGING_DECORS[(activeCloudIndex + 2) % HANGING_DECORS.length]}
        </div>

        {/* 9 slots horizontal */}
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

        <BirdAI />
      </div>

      {/* Cloud feathered bottom edge */}
      <div className="cloud-feather-bottom h-3 w-full rounded-b-2xl" />
    </div>
  );
}
