"use client";

import { useGameStore, CLOUD_LAYER_COUNT } from "@/lib/game";

export default function CloudNavigator() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);
  const setActiveCloudIndex = useGameStore((s) => s.setActiveCloudIndex);

  const canGoUp = activeCloudIndex < CLOUD_LAYER_COUNT - 1;
  const canGoDown = activeCloudIndex > 0;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => canGoDown && setActiveCloudIndex(activeCloudIndex - 1)}
        disabled={!canGoDown}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center text-lg
          transition-all duration-150
          ${canGoDown
            ? "bg-neutral-700 hover:bg-neutral-600 text-white"
            : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
          }
        `}
      >
        ▲
      </button>

      <div className="flex flex-col items-center">
        <span className="text-xs text-neutral-400">Tầng</span>
        <span className="text-lg font-bold text-white">
          {activeCloudIndex + 1}/{CLOUD_LAYER_COUNT}
        </span>
      </div>

      <button
        onClick={() => canGoUp && setActiveCloudIndex(activeCloudIndex + 1)}
        disabled={!canGoUp}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center text-lg
          transition-all duration-150
          ${canGoUp
            ? "bg-neutral-700 hover:bg-neutral-600 text-white"
            : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
          }
        `}
      >
        ▼
      </button>
    </div>
  );
}
