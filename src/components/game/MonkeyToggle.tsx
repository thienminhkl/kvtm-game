"use client";

import { useGameStore, PLANT_IDS, PLANTS } from "@/lib/game";
import type { PlantId } from "@/lib/game";

export default function MonkeyToggle() {
  const monkey = useGameStore((s) => s.monkey);
  const toggleMonkey = useGameStore((s) => s.toggleMonkey);
  const setMonkeyAutoPlant = useGameStore((s) => s.setMonkeyAutoPlant);
  const inventory = useGameStore((s) => s.inventory);

  return (
    <div className="bg-neutral-800/80 rounded-lg p-2 border border-neutral-700 w-full max-w-[340px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🐒</span>
          <span className="text-xs text-neutral-300 font-medium">Khỉ Quản Gia</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-400">
            🍌 x{monkey.bananasRemaining}
          </span>
          <button
            onClick={toggleMonkey}
            disabled={!monkey.isActive && monkey.bananasRemaining <= 0}
            className={`
              px-3 py-1 rounded-md text-xs font-medium transition-all
              ${monkey.isActive
                ? "bg-green-600 hover:bg-green-700 text-white"
                : monkey.bananasRemaining > 0
                  ? "bg-neutral-600 hover:bg-neutral-500 text-neutral-200"
                  : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              }
            `}
          >
            {monkey.isActive ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Auto-plant seed selector */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] text-neutral-400 mr-1">Tự trồng:</span>
        <button
          onClick={() => setMonkeyAutoPlant(null)}
          className={`
            px-2 py-0.5 rounded text-[10px]
            ${!monkey.autoPlantSeedId
              ? "bg-blue-600 text-white"
              : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
            }
          `}
        >
          Tắt
        </button>
        {PLANT_IDS.map((id) => {
          const plant = PLANTS[id];
          const qty = inventory.seeds[id] ?? 0;
          const isSelected = monkey.autoPlantSeedId === id;
          return (
            <button
              key={id}
              onClick={() => setMonkeyAutoPlant(isSelected ? null : id)}
              disabled={qty <= 0}
              className={`
                px-2 py-0.5 rounded text-[10px]
                ${isSelected
                  ? "bg-green-600 text-white"
                  : qty > 0
                    ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                    : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                }
              `}
            >
              {plant.name} ({qty})
            </button>
          );
        })}
      </div>
    </div>
  );
}
