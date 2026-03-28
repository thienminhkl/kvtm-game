"use client";

import { useGameStore, CLOUD_LAYER_COUNT } from "@/lib/game";

export default function CloudNavigator() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);
  const setActiveCloudIndex = useGameStore((s) => s.setActiveCloudIndex);

  const canGoUp = activeCloudIndex < CLOUD_LAYER_COUNT - 1;
  const canGoDown = activeCloudIndex > 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => canGoDown && setActiveCloudIndex(activeCloudIndex - 1)}
        disabled={!canGoDown}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center text-base
          transition-all duration-150
          ${canGoDown
            ? "bg-green-700/60 hover:bg-green-600/60 text-green-200 hover:scale-110"
            : "bg-neutral-800/50 text-neutral-600 cursor-not-allowed"
          }
        `}
      >
        ▲
      </button>

      <button
        onClick={() => canGoUp && setActiveCloudIndex(activeCloudIndex + 1)}
        disabled={!canGoUp}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center text-base
          transition-all duration-150
          ${canGoUp
            ? "bg-green-700/60 hover:bg-green-600/60 text-green-200 hover:scale-110"
            : "bg-neutral-800/50 text-neutral-600 cursor-not-allowed"
          }
        `}
      >
        ▼
      </button>
    </div>
  );
}
