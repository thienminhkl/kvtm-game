"use client";

import { useGameStore, CLOUD_LAYER_COUNT } from "@/lib/game";

export default function CloudNavigator() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);
  const setActiveCloudIndex = useGameStore((s) => s.setActiveCloudIndex);

  const canGoUp = activeCloudIndex < CLOUD_LAYER_COUNT - 1;
  const canGoDown = activeCloudIndex > 0;

  // Render top-to-bottom (floor 8 at top, floor 1 at bottom)
  const floors = Array.from({ length: CLOUD_LAYER_COUNT }, (_, i) => CLOUD_LAYER_COUNT - 1 - i);

  return (
    <div className="flex items-center gap-2">
      {/* Beanstalk: floor 8 at top, floor 1 at bottom */}
      <div className="flex flex-col items-center gap-0.5 relative">
        {floors.map((floorIndex) => {
          const isActive = floorIndex === activeCloudIndex;
          return (
            <button
              key={floorIndex}
              onClick={() => setActiveCloudIndex(floorIndex)}
              className={`
                flex items-center justify-center rounded-full text-[9px] font-bold
                transition-all duration-300
                ${isActive
                  ? "w-6 h-6 bg-green-500 text-white ring-1 ring-green-300 scale-110"
                  : "w-4 h-4 bg-green-800/40 text-green-400/60 hover:bg-green-700/60"
                }
              `}
            >
              {floorIndex + 1}
            </button>
          );
        })}
        {/* Vine stem */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-800/30 via-green-600/40 to-green-800/30 -z-10 animate-vine-sway" />
      </div>

      {/* Navigation arrows */}
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
              : "bg-neutral-800/50 text-neutral-600 cursor-not-allowed"
            }
          `}
        >
          ▲
        </button>

        <span className="text-[10px] text-neutral-400 font-mono">
          {activeCloudIndex + 1}/{CLOUD_LAYER_COUNT}
        </span>

        <button
          onClick={() => canGoDown && setActiveCloudIndex(activeCloudIndex - 1)}
          disabled={!canGoDown}
          title="Tầng thấp hơn"
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm
            transition-all duration-150
            ${canGoDown
              ? "bg-green-700/60 hover:bg-green-600/60 text-green-200 hover:scale-110"
              : "bg-neutral-800/50 text-neutral-600 cursor-not-allowed"
            }
          `}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
