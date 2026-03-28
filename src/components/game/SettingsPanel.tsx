"use client";

import { useState, useEffect } from "react";
import { useGameStore, DAILY_REWARDS } from "@/lib/game";

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const isSandbox = useGameStore((s) => s.isSandbox);
  const toggleSandbox = useGameStore((s) => s.toggleSandbox);
  const canClaim = useGameStore((s) => s.canClaimDailyReward());
  const claimDailyReward = useGameStore((s) => s.claimDailyReward);
  const dailyRewardStreak = useGameStore((s) => s.dailyRewardStreak);
  const lastDailyReward = useGameStore((s) => s.lastDailyReward);
  const resetGame = useGameStore((s) => s.resetGame);

  const nextDay = (dailyRewardStreak + 1) % 7;
  const nextReward = DAILY_REWARDS[nextDay];

  // Time until next reward (updates every minute)
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const update = () => {
      if (!lastDailyReward || canClaim) { setTimeLeft(""); return; }
      const remaining = 24 * 60 * 60 * 1000 - (Date.now() - lastDailyReward);
      if (remaining <= 0) { setTimeLeft(""); return; }
      const h = Math.floor(remaining / (1000 * 60 * 60));
      const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${h}h ${m}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [lastDailyReward, canClaim]);

  return (
    <div className="w-full max-w-[320px] bg-neutral-800/95 rounded-xl border border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-700">
        <span className="text-sm text-white font-medium">⚙️ Cài Đặt</span>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-400 text-xs flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {/* Daily Reward */}
        <div className="bg-neutral-700/50 rounded-lg p-2.5">
          <div className="text-[11px] text-neutral-300 font-medium mb-1.5">
            🎁 Phần thưởng hàng ngày
          </div>
          <div className="text-[10px] text-neutral-400 mb-2">
            Chuỗi: {dailyRewardStreak + 1}/7 ngày
          </div>

          {canClaim ? (
            <button
              onClick={() => claimDailyReward()}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white text-[11px] font-bold transition-all animate-pulse"
            >
              🎁 Nhận thưởng! (Ngày {nextDay + 1})
            </button>
          ) : (
            <div className="text-[10px] text-neutral-500 text-center py-2">
              ⏱ Còn {timeLeft} để nhận tiếp
            </div>
          )}

          {/* Reward preview */}
          <div className="mt-1.5 text-[9px] text-neutral-400 flex items-center gap-2">
            <span>💰×{nextReward.gold}</span>
            {Object.entries(nextReward.seeds).map(([id, qty]) => (
              <span key={id}>🌱×{qty as number}</span>
            ))}
            {nextReward.pots > 0 && <span>🏺×{nextReward.pots}</span>}
          </div>
        </div>

        {/* Sandbox Toggle */}
        <div className="bg-neutral-700/50 rounded-lg p-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-neutral-300 font-medium">
                {isSandbox ? "🧪 Sandbox" : "🎮 Production"}
              </div>
              <div className="text-[9px] text-neutral-500">
                {isSandbox ? "Tất cả item x99, level 99" : "Bắt đầu từ đầu"}
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm(isSandbox ? "Chuyển sang Production? Tiến trình hiện tại sẽ bị reset." : "Chuyển sang Sandbox?")) {
                  toggleSandbox();
                }
              }}
              className={`
                px-3 py-1.5 rounded-md text-[10px] font-medium transition-all
                ${isSandbox
                  ? "bg-yellow-600 hover:bg-yellow-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
                }
              `}
            >
              {isSandbox ? "Chuyển Production" : "Chuyển Sandbox"}
            </button>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            if (confirm("Reset toàn bộ game? Hành động này không thể hoàn tác.")) {
              resetGame();
            }
          }}
          className="w-full py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800/50 border border-red-800/50 text-[10px] text-red-300 transition-all"
        >
          🔄 Reset Game
        </button>
      </div>
    </div>
  );
}
