"use client";

import { useGameStore } from "@/lib/game";
import PotSlot from "./PotSlot";

export default function CloudGrid() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);
  const cloud = useGameStore((s) => s.clouds[s.activeCloudIndex]);

  if (!cloud) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm text-neutral-400 font-medium">
        ☁️ Tầng Mây {activeCloudIndex + 1}
      </div>
      <div className="grid grid-cols-9 gap-1.5 w-full max-w-[700px]">
        {cloud.slots.map((slot) => (
          <PotSlot key={slot.id} slot={slot} />
        ))}
      </div>
    </div>
  );
}
