"use client";

import { useGameStore } from "@/lib/game";

export default function UserBar() {
  const user = useGameStore((s) => s.user);

  const expPercent = user.expToNextLevel > 0
    ? Math.round((user.exp / user.expToNextLevel) * 100)
    : 0;

  return (
    <div className="flex items-center gap-4 bg-neutral-800/80 rounded-lg px-4 py-2 border border-neutral-700">
      {/* Level */}
      <div className="flex items-center gap-1.5">
        <span className="text-lg">⭐</span>
        <span className="text-sm font-bold text-yellow-400">Lv.{user.level}</span>
      </div>

      {/* EXP Bar */}
      <div className="flex-1 max-w-[200px]">
        <div className="flex justify-between text-[10px] text-neutral-400 mb-0.5">
          <span>EXP</span>
          <span>{user.exp}/{user.expToNextLevel}</span>
        </div>
        <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${expPercent}%` }}
          />
        </div>
      </div>

      {/* Gold */}
      <div className="flex items-center gap-1">
        <span className="text-lg">💰</span>
        <span className="text-sm font-bold text-yellow-300">
          {user.gold.toLocaleString()}
        </span>
      </div>

      {/* Ruby */}
      <div className="flex items-center gap-1">
        <span className="text-lg">💎</span>
        <span className="text-sm font-bold text-red-400">
          {user.ruby}
        </span>
      </div>
    </div>
  );
}
