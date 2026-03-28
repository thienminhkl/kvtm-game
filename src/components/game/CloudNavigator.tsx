"use client";

import { useGameStore, CLOUD_LAYER_COUNT } from "@/lib/game";

export default function CloudNavigator() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);
  const setActiveCloudIndex = useGameStore((s) => s.setActiveCloudIndex);

  const canGoUp = activeCloudIndex < CLOUD_LAYER_COUNT - 1;
  const canGoDown = activeCloudIndex > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Beanstalk / vine visual */}
      <div className="flex flex-col items-center relative">
        {/* Vine segments */}
        <div className="flex flex-col items-center gap-0.5">
          {Array.from({ length: CLOUD_LAYER_COUNT }).map((_, i) => {
            const isActive = i === activeCloudIndex;
            const isBelow = i < activeCloudIndex;
            return (
              <button
                key={i}
                onClick={() => setActiveCloudIndex(i)}
                className={`
                  flex items-center justify-center rounded-full text-[10px] font-bold
                  transition-all duration-300
                  ${isActive
                    ? "w-7 h-7 bg-green-500 text-white ring-2 ring-green-300 scale-110"
                    : isBelow
                      ? "w-5 h-5 bg-green-800/60 text-green-300 hover:bg-green-700/60"
                      : "w-5 h-5 bg-neutral-700/60 text-neutral-400 hover:bg-neutral-600/60"
                  }
                `}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Vine decoration */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-800/40 via-green-600/40 to-green-800/40 -z-10 animate-vine-sway" />
      </div>

      {/* Navigation arrows + current layer info */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => canGoDown && setActiveCloudIndex(activeCloudIndex - 1)}
          disabled={!canGoDown}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm
            transition-all duration-150
            ${canGoDown
              ? "bg-green-700/60 hover:bg-green-600/60 text-green-200"
              : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
            }
          `}
        >
          ▲
        </button>

        <div className="flex flex-col items-center py-1">
          <span className="text-[10px] text-neutral-500">Tầng</span>
          <span className="text-xl font-bold text-white leading-none">
            {activeCloudIndex + 1}
          </span>
          <span className="text-[10px] text-neutral-500">/ {CLOUD_LAYER_COUNT}</span>
        </div>

        <button
          onClick={() => canGoUp && setActiveCloudIndex(activeCloudIndex + 1)}
          disabled={!canGoUp}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm
            transition-all duration-150
            ${canGoUp
              ? "bg-green-700/60 hover:bg-green-600/60 text-green-200"
              : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
            }
          `}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
