"use client";

import { useGameStore } from "@/lib/game";

export default function ToastContainer() {
  const notifications = useGameStore((s) => s.notifications);

  if (notifications.length === 0) return null;

  const typeStyles: Record<string, string> = {
    success: "bg-green-800/90 border-green-600 text-green-200",
    warning: "bg-yellow-800/90 border-yellow-600 text-yellow-200",
    error: "bg-red-800/90 border-red-600 text-red-200",
    info: "bg-blue-800/90 border-blue-600 text-blue-200",
  };

  const typeIcons: Record<string, string> = {
    success: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
  };

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-1 items-center pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg border shadow-lg
            text-[11px] font-medium whitespace-nowrap
            animate-[slideDown_0.3s_ease-out]
            ${typeStyles[n.type] || typeStyles.info}
          `}
        >
          <span>{typeIcons[n.type] || "ℹ️"}</span>
          <span>{n.message}</span>
        </div>
      ))}
    </div>
  );
}
