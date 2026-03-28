"use client";

import { useGameStore, CLOUD_LAYER_COUNT } from "@/lib/game";

export default function Beanstalk() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);

  return (
    <div className="flex flex-col items-center relative h-full justify-center">
      {/* Vine stem */}
      <div className="relative w-4 flex flex-col items-center gap-1">
        {Array.from({ length: CLOUD_LAYER_COUNT }).map((_, i) => {
          const isActive = i === activeCloudIndex;
          const isBelow = i < activeCloudIndex;
          return (
            <div
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all duration-500
                ${isActive
                  ? "bg-green-400 ring-2 ring-green-300 scale-125"
                  : isBelow
                    ? "bg-green-700/60"
                    : "bg-green-900/40"
                }
              `}
            />
          );
        })}
      </div>

      {/* Main vine */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-900/30 via-green-600/50 to-green-900/30 -z-10 animate-vine-sway rounded-full" />

      {/* Leaf decorations */}
      <div className="absolute -left-1 top-[20%] text-[10px] opacity-40 rotate-[-30deg]">🍃</div>
      <div className="absolute -right-1 top-[50%] text-[10px] opacity-40 rotate-[20deg]">🍃</div>
      <div className="absolute -left-1 top-[75%] text-[10px] opacity-40 rotate-[-15deg]">🍃</div>
    </div>
  );
}
