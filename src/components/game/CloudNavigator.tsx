"use client";

import { useGameStore, CLOUD_LAYER_COUNT } from "@/lib/game";

export default function CloudNavigator() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);
  const setActiveCloudIndex = useGameStore((s) => s.setActiveCloudIndex);

  const canGoUp = activeCloudIndex < CLOUD_LAYER_COUNT - 1;
  const canGoDown = activeCloudIndex > 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => canGoUp && setActiveCloudIndex(activeCloudIndex + 1)}
        disabled={!canGoUp}
        title="Tầng cao hơn"
        className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm
          transition-all duration-150
          ${canGoUp
            ? "bg-green-700/60 hover:bg-green-600/60 text-green-200 hover:scale-110"
            : "bg-neutral-800/30 text-neutral-600 cursor-not-allowed"
          }
        `}
      >
        ▲
      </button>

      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-white glow-floor leading-none">
          {activeCloudIndex + 1}
        </span>
        <span className="text-[8px] text-green-400/60">tầng</span>
      </div>

      <button
        onClick={() => canGoDown && setActiveCloudIndex(activeCloudIndex - 1)}
        disabled={!canGoDown}
        title="Tầng thấp hơn"
        className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm
          transition-all duration-150
          ${canGoDown
            ? "bg-green-700/60 hover:bg-green-600/60 text-green-200 hover:scale-110"
            : "bg-neutral-800/30 text-neutral-600 cursor-not-allowed"
          }
        `}
      >
        ▼
      </button>
    </div>
  );
}
