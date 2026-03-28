"use client";

import { useMemo } from "react";
import { useGameStore, getGrowthStage, PLANTS, POTS, PEST_NAMES } from "@/lib/game";
import type { Slot, PlantGrowthStage } from "@/lib/game";

interface PotSlotProps {
  slot: Slot;
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return "SẴN SÀNG";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getStageLabel(stage: PlantGrowthStage): string {
  switch (stage) {
    case 0: return "";
    case 1: return "🌱 Mầm";
    case 2: return "🌿 Lớn";
    case 3: return "🪴 Lớn nhanh";
    case 4: return "🌸 Chín";
  }
}

function getStageColor(stage: PlantGrowthStage): string {
  switch (stage) {
    case 0: return "";
    case 1: return "bg-lime-900/40";
    case 2: return "bg-green-900/40";
    case 3: return "bg-emerald-900/40";
    case 4: return "bg-amber-900/40";
  }
}

function getPotColor(potId: string): string {
  switch (potId) {
    case "pot_soil": return "border-amber-800 bg-amber-950/60";
    case "pot_bronze": return "border-orange-700 bg-orange-950/60";
    case "pot_silver": return "border-slate-400 bg-slate-800/60";
    case "pot_gold": return "border-yellow-500 bg-yellow-950/60";
    case "pot_diamond": return "border-cyan-400 bg-cyan-950/60";
    default: return "border-neutral-700 bg-neutral-800/60";
  }
}

export default function PotSlot({ slot }: PotSlotProps) {
  const activeTool = useGameStore((s) => s.activeTool);
  const selectedSeedId = useGameStore((s) => s.selectedSeedId);
  const selectedPotId = useGameStore((s) => s.selectedPotId);
  const selectedFertilizerId = useGameStore((s) => s.selectedFertilizerId);
  const plantSeed = useGameStore((s) => s.plantSeed);
  const harvest = useGameStore((s) => s.harvest);
  const waterPlant = useGameStore((s) => s.waterPlant);
  const removePest = useGameStore((s) => s.removePest);
  const fertilize = useGameStore((s) => s.fertilize);
  const pickPot = useGameStore((s) => s.pickPot);
  const placePot = useGameStore((s) => s.placePot);

  const plant = slot.plant;
  const potId = slot.potId;

  const growthStage: PlantGrowthStage = useMemo(
    () => (plant ? getGrowthStage(plant) : 0),
    [plant]
  );

  const progress = useMemo(() => {
    if (!plant) return 0;
    return Math.min(1, 1 - plant.remainingTime / plant.totalGrowTime);
  }, [plant]);

  const handleClick = () => {
    if (!activeTool) return;

    switch (activeTool) {
      case "tool_plant":
        if (potId && !plant && selectedSeedId) {
          plantSeed(slot.id, selectedSeedId);
        }
        break;
      case "tool_harvest":
        if (plant && plant.remainingTime <= 0) {
          harvest(slot.id);
        }
        break;
      case "tool_water":
        if (plant?.isThirsty) {
          waterPlant(slot.id);
        }
        break;
      case "tool_pest":
        if (plant?.isPest) {
          removePest(slot.id);
        }
        break;
      case "tool_fertilize":
        if (plant && !plant.isFertilized && selectedFertilizerId) {
          fertilize(slot.id, selectedFertilizerId);
        }
        break;
      case "tool_pick_pot":
        if (potId && !plant) {
          pickPot(slot.id);
        }
        break;
      case "tool_place_pot":
        if (!potId && selectedPotId) {
          placePot(slot.id, selectedPotId);
        }
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

  const potDef = potId ? POTS[potId] : null;
  const plantDef = plant ? PLANTS[plant.plantId] : null;

  return (
    <button
      onClick={handleClick}
      disabled={!isClickable}
      className={`
        relative w-full aspect-square rounded-lg border-2 transition-all duration-200
        flex flex-col items-center justify-center gap-0.5 p-1
        ${potId ? getPotColor(potId) : "border-dashed border-neutral-600 bg-neutral-800/30"}
        ${isClickable ? "cursor-pointer hover:border-white/60 hover:scale-105 hover:shadow-lg hover:shadow-white/10" : "cursor-default"}
        ${plant?.isPest ? "ring-2 ring-red-500 animate-pulse" : ""}
        ${plant?.isThirsty ? "ring-2 ring-yellow-500" : ""}
        ${plant && plant.remainingTime <= 0 ? "ring-2 ring-green-400" : ""}
      `}
    >
      {/* Empty slot - no pot */}
      {!potId && (
        <span className="text-neutral-500 text-xs">+ Chậu</span>
      )}

      {/* Pot but no plant */}
      {potId && !plant && (
        <>
          <span className="text-lg">🪴</span>
          <span className="text-[10px] text-neutral-400 truncate w-full text-center">
            {potDef?.name}
          </span>
        </>
      )}

      {/* Plant growing or ready */}
      {plant && plantDef && (
        <>
          {/* Growth stage icon */}
          <span className={`text-lg ${getStageColor(growthStage)} rounded px-1`}>
            {getStageLabel(growthStage).split(" ")[0]}
          </span>

          {/* Plant name */}
          <span className="text-[10px] text-white font-medium truncate w-full text-center">
            {plantDef.name}
          </span>

          {/* Progress bar */}
          <div className="w-[85%] h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                growthStage === 4
                  ? "bg-green-400"
                  : plant.isPest || plant.isThirsty
                    ? "bg-yellow-500"
                    : "bg-blue-400"
              }`}
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          {/* Timer or status */}
          {plant.remainingTime <= 0 ? (
            <span className="text-[10px] text-green-400 font-bold">
              Thu hoạch!
            </span>
          ) : plant.isPest ? (
            <span className="text-[10px] text-red-400 font-bold">
              🐛 {PEST_NAMES[PLANTS[plant.plantId].pestType]}
            </span>
          ) : plant.isThirsty ? (
            <span className="text-[10px] text-yellow-400 font-bold">
              💧 Khát nước
            </span>
          ) : (
            <span className="text-[9px] text-neutral-300">
              {formatTime(plant.remainingTime)}
            </span>
          )}

          {/* Fertilized indicator */}
          {plant.isFertilized && (
            <span className="absolute top-0.5 right-0.5 text-[8px]">✨</span>
          )}

          {/* Pot tier indicator */}
          {potDef && potDef.expBuffPercent > 0 && (
            <span className="absolute bottom-0.5 right-0.5 text-[8px] text-neutral-400">
              +{potDef.expBuffPercent}%
            </span>
          )}
        </>
      )}
    </button>
  );
}
