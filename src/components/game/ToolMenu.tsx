"use client";

import { useGameStore, PLANTS, POTS, FERTILIZERS, PLANT_IDS, POT_IDS, FERTILIZER_IDS } from "@/lib/game";

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

  // --- Seed menu (horizontal) ---
  if (activeTool === "tool_plant") {
    return (
      <div className="bg-neutral-800/95 rounded-lg border border-neutral-700 p-1.5">
        <div className="text-[9px] text-neutral-500 mb-1 px-1">🌱 Hạt giống</div>
        <div className="flex flex-wrap gap-1">
          {PLANT_IDS.map((id) => {
            const qty = inventory.seeds[id] ?? 0;
            const plant = PLANTS[id];
            const isSelected = selectedSeedId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedSeedId(isSelected ? null : id)}
                disabled={qty <= 0}
                title={`${plant.name} - ${formatSeconds(plant.growTimeSeconds)}`}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-md text-[10px]
                  transition-all duration-150 whitespace-nowrap
                  ${isSelected
                    ? "bg-green-700 ring-1 ring-green-400 text-white"
                    : qty > 0
                      ? "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                      : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span>🌱</span>
                <span>{plant.name}</span>
                <span className="font-mono font-bold text-[9px] opacity-70">×{qty}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Pot menu (horizontal) ---
  if (activeTool === "tool_place_pot") {
    return (
      <div className="bg-neutral-800/95 rounded-lg border border-neutral-700 p-1.5">
        <div className="text-[9px] text-neutral-500 mb-1 px-1">🏺 Chậu</div>
        <div className="flex flex-wrap gap-1">
          {POT_IDS.map((id) => {
            const qty = inventory.pots[id] ?? 0;
            const pot = POTS[id];
            const isSelected = selectedPotId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedPotId(isSelected ? null : id)}
                disabled={qty <= 0}
                title={`${pot.name}${pot.expBuffPercent > 0 ? ` +${pot.expBuffPercent}%` : ""}`}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-md text-[10px]
                  transition-all duration-150 whitespace-nowrap
                  ${isSelected
                    ? "bg-amber-700 ring-1 ring-amber-400 text-white"
                    : qty > 0
                      ? "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                      : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span>🏺</span>
                <span>{pot.name}</span>
                <span className="font-mono font-bold text-[9px] opacity-70">×{qty}</span>
                {pot.expBuffPercent > 0 && (
                  <span className="text-[8px] text-green-400">+{pot.expBuffPercent}%</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Fertilizer menu (horizontal) ---
  if (activeTool === "tool_fertilize") {
    return (
      <div className="bg-neutral-800/95 rounded-lg border border-neutral-700 p-1.5">
        <div className="text-[9px] text-neutral-500 mb-1 px-1">🧪 Phân bón</div>
        <div className="flex flex-wrap gap-1">
          {FERTILIZER_IDS.map((id) => {
            const qty = inventory.fertilizers[id] ?? 0;
            const fert = FERTILIZERS[id];
            const isSelected = selectedFertilizerId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedFertilizerId(isSelected ? null : id)}
                disabled={qty <= 0}
                title={`${fert.name} -${fert.timeReductionPercent}%⏱`}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-md text-[10px]
                  transition-all duration-150 whitespace-nowrap
                  ${isSelected
                    ? "bg-purple-700 ring-1 ring-purple-400 text-white"
                    : qty > 0
                      ? "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                      : "bg-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span>🧪</span>
                <span>{fert.name}</span>
                <span className="font-mono font-bold text-[9px] opacity-70">×{qty}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

function formatSeconds(s: number): string {
  if (s >= 3600) return `${Math.round(s / 3600)}h`;
  if (s >= 60) return `${Math.round(s / 60)}m`;
  return `${s}s`;
}
