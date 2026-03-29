"use client";

import { useGameStore, CLOUD_LAYER_COUNT } from "@/lib/game";

export default function Beanstalk() {
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);

  return (
    <div className="flex flex-col items-center relative h-full justify-end">
      <div className="relative flex flex-col items-center h-full justify-between py-1">
        {/* Main trunk */}
        <div className="beanstalk-trunk w-5 h-full relative">
          {Array.from({ length: CLOUD_LAYER_COUNT }).map((_, i) => {
            const isActive = i === activeCloudIndex;
            const progress = i / (CLOUD_LAYER_COUNT - 1);
            const isLeft = i % 2 === 0;

            return (
              <div
                key={i}
                className="absolute left-1/2 -translate-x-1/2 flex items-center"
                style={{ top: `${progress * 100}%` }}
              >
                {/* Branch leaf */}
                <div
                  className={`absolute ${isLeft ? "-left-5" : "-right-5"} animate-leaf-sway`}
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <div className={`beanstalk-leaf ${isLeft ? "w-7 h-4 -rotate-12" : "w-6 h-3 rotate-12"}`} />
                </div>

                {/* Floor badge */}
                <div className={`
                  relative z-10 flex items-center justify-center rounded-full font-bold transition-all
                  ${isActive
                    ? "w-6 h-6 bg-green-600 text-white text-[10px] ring-2 ring-green-300/50 glow-green"
                    : "w-5 h-5 bg-green-900/70 text-green-300/60 text-[8px]"
                  }
                `}>
                  <span className={isActive ? "glow-floor" : ""}>{i + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Root */}
        <div className="beanstalk-root w-10 h-5 rounded-b-full relative">
          <div className="absolute -left-1 bottom-0 w-3 h-3 bg-amber-900/60 rounded-bl-full" />
          <div className="absolute -right-1 bottom-0 w-3 h-3 bg-amber-900/60 rounded-br-full" />
        </div>
      </div>
    </div>
  );
}
