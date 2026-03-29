"use client";

import { useMemo } from "react";
import { useGameStore, getGrowthStage, PLANTS, POTS, PEST_NAMES } from "@/lib/game";
import type { Slot, PlantGrowthStage, PotId } from "@/lib/game";

interface PotSlotProps {
  slot: Slot;
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h${m > 0 ? `${m}m` : ""}${s > 0 ? `${s}s` : ""}`;
  if (m > 0) return `${m}m${s > 0 ? `${s}s` : ""}`;
  return `${s}s`;
}

function getStageEmoji(stage: PlantGrowthStage): string {
  switch (stage) {
    case 0: return "";
    case 1: return "🌱";
    case 2: return "🌿";
    case 3: return "🪴";
    case 4: return "🌸";
  }
}

function getStageBg(stage: PlantGrowthStage): string {
  switch (stage) {
    case 0: return "";
    case 1: return "bg-gradient-to-t from-lime-900/30 to-transparent";
    case 2: return "bg-gradient-to-t from-green-900/30 to-transparent";
    case 3: return "bg-gradient-to-t from-emerald-900/30 to-transparent";
    case 4: return "bg-gradient-to-t from-amber-900/30 to-transparent";
  }
}

function getPotColor(potId: string): string {
  switch (potId) {
    case "pot_soil": return "pot-soil border-2";
    case "pot_bronze": return "pot-bronze border-2";
    case "pot_silver": return "pot-silver border-2";
    case "pot_gold": return "pot-gold border-2";
    case "pot_diamond": return "pot-diamond border-2";
    default: return "border-2 border-neutral-700 bg-neutral-800/60";
  }
}

function getTimerColor(remainingTime: number, totalGrowTime: number): string {
  if (remainingTime <= 0) return "text-green-400";
  const ratio = remainingTime / totalGrowTime;
  if (ratio > 0.75) return "text-blue-300";
  if (ratio > 0.5) return "text-cyan-300";
  if (ratio > 0.25) return "text-yellow-300";
  return "text-orange-300";
}

export default function PotSlot({ slot }: PotSlotProps) {
  const activeTool = useGameStore((s) => s.activeTool);
  const selectedSeedId = useGameStore((s) => s.selectedSeedId);
  const selectedPotId = useGameStore((s) => s.selectedPotId);
  const selectedFertilizerId = useGameStore((s) => s.selectedFertilizerId);
  const storePlacePot = useGameStore((s) => s.placePot);
  const storePlantSeed = useGameStore((s) => s.plantSeed);
  const storeHarvest = useGameStore((s) => s.harvest);
  const storeWaterPlant = useGameStore((s) => s.waterPlant);
  const storeRemovePest = useGameStore((s) => s.removePest);
  const storeFertilize = useGameStore((s) => s.fertilize);
  const storePickPot = useGameStore((s) => s.pickPot);

  const plant = slot.plant;
  const potId = slot.potId;

  const growthStage: PlantGrowthStage = useMemo(
    () => (plant ? getGrowthStage(plant) : 0),
    [plant]
  );

  const progress = useMemo(() => {
    if (!plant || plant.totalGrowTime <= 0) return 0;
    return Math.min(1, 1 - plant.remainingTime / plant.totalGrowTime);
  }, [plant]);

  const handleClick = () => {
    if (!activeTool) return;
    switch (activeTool) {
      case "tool_plant":
        if (potId && !plant && selectedSeedId) storePlantSeed(slot.id, selectedSeedId);
        break;
      case "tool_harvest":
        if (plant && plant.remainingTime <= 0) storeHarvest(slot.id);
        break;
      case "tool_water":
        if (plant?.isThirsty) storeWaterPlant(slot.id);
        break;
      case "tool_pest":
        if (plant?.isPest) storeRemovePest(slot.id);
        break;
      case "tool_fertilize":
        if (plant && !plant.isFertilized && selectedFertilizerId) storeFertilize(slot.id, selectedFertilizerId);
        break;
      case "tool_pick_pot":
        if (potId && !plant) storePickPot(slot.id);
        break;
      case "tool_place_pot":
        if (!potId && selectedPotId) storePlacePot(slot.id, selectedPotId as PotId);
        break;
    }
  };

  const isClickable = (() => {
    if (!activeTool) return false;
    switch (activeTool) {
      case "tool_plant": return !!potId && !plant && !!selectedSeedId;
      case "tool_harvest": return !!plant && plant.remainingTime <= 0;
      case "tool_water": return !!plant?.isThirsty;
      case "tool_pest": return !!plant?.isPest;
      case "tool_fertilize": return !!plant && !plant.isFertilized && !!selectedFertilizerId;
      case "tool_pick_pot": return !!potId && !plant;
      case "tool_place_pot": return !potId && !!selectedPotId;
      default: return false;
    }
  })();

  const showPlacePotHint = activeTool === "tool_place_pot" && !potId && selectedPotId;
  const potDef = potId ? POTS[potId] : null;
  const plantDef = plant ? PLANTS[plant.plantId] : null;
  const isReady = plant && plant.remainingTime <= 0;
  const isGrowing = plant && plant.remainingTime > 0 && !plant.isThirsty;

  return (
    <button
      onClick={handleClick}
      disabled={!isClickable}
      className={`
        relative w-full aspect-square rounded-lg border-2 transition-all duration-200
        flex flex-col items-center justify-center gap-0.5 p-1 overflow-hidden
        ${potId ? getPotColor(potId) : "border-dashed border-neutral-600/60 bg-white/5"}
        ${isClickable
          ? "cursor-pointer hover:border-white/60 hover:scale-105 hover:shadow-lg hover:shadow-white/10 active:scale-95"
          : "cursor-default"
        }
        ${showPlacePotHint ? "border-green-500 bg-green-900/30 animate-pulse" : ""}
        ${plant?.isPest ? "ring-2 ring-red-500/80" : ""}
        ${plant?.isThirsty ? "ring-2 ring-yellow-500/80" : ""}
        ${isReady ? "ring-2 ring-green-400 animate-ready-bounce" : ""}
      `}
    >
      {/* Growth stage background */}
      {plant && (
        <div className={`absolute inset-0 ${getStageBg(growthStage)} transition-all duration-500`} />
      )}

      {/* Empty slot */}
      {!potId && !showPlacePotHint && (
        <span className="text-neutral-500 text-[10px] select-none">+</span>
      )}

      {/* Place pot hint */}
      {showPlacePotHint && (
        <>
          <span className="text-lg">🏺</span>
          <span className="text-[9px] text-green-400 font-bold select-none">Đặt</span>
        </>
      )}

      {/* Pot only */}
      {potId && !plant && (
        <>
          <span className="text-lg opacity-60">🏺</span>
          <span className="text-[8px] text-neutral-500 truncate w-full text-center select-none">
            {potDef?.name}
          </span>
        </>
      )}

      {/* Plant */}
      {plant && plantDef && (
        <>
          {/* Growth emoji with animation */}
          <span
            className={`text-lg relative z-10 ${plant.isPest ? "grayscale opacity-60" : ""}`}
          >
            {getStageEmoji(growthStage)}
          </span>

          {/* Plant name */}
          <span className="text-[9px] text-white/90 font-medium truncate w-full text-center select-none relative z-10">
            {plantDef.name}
          </span>

          {/* Progress bar */}
          <div className="w-[85%] h-1.5 bg-black/30 rounded-full overflow-hidden relative z-10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isReady
                  ? "bg-gradient-to-r from-green-400 to-emerald-400"
                  : plant.isPest
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : plant.isThirsty
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                      : "bg-gradient-to-r from-blue-400 to-cyan-400"
              }`}
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          {/* Status / Timer */}
          <div className="relative z-10">
            {isReady ? (
              <span className="text-[10px] text-green-300 font-bold select-none">
                THU HOẠCH!
              </span>
            ) : plant.isPest ? (
              <span className="text-[9px] text-red-300 font-bold select-none">
                🐛 {PEST_NAMES[PLANTS[plant.plantId].pestType]}
              </span>
            ) : plant.isThirsty ? (
              <span className="text-[9px] text-yellow-300 font-bold select-none">
                💧 Tưới nước
              </span>
            ) : (
              <span
                className={`text-[10px] font-bold tabular-nums select-none ${getTimerColor(
                  plant.remainingTime,
                  plant.totalGrowTime
                )}`}
              >
                ⏱{formatTime(plant.remainingTime)}
              </span>
            )}
          </div>

          {/* Corner indicators */}
          {plant.isFertilized && (
            <span className="absolute top-0.5 right-0.5 text-[7px] z-10">✨</span>
          )}
          {plant.isPest && isGrowing && (
            <span className="absolute top-0.5 left-0.5 text-[7px] z-10">🐛</span>
          )}
          {potDef && potDef.expBuffPercent > 0 && (
            <span className="absolute bottom-0.5 right-0.5 text-[7px] text-neutral-400 z-10">
              +{potDef.expBuffPercent}%
            </span>
          )}
        </>
      )}
    </button>
  );
}
