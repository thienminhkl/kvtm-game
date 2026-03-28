"use client";

import { useGameStore, MACHINES } from "@/lib/game";
import type { MachineId } from "@/lib/game";

interface MachineUIProps {
  machineId: MachineId;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m${s > 0 ? `${s}s` : ""}` : `${s}s`;
}

export default function MachineUI({ machineId, onClose }: MachineUIProps) {
  const inventory = useGameStore((s) => s.inventory);
  const machineState = useGameStore((s) => s.machines.find(m => m.id === machineId));
  const startCraft = useGameStore((s) => s.startCraft);
  const collectProduct = useGameStore((s) => s.collectProduct);

  const machineDef = MACHINES[machineId];
  if (!machineDef || !machineState) return null;

  const isCrafting = machineState.craftingRecipeIndex !== null && !machineState.hasProduct;
  const hasProduct = machineState.hasProduct;
  const craftingRecipe = isCrafting || hasProduct
    ? machineDef.recipes[machineState.craftingRecipeIndex!]
    : null;

  const canCraft = (recipeIndex: number): boolean => {
    const recipe = machineDef.recipes[recipeIndex];
    return recipe.ingredients.every(ing => (inventory.seeds[ing.plantId] ?? 0) >= ing.amount);
  };

  return (
    <div className="w-full bg-neutral-800/90 rounded-xl border border-neutral-700 p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{machineDef.icon}</span>
          <span className="text-sm text-white font-medium">{machineDef.name}</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-400 text-xs flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Crafting in progress */}
      {isCrafting && craftingRecipe && (
        <div className="bg-yellow-900/20 rounded-lg p-3 mb-3 border border-yellow-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{craftingRecipe.icon}</span>
              <div>
                <div className="text-[11px] text-white font-medium">{craftingRecipe.name}</div>
                <div className="text-[10px] text-yellow-400">
                  Đang chế tạo... ⏱ {formatTime(machineState.craftingRemainingTime)}
                </div>
              </div>
            </div>
            <div className="w-20 h-2 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.round((1 - machineState.craftingRemainingTime / craftingRecipe.craftTimeSeconds) * 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Product ready to collect */}
      {hasProduct && craftingRecipe && (
        <button
          onClick={() => collectProduct(machineId)}
          className="w-full bg-green-700 hover:bg-green-600 rounded-lg p-3 mb-3 border border-green-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{craftingRecipe.icon}</span>
              <div className="text-left">
                <div className="text-[11px] text-white font-bold">{craftingRecipe.name}</div>
                <div className="text-[10px] text-green-300">
                  +{craftingRecipe.goldReward.toLocaleString("en-US")}💰  +{craftingRecipe.expReward}⭐
                </div>
              </div>
            </div>
            <span className="text-[10px] text-green-200 font-bold">NHẬN</span>
          </div>
        </button>
      )}

      {/* Recipe list */}
      {!isCrafting && !hasProduct && (
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] text-neutral-400 mb-0.5">Công thức:</div>
          {machineDef.recipes.map((recipe, index) => {
            const canDo = canCraft(index);
            return (
              <button
                key={index}
                onClick={() => canDo && startCraft(machineId, index)}
                disabled={!canDo}
                className={`
                  flex items-center gap-2 p-2 rounded-lg text-left transition-all
                  ${canDo
                    ? "bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
                    : "bg-neutral-800/50 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <span className="text-lg">{recipe.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-white font-medium">{recipe.name}</div>
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-400">
                    {recipe.ingredients.map((ing, i) => {
                      const have = inventory.seeds[ing.plantId] ?? 0;
                      const enough = have >= ing.amount;
                      return (
                        <span key={i} className={enough ? "text-green-400" : "text-red-400"}>
                          🌱×{ing.amount}({have})
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] text-yellow-300">
                    💰{recipe.goldReward.toLocaleString("en-US")}
                  </div>
                  <div className="text-[9px] text-purple-300">
                    ⭐{recipe.expReward}  ⏱{formatTime(recipe.craftTimeSeconds)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
