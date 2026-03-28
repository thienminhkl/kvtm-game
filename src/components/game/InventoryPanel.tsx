"use client";

import { useState } from "react";
import {
  useGameStore,
  PLANTS,
  POTS,
  FERTILIZERS,
  PEST_NAMES,
  PLANT_IDS,
  POT_IDS,
  FERTILIZER_IDS,
} from "@/lib/game";
import type { PlantId, PotId, FertilizerId, PestType } from "@/lib/game";

type Tab = "seeds" | "pots" | "fertilizers" | "pests";

export default function InventoryPanel() {
  const [tab, setTab] = useState<Tab>("seeds");
  const inventory = useGameStore((s) => s.inventory);
  const selectedSeedId = useGameStore((s) => s.selectedSeedId);
  const selectedPotId = useGameStore((s) => s.selectedPotId);
  const selectedFertilizerId = useGameStore((s) => s.selectedFertilizerId);
  const setSelectedSeedId = useGameStore((s) => s.setSelectedSeedId);
  const setSelectedPotId = useGameStore((s) => s.setSelectedPotId);
  const setSelectedFertilizerId = useGameStore((s) => s.setSelectedFertilizerId);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "seeds", label: "Hạt", icon: "🌱" },
    { id: "pots", label: "Chậu", icon: "🪴" },
    { id: "fertilizers", label: "Phân", icon: "🧪" },
    { id: "pests", label: "Sâu", icon: "🐛" },
  ];

  return (
    <div className="bg-neutral-800/80 rounded-lg border border-neutral-700 w-full max-w-[340px]">
      {/* Tab headers */}
      <div className="flex border-b border-neutral-700">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`
              flex-1 py-1.5 text-xs font-medium transition-colors
              ${tab === t.id
                ? "text-white bg-neutral-700 border-b-2 border-blue-500"
                : "text-neutral-400 hover:text-neutral-200"
              }
            `}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-2 grid grid-cols-4 gap-1.5 max-h-[180px] overflow-y-auto">
        {tab === "seeds" &&
          PLANT_IDS.map((id) => {
            const qty = inventory.seeds[id] ?? 0;
            const plant = PLANTS[id];
            const isSelected = selectedSeedId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedSeedId(isSelected ? null : id)}
                disabled={qty <= 0}
                className={`
                  flex flex-col items-center gap-0.5 p-1.5 rounded-md text-[10px]
                  transition-all duration-150
                  ${isSelected
                    ? "bg-green-700 ring-1 ring-green-400"
                    : qty > 0
                      ? "bg-neutral-700 hover:bg-neutral-600"
                      : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span>🌱</span>
                <span className="truncate w-full text-center">{plant.name}</span>
                <span className={`font-bold ${qty > 0 ? "text-white" : "text-neutral-600"}`}>
                  x{qty}
                </span>
              </button>
            );
          })}

        {tab === "pots" &&
          POT_IDS.map((id) => {
            const qty = inventory.pots[id] ?? 0;
            const pot = POTS[id];
            const isSelected = selectedPotId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedPotId(isSelected ? null : id)}
                disabled={qty <= 0}
                className={`
                  flex flex-col items-center gap-0.5 p-1.5 rounded-md text-[10px]
                  transition-all duration-150
                  ${isSelected
                    ? "bg-amber-700 ring-1 ring-amber-400"
                    : qty > 0
                      ? "bg-neutral-700 hover:bg-neutral-600"
                      : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span>🪴</span>
                <span className="truncate w-full text-center">{pot.name}</span>
                <span className={`font-bold ${qty > 0 ? "text-white" : "text-neutral-600"}`}>
                  x{qty}
                </span>
                {pot.expBuffPercent > 0 && (
                  <span className="text-[8px] text-green-400">
                    +{pot.expBuffPercent}%
                  </span>
                )}
              </button>
            );
          })}

        {tab === "fertilizers" &&
          FERTILIZER_IDS.map((id) => {
            const qty = inventory.fertilizers[id] ?? 0;
            const fert = FERTILIZERS[id];
            const isSelected = selectedFertilizerId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedFertilizerId(isSelected ? null : id)}
                disabled={qty <= 0}
                className={`
                  flex flex-col items-center gap-0.5 p-1.5 rounded-md text-[10px]
                  transition-all duration-150
                  ${isSelected
                    ? "bg-purple-700 ring-1 ring-purple-400"
                    : qty > 0
                      ? "bg-neutral-700 hover:bg-neutral-600"
                      : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span>🧪</span>
                <span className="truncate w-full text-center">{fert.name}</span>
                <span className={`font-bold ${qty > 0 ? "text-white" : "text-neutral-600"}`}>
                  x{qty}
                </span>
                <span className="text-[8px] text-blue-400">
                  -{fert.timeReductionPercent}%⏱
                </span>
              </button>
            );
          })}

        {tab === "pests" &&
          (Object.keys(PEST_NAMES) as PestType[]).map((pestType) => {
            const qty = inventory.pests[pestType] ?? 0;
            const pestIcons: Record<PestType, string> = {
              beetle: "🪲",
              caterpillar: "🐛",
              snail: "🐌",
              dragonfly: "🪰",
            };
            return (
              <div
                key={pestType}
                className="flex flex-col items-center gap-0.5 p-1.5 rounded-md text-[10px] bg-neutral-700"
              >
                <span>{pestIcons[pestType]}</span>
                <span className="truncate w-full text-center">
                  {PEST_NAMES[pestType]}
                </span>
                <span className="font-bold text-white">x{qty}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
