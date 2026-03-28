"use client";

import { useState } from "react";
import { useGameStore, SHOP_ITEMS } from "@/lib/game";
import type { ShopCategory } from "@/lib/game";

const CATEGORIES: { id: ShopCategory; label: string; icon: string }[] = [
  { id: "seeds", label: "Hạt", icon: "🌱" },
  { id: "pots", label: "Chậu", icon: "🏺" },
  { id: "fertilizers", label: "Phân", icon: "🧪" },
  { id: "tools", label: "Công cụ", icon: "🔧" },
];

export default function Shop({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<ShopCategory>("seeds");
  const user = useGameStore((s) => s.user);
  const buyItem = useGameStore((s) => s.buyItem);

  const items = SHOP_ITEMS.filter(i => i.category === category);

  const handleBuy = (itemId: string) => {
    buyItem(itemId);
  };

  return (
    <div className="w-full max-w-[700px] bg-neutral-800/95 rounded-xl border border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏪</span>
          <span className="text-sm text-white font-medium">Cửa Hàng</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-yellow-300">💰 {user.gold.toLocaleString("en-US")}</span>
          <span className="text-[11px] text-red-400">💎 {user.ruby}</span>
          <span className="text-[11px] text-neutral-400">⭐ Lv.{user.level}</span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-400 text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex border-b border-neutral-700">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`
              flex-1 py-1.5 text-[11px] font-medium transition-colors
              ${category === cat.id
                ? "text-white bg-neutral-700 border-b-2 border-blue-500"
                : "text-neutral-400 hover:text-neutral-200"
              }
            `}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[250px] overflow-y-auto">
        {items.map(item => {
          const isLocked = user.level < item.unlockLevel;
          const canAfford = item.currency === "gold"
            ? user.gold >= item.price
            : user.ruby >= item.price;
          const canBuy = !isLocked && canAfford;

          return (
            <button
              key={item.id}
              onClick={() => canBuy && handleBuy(item.id)}
              disabled={!canBuy}
              className={`
                flex items-center gap-2 p-2 rounded-lg text-left transition-all
                ${isLocked
                  ? "bg-neutral-800/50 opacity-40 cursor-not-allowed"
                  : canBuy
                    ? "bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
                    : "bg-neutral-800/70 opacity-60 cursor-not-allowed"
                }
              `}
            >
              <span className="text-lg flex-shrink-0">{isLocked ? "🔒" : item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-white font-medium truncate">
                  {item.name}
                </div>
                <div className="text-[9px] text-neutral-400">
                  {isLocked
                    ? `🔓 Lv.${item.unlockLevel}`
                    : `×${item.quantity}`
                  }
                </div>
              </div>
              {!isLocked && (
                <div className="text-right flex-shrink-0">
                  <div className={`text-[10px] font-bold ${canAfford ? "text-yellow-300" : "text-red-400"}`}>
                    {item.currency === "gold" ? "💰" : "💎"}{item.price.toLocaleString("en-US")}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
