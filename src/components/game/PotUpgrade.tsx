"use client";

import { useGameStore, POTS, POT_IDS, PEST_NAMES, POT_UPGRADE_CHAIN } from "@/lib/game";
import type { PotId, PestType } from "@/lib/game";

const PEST_ICONS: Record<PestType, string> = {
  beetle: "🪲",
  caterpillar: "🐛",
  snail: "🐌",
  dragonfly: "🪰",
};

export default function PotUpgrade({ onClose }: { onClose: () => void }) {
  const inventory = useGameStore((s) => s.inventory);
  const upgradePot = useGameStore((s) => s.upgradePot);

  // Show only pots that can be upgraded and have >= 2 in inventory
  const upgradablePots = POT_IDS.filter(id => {
    const upgrade = POT_UPGRADE_CHAIN[id];
    if (!upgrade) return false;
    return (inventory.pots[id] ?? 0) >= 2;
  });

  // Show all tiers for overview
  const allTiers = POT_IDS.map(id => ({
    id,
    pot: POTS[id],
    qty: inventory.pots[id] ?? 0,
    upgrade: POT_UPGRADE_CHAIN[id],
  }));

  return (
    <div className="w-full max-w-[700px] bg-neutral-800/95 rounded-xl border border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔨</span>
          <span className="text-sm text-white font-medium">Nâng Cấp Chậu</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-400 text-xs flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Tier overview */}
      <div className="p-3 flex flex-col gap-2">
        {allTiers.map(({ id, pot, qty, upgrade }) => {
          const canUpgrade = upgrade && qty >= 2 &&
            (inventory.pests[upgrade.pestType] ?? 0) >= upgrade.pestAmount;

          return (
            <div
              key={id}
              className={`
                flex items-center gap-3 p-2 rounded-lg border
                ${canUpgrade
                  ? "border-green-500/50 bg-green-900/10"
                  : "border-neutral-700 bg-neutral-800/50"
                }
              `}
            >
              {/* Pot info */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xl">🏺</span>
                <div className="min-w-0">
                  <div className="text-[11px] text-white font-medium">{pot.name}</div>
                  <div className="text-[9px] text-neutral-400">
                    +{pot.expBuffPercent}% EXP/Vàng  -{pot.timeReductionPercent}%⏱
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="text-[11px] text-neutral-300 font-mono flex-shrink-0">
                ×{qty}
              </div>

              {/* Upgrade arrow */}
              {upgrade ? (
                <>
                  <div className="text-neutral-500 flex-shrink-0">→</div>

                  {/* Target pot */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xl">🏺</span>
                    <div>
                      <div className="text-[11px] text-white font-medium">{POTS[upgrade.to].name}</div>
                      <div className="text-[9px] text-neutral-400">
                        +{POTS[upgrade.to].expBuffPercent}%
                      </div>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="flex items-center gap-1 text-[10px] text-neutral-400 flex-shrink-0">
                    <span>×2</span>
                    <span>+</span>
                    <span>{PEST_ICONS[upgrade.pestType]}×{upgrade.pestAmount}</span>
                    <span className={`ml-1 ${
                      (inventory.pests[upgrade.pestType] ?? 0) >= upgrade.pestAmount
                        ? "text-green-400"
                        : "text-red-400"
                    }`}>
                      ({inventory.pests[upgrade.pestType] ?? 0})
                    </span>
                  </div>

                  {/* Upgrade button */}
                  <button
                    onClick={() => canUpgrade && upgradePot(id)}
                    disabled={!canUpgrade}
                    className={`
                      px-3 py-1 rounded-md text-[10px] font-medium flex-shrink-0 transition-all
                      ${canUpgrade
                        ? "bg-green-600 hover:bg-green-500 text-white cursor-pointer"
                        : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                      }
                    `}
                  >
                    Đập!
                  </button>
                </>
              ) : (
                <span className="text-[10px] text-yellow-400 flex-shrink-0">⭐ Cao nhất</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
