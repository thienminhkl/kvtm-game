"use client";

import { useGameStore, PEST_NAMES, PLANT_IDS, POT_IDS, FERTILIZERS, PLANTS, POTS, FERTILIZER_IDS } from "@/lib/game";
import type { PestType } from "@/lib/game";

const PEST_ICONS: Record<PestType, string> = {
  beetle: "🪲",
  caterpillar: "🐛",
  snail: "🐌",
  dragonfly: "🪰",
};

export default function InventoryPanel() {
  const inventory = useGameStore((s) => s.inventory);

  return (
    <div className="bg-neutral-800/80 rounded-lg border border-neutral-700 p-2 w-full max-w-[180px]">
      <div className="text-[10px] text-neutral-400 font-medium mb-2">
        📦 Kho Đồ
      </div>

      {/* Pests */}
      <div className="mb-2">
        <div className="text-[9px] text-neutral-500 mb-1">Sâu bọ đã bắt</div>
        <div className="grid grid-cols-2 gap-1">
          {(Object.keys(PEST_NAMES) as PestType[]).map((pestType) => {
            const qty = inventory.pests[pestType] ?? 0;
            return (
              <div
                key={pestType}
                className="flex items-center gap-1 px-1.5 py-1 rounded bg-neutral-700/60 text-[10px]"
              >
                <span>{PEST_ICONS[pestType]}</span>
                <span className="text-neutral-300 truncate">{PEST_NAMES[pestType]}</span>
                <span className="font-mono font-bold text-white ml-auto">x{qty}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick summary */}
      <div className="text-[9px] text-neutral-500 mb-1">Tóm tắt</div>
      <div className="flex flex-col gap-0.5 text-[10px]">
        <div className="flex justify-between text-neutral-400">
          <span>🌱 Hạt giống</span>
          <span className="font-mono text-white">
            {PLANT_IDS.reduce((sum, id) => sum + (inventory.seeds[id] ?? 0), 0)}
          </span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>🪴 Chậu</span>
          <span className="font-mono text-white">
            {POT_IDS.reduce((sum, id) => sum + (inventory.pots[id] ?? 0), 0)}
          </span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>🧪 Phân bón</span>
          <span className="font-mono text-white">
            {FERTILIZER_IDS.reduce((sum, id) => sum + (inventory.fertilizers[id] ?? 0), 0)}
          </span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>💧 Nước</span>
          <span className="font-mono text-white">{inventory.tools.waterCan}</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>🪲 Vợt</span>
          <span className="font-mono text-white">{inventory.tools.insectNet}</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>🍌 Chuối</span>
          <span className="font-mono text-white">{inventory.tools.banana}</span>
        </div>
      </div>
    </div>
  );
}
