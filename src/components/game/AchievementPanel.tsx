"use client";

import { useGameStore } from "@/lib/game";

export default function AchievementPanel({ onClose }: { onClose: () => void }) {
  const achievements = useGameStore((s) => s.achievements);
  const stats = useGameStore((s) => s.stats);
  const user = useGameStore((s) => s.user);

  const handleClaim = (achievement: typeof achievements[0]) => {
    if (achievement.claimed || achievement.current < achievement.target) return;
    useGameStore.setState((s) => ({
      user: {
        ...s.user,
        gold: s.user.gold + achievement.reward.gold,
        ruby: s.user.ruby + achievement.reward.ruby,
      },
      achievements: s.achievements.map(a =>
        a.id === achievement.id ? { ...a, claimed: true } : a
      ),
    }));
    const state = useGameStore.getState();
    state.addNotification(`Nhận thưởng: ${achievement.name}! +${achievement.reward.gold}💰`, "success");
  };

  return (
    <div className="w-full max-w-[700px] bg-neutral-800/95 rounded-xl border border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <span className="text-sm text-white font-medium">Thành Tích</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-400 text-xs flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Stats summary */}
      <div className="px-3 py-2 flex flex-wrap gap-3 text-[10px] text-neutral-400 border-b border-neutral-700">
        <span>🌾 Thu hoạch: {stats.totalHarvested}</span>
        <span>🌱 Trồng: {stats.totalPlanted}</span>
        <span>💰 Kiếm: {stats.totalGoldEarned.toLocaleString("en-US")}</span>
        <span>🐛 Bắt sâu: {stats.totalPestsKilled}</span>
        <span>🔨 Nâng cấp: {stats.totalUpgrades}</span>
      </div>

      {/* Achievements */}
      <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[250px] overflow-y-auto">
        {achievements.map(a => {
          const progress = Math.min(1, a.current / a.target);
          const canClaim = !a.claimed && a.current >= a.target;

          return (
            <div
              key={a.id}
              className={`
                flex items-center gap-2 p-2 rounded-lg border
                ${a.claimed
                  ? "border-neutral-700 bg-neutral-800/30 opacity-50"
                  : canClaim
                    ? "border-yellow-500/50 bg-yellow-900/10"
                    : "border-neutral-700 bg-neutral-800/50"
                }
              `}
            >
              <span className="text-xl flex-shrink-0">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-white font-medium">{a.name}</div>
                <div className="text-[9px] text-neutral-400">{a.description}</div>
                <div className="mt-1 h-1 bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${a.claimed ? "bg-neutral-600" : "bg-yellow-500"}`}
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <div className="text-[8px] text-neutral-500 mt-0.5">
                  {a.current}/{a.target}
                  {a.reward.gold > 0 && ` • 💰${a.reward.gold}`}
                  {a.reward.ruby > 0 && ` • 💎${a.reward.ruby}`}
                </div>
              </div>
              {canClaim && (
                <button
                  onClick={() => handleClaim(a)}
                  className="flex-shrink-0 px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-500 text-[9px] text-white font-bold"
                >
                  Nhận!
                </button>
              )}
              {a.claimed && (
                <span className="flex-shrink-0 text-[9px] text-green-400">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
