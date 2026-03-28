"use client";

import { useState } from "react";
import { useGameStore, MACHINES, MACHINE_IDS } from "@/lib/game";
import type { MachineId } from "@/lib/game";
import MachineUI from "./MachineUI";

function MachineCard({ id, isSelected, onSelect }: {
  id: MachineId;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const machine = MACHINES[id];
  const machineState = useGameStore((s) => s.machines.find(m => m.id === id));
  const isCrafting = machineState?.craftingRecipeIndex !== null && !machineState?.hasProduct;
  const hasProduct = machineState?.hasProduct;

  return (
    <button
      onClick={onSelect}
      className={`
        flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200
        ${isSelected
          ? "border-blue-400 bg-blue-900/30 scale-105"
          : hasProduct
            ? "border-green-400 bg-green-900/20 animate-pulse"
            : isCrafting
              ? "border-yellow-500/50 bg-yellow-900/10"
              : "border-neutral-600 bg-neutral-800/50 hover:border-neutral-400 hover:bg-neutral-700/50"
        }
      `}
    >
      <span className="text-3xl">{machine.icon}</span>
      <span className="text-[10px] text-neutral-300 font-medium text-center">
        {machine.name}
      </span>
      {isCrafting && machineState && (
        <span className="text-[9px] text-yellow-400 tabular-nums">
          ⏱{machineState.craftingRemainingTime}s
        </span>
      )}
      {hasProduct && (
        <span className="text-[9px] text-green-400 font-bold">
          Thu hoạch!
        </span>
      )}
    </button>
  );
}

export default function GroundView() {
  const [selectedMachine, setSelectedMachine] = useState<MachineId | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[700px]">
      {/* Jack's House */}
      <div className="relative w-full bg-gradient-to-b from-amber-900/30 to-amber-950/50 rounded-2xl p-4 border border-amber-800/30">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl select-none">
          🏠
        </div>

        <div className="text-center mt-4 mb-3">
          <span className="text-sm text-amber-200 font-medium">🏠 Nhà của Jack</span>
        </div>

        {/* Jack character */}
        <div className="flex justify-center mb-3">
          <div className="flex flex-col items-center">
            <span className="text-4xl">👨‍🌾</span>
            <span className="text-[10px] text-neutral-400 mt-0.5">Jack</span>
          </div>
        </div>

        {/* Machines */}
        <div className="grid grid-cols-3 gap-3">
          {MACHINE_IDS.map((id) => (
            <MachineCard
              key={id}
              id={id}
              isSelected={selectedMachine === id}
              onSelect={() => setSelectedMachine(selectedMachine === id ? null : id)}
            />
          ))}
        </div>
      </div>

      {/* Machine UI panel */}
      {selectedMachine && (
        <MachineUI
          machineId={selectedMachine}
          onClose={() => setSelectedMachine(null)}
        />
      )}
    </div>
  );
}
