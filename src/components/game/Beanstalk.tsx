"use client";

import { useGameStore, CLOUD_LAYER_COUNT } from "@/lib/game";

const LEAF_POSITIONS = ["-left-3", "-right-3", "-left-2", "-right-2", "-left-3", "-right-3", "-left-2", "-right-2"];

export default function Beanstalk() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);

  return (
    <div className="flex flex-col items-center relative h-full justify-between py-2">
      {/* Main trunk */}
      <div className="relative w-6 flex flex-col items-center">
        {/* Trunk body - spiral texture */}
        <div className="w-3 h-full beanstalk-trunk rounded-full relative animate-vine-sway">
          {/* Spiral lines */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 5px)",
          }} />
        </div>

        {/* Floor junctions with leaves */}
        {Array.from({ length: CLOUD_LAYER_COUNT }).map((_, i) => {
          const isActive = i === activeCloudIndex;
          const leafSide = LEAF_POSITIONS[i];
          const progress = i / (CLOUD_LAYER_COUNT - 1);

          return (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 flex items-center"
              style={{ top: `${progress * 100}%` }}
            >
              {/* Leaf branch at floor junction */}
              <div className={`absolute ${leafSide} animate-leaf-sway`} style={{ animationDelay: `${i * 0.5}s` }}>
                <div className="beanstalk-leaf w-5 h-3 rounded-full opacity-60" />
              </div>

              {/* Floor number badge */}
              <div className={`
                relative z-10 flex items-center justify-center rounded-full font-bold transition-all duration-300
                ${isActive
                  ? "w-6 h-6 bg-green-500/90 text-white text-[10px] glow-green ring-1 ring-green-300/50"
                  : "w-5 h-5 bg-green-900/60 text-green-300/70 text-[8px]"
                }
              `}>
                {i + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Root anchor at bottom */}
      <div className="relative mt-1">
        {/* Root tendrils */}
        <div className="flex items-end gap-0.5">
          <div className="w-2 h-4 bg-green-900/60 rounded-bl-full" />
          <div className="w-3 h-6 beanstalk-trunk rounded-b-full" />
          <div className="w-2 h-4 bg-green-900/60 rounded-br-full" />
        </div>
        {/* Soil mound */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-amber-900/40 rounded-full" />
      </div>
    </div>
  );
}
