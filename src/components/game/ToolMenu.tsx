"use client";

import { useGameStore, PLANTS, POTS, FERTILIZERS, PLANT_IDS, POT_IDS, FERTILIZER_IDS } from "@/lib/game";
import type { PlantId, PotId, FertilizerId } from "@/lib/game";

export default function ToolMenu() {
  const activeTool = useGameStore((s) => s.activeTool);
  const inventory = useGameStore((s) => s.inventory);
  const selectedSeedId = useGameStore((s) => s.selectedSeedId);
  const selectedPotId = useGameStore((s) => s.selectedPotId);
  const selectedFertilizerId = useGameStore((s) => s.selectedFertilizerId);
  const setSelectedSeedId = useGameStore((s) => s.setSelectedSeedId);
  const setSelectedPotId = useGameStore((s) => s.setSelectedPotId);
  const setSelectedFertilizerId = useGameStore((s) => s.setSelectedFertilizerId);

  if (!activeTool) return null;

  // --- Seed menu for "Trồng" ---
  if (activeTool === "tool_plant") {
    return (
      <div className="bg-neutral-800/95 rounded-lg border border-neutral-700 p-2 min-w-[160px]">
        <div className="text-[10px] text-neutral-400 font-medium mb-1.5">
          🌱 Chọn hạt giống
        </div>
        <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto">
          {PLANT_IDS.map((id) => {
            const qty = inventory.seeds[id] ?? 0;
            const plant = PLANTS[id];
            const isSelected = selectedSeedId === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setSelectedSeedId(isSelected ? null : id);
                }}
                disabled={qty <= 0}
                className={`
                  flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px]
                  transition-all duration-150 text-left
                  ${isSelected
                    ? "bg-green-700 ring-1 ring-green-400 text-white"
                    : qty > 0
                      ? "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                      : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span>🌱</span>
                <span className="flex-1 truncate">{plant.name}</span>
                <span className={`font-mono font-bold text-[10px] ${qty > 0 ? "text-white" : "text-neutral-600"}`}>
                  x{qty}
                </span>
                <span className="text-[9px] text-neutral-400">
                  {formatSeconds(plant.growTimeSeconds)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Pot menu for "Đặt Chậu" ---
  if (activeTool === "tool_place_pot") {
    return (
      <div className="bg-neutral-800/95 rounded-lg border border-neutral-700 p-2 min-w-[160px]">
        <div className="text-[10px] text-neutral-400 font-medium mb-1.5">
          🪴 Chọn chậu
        </div>
        <div className="flex flex-col gap-1">
          {POT_IDS.map((id) => {
            const qty = inventory.pots[id] ?? 0;
            const pot = POTS[id];
            const isSelected = selectedPotId === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setSelectedPotId(isSelected ? null : id);
                }}
                disabled={qty <= 0}
                className={`
                  flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px]
                  transition-all duration-150 text-left
                  ${isSelected
                    ? "bg-amber-700 ring-1 ring-amber-400 text-white"
                    : qty > 0
                      ? "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                      : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span>🪴</span>
                <span className="flex-1 truncate">{pot.name}</span>
                <span className={`font-mono font-bold text-[10px] ${qty > 0 ? "text-white" : "text-neutral-600"}`}>
                  x{qty}
                </span>
                {pot.expBuffPercent > 0 && (
                  <span className="text-[9px] text-green-400">+{pot.expBuffPercent}%</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Fertilizer menu for "Bón Phân" ---
  if (activeTool === "tool_fertilize") {
    return (
      <div className="bg-neutral-800/95 rounded-lg border border-neutral-700 p-2 min-w-[160px]">
        <div className="text-[10px] text-neutral-400 font-medium mb-1.5">
          🧪 Chọn phân bón
        </div>
        <div className="flex flex-col gap-1">
          {FERTILIZER_IDS.map((id) => {
            const qty = inventory.fertilizers[id] ?? 0;
            const fert = FERTILIZERS[id];
            const isSelected = selectedFertilizerId === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setSelectedFertilizerId(isSelected ? null : id);
                }}
                disabled={qty <= 0}
                className={`
                  flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px]
                  transition-all duration-150 text-left
                  ${isSelected
                    ? "bg-purple-700 ring-1 ring-purple-400 text-white"
                    : qty > 0
                      ? "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                      : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span>🧪</span>
                <span className="flex-1 truncate">{fert.name}</span>
                <span className={`font-mono font-bold text-[10px] ${qty > 0 ? "text-white" : "text-neutral-600"}`}>
                  x{qty}
                </span>
                <span className="text-[9px] text-blue-400">-{fert.timeReductionPercent}%⏱</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Tools that don't need item selection (water, pest, harvest, pick pot)
  return null;
}

function formatSeconds(s: number): string {
  if (s >= 3600) return `${Math.round(s / 3600)}h`;
  if (s >= 60) return `${Math.round(s / 60)}m`;
  return `${s}s`;
}
