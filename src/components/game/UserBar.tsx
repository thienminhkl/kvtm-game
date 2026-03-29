"use client";

import { useGameStore } from "@/lib/game";

export default function UserBar() {
  const user = useGameStore((s) => s.user);

  const expPercent = user.expToNextLevel > 0
    ? Math.round((user.exp / user.expToNextLevel) * 100)
    : 0;

  return (
    <div className="flex-1 flex items-center gap-2 sm:gap-4 glass-dark rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-0">
      {/* Level with star */}
      <div className="flex items-center gap-1">
        <span className="text-base sm:text-lg">⭐</span>
        <span className="text-xs sm:text-sm font-bold text-yellow-400 text-stroke">{user.level}</span>
      </div>

      {/* EXP Bar */}
      <div className="flex-1 max-w-[120px] sm:max-w-[200px] hidden sm:block">
        <div className="flex justify-between text-[9px] sm:text-[10px] text-neutral-400 mb-0.5">
          <span>EXP</span>
          <span>{user.exp}/{user.expToNextLevel}</span>
        </div>
        <div className="h-2 bg-neutral-800/60 rounded-full overflow-hidden border border-neutral-600/30">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${expPercent}%` }}
          />
        </div>
      </div>

      {/* Gold - text-stroke per spec */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <span className="text-base sm:text-lg">💰</span>
        <span className="text-xs sm:text-sm font-bold text-yellow-300 text-stroke">
          {user.gold >= 1000000
            ? `${Math.floor(user.gold / 1000)}k`
            : user.gold.toLocaleString("en-US")
          }
        </span>
      </div>

      {/* Ruby */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <span className="text-base sm:text-lg">💎</span>
        <span className="text-xs sm:text-sm font-bold text-red-400 text-stroke">
          {user.ruby}
        </span>
      </div>
    </div>
  );
}
