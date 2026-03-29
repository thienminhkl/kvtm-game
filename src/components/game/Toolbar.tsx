"use client";

import { useState } from "react";
import { useGameStore, TOOLS, PLANT_IDS, POT_IDS, PLANTS } from "@/lib/game";
import type { ToolId, PlantId } from "@/lib/game";
import ToolMenu from "./ToolMenu";

const TOOL_ITEMS: { id: ToolId; icon: string; label: string; key: string }[] = [
  { id: "tool_place_pot", icon: "🏺", label: "Đặt Chậu", key: "1" },
  { id: "tool_plant", icon: "🌱", label: "Trồng", key: "2" },
  { id: "tool_water", icon: "💧", label: "Tưới", key: "3" },
  { id: "tool_pest", icon: "🐛", label: "Bắt Sâu", key: "4" },
  { id: "tool_fertilize", icon: "🧪", label: "Bón Phân", key: "5" },
  { id: "tool_harvest", icon: "🌾", label: "Thu Hoạch", key: "6" },
  { id: "tool_pick_pot", icon: "📦", label: "Cất Chậu", key: "7" },
];

const TOOLS_WITH_MENU: ToolId[] = ["tool_plant", "tool_place_pot", "tool_fertilize"];

export default function Toolbar() {
  const [showMonkeyMenu, setShowMonkeyMenu] = useState(false);
  const activeTool = useGameStore((s) => s.activeTool);
  const setActiveTool = useGameStore((s) => s.setActiveTool);
  const inventory = useGameStore((s) => s.inventory);
  const monkey = useGameStore((s) => s.monkey);
  const toggleMonkey = useGameStore((s) => s.toggleMonkey);
  const setMonkeyAutoPlant = useGameStore((s) => s.setMonkeyAutoPlant);

  const showMenu = activeTool && TOOLS_WITH_MENU.includes(activeTool);

  const handleToolClick = (id: ToolId) => {
    setActiveTool(activeTool === id ? null : id);
    setShowMonkeyMenu(false);
  };

  const totalSeeds = PLANT_IDS.reduce((s, id) => s + (inventory.seeds[id] ?? 0), 0);
  const totalPots = POT_IDS.reduce((s, id) => s + (inventory.pots[id] ?? 0), 0);

  return (
    <div className="relative flex items-center gap-1 bg-neutral-800/90 rounded-lg px-2 py-1.5 border border-neutral-700">
      {/* Tool buttons */}
      {TOOL_ITEMS.map(({ id, icon, label, key }) => {
        const isActive = activeTool === id;
        return (
          <button
            key={id}
            onClick={() => handleToolClick(id)}
            title={`${label} (${key})`}
            className={`
              w-9 h-9 rounded-md flex items-center justify-center text-base
              transition-all duration-150 relative
              ${isActive
                ? "bg-blue-600 ring-2 ring-blue-400 scale-110"
                : "bg-neutral-700 hover:bg-neutral-600"
              }
            `}
          >
            {icon}
            {/* Keyboard shortcut hint */}
            <span className="absolute -bottom-0.5 -right-0.5 text-[7px] text-neutral-400 bg-neutral-800 rounded px-0.5 leading-tight">
              {key}
            </span>
            {isActive && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-blue-300 whitespace-nowrap bg-neutral-900/80 px-1 rounded">
                {label}
              </span>
            )}
          </button>
        );
      })}

      <div className="w-px h-7 bg-neutral-600 mx-0.5" />

      {/* Monkey button */}
      <button
        onClick={() => {
          setShowMonkeyMenu(!showMonkeyMenu);
          setActiveTool(null);
        }}
        title="Khỉ Quản Gia"
        className={`
          w-9 h-9 rounded-md flex items-center justify-center text-base
          transition-all duration-150 relative
          ${monkey.isActive
            ? "bg-green-600 ring-2 ring-green-400"
            : showMonkeyMenu
              ? "bg-neutral-600 ring-1 ring-neutral-400"
              : "bg-neutral-700 hover:bg-neutral-600"
          }
        `}
      >
        🐒
        {monkey.isActive && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-neutral-800" />
        )}
      </button>

      {/* Divider + summary */}
      <div className="w-px h-7 bg-neutral-600 mx-0.5" />

      {!activeTool && !showMonkeyMenu ? (
        <span className="text-[10px] text-neutral-500 px-1 select-none">
          Chọn công cụ
        </span>
      ) : activeTool ? (
        <>
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-300 px-1">
            <span title="Hạt giống">🌱×{totalSeeds}</span>
            <span title="Chậu">🏺×{totalPots}</span>
            <span title="Nước">💧×{inventory.tools.waterCan}</span>
          </div>
          <div className="w-px h-7 bg-neutral-600 mx-0.5" />
          <button
            onClick={() => setActiveTool(null)}
            className="px-2 h-7 rounded-md bg-red-900/60 hover:bg-red-800 text-[10px] text-red-300"
          >
            ✕
          </button>
        </>
      ) : null}

      {/* ToolMenu - render above toolbar area */}
      {showMenu && (
        <div className="absolute bottom-full left-0 mb-2 z-50 max-w-[90vw]">
          <ToolMenu />
        </div>
      )}

      {/* Monkey menu overlay */}
      {showMonkeyMenu && (
        <div className="absolute bottom-full left-0 mb-1 z-50 bg-neutral-800/95 rounded-lg border border-neutral-700 p-2 min-w-[200px]">
          <div className="text-[10px] text-neutral-400 font-medium mb-1.5">
            🐒 Khỉ Quản Gia
          </div>

          {/* On/Off */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-neutral-300">
              Trạng thái: {monkey.isActive ? "🟢 Đang hoạt động" : "⚪ Tắt"}
            </span>
            <span className="text-[10px] text-neutral-400">
              🍌×{monkey.bananasRemaining}
            </span>
          </div>

          <button
            onClick={toggleMonkey}
            disabled={!monkey.isActive && monkey.bananasRemaining <= 0}
            className={`
              w-full py-1.5 rounded-md text-[11px] font-medium mb-2 transition-all
              ${monkey.isActive
                ? "bg-green-600 hover:bg-green-700 text-white"
                : monkey.bananasRemaining > 0
                  ? "bg-neutral-600 hover:bg-neutral-500 text-neutral-200"
                  : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              }
            `}
          >
            {monkey.isActive ? "Tắt Khỉ" : "Bật Khỉ"}
          </button>

          {/* Auto-plant selector */}
          <div className="text-[9px] text-neutral-500 mb-1">Tự động trồng:</div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setMonkeyAutoPlant(null)}
              className={`
                px-2 py-0.5 rounded text-[10px]
                ${!monkey.autoPlantSeedId
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                }
              `}
            >
              Tắt
            </button>
            {PLANT_IDS.map((id) => {
              const qty = inventory.seeds[id] ?? 0;
              const isSelected = monkey.autoPlantSeedId === id;
              return (
                <button
                  key={id}
                  onClick={() => setMonkeyAutoPlant(isSelected ? null : id)}
                  disabled={qty <= 0}
                  className={`
                    px-2 py-0.5 rounded text-[10px]
                    ${isSelected
                      ? "bg-green-600 text-white"
                      : qty > 0
                        ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                        : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                    }
                  `}
                >
                  {PLANTS[id].name} ({qty})
                </button>
              );
            })}
          </div>

          {/* Monkey actions info */}
          <div className="mt-2 pt-1.5 border-t border-neutral-700 text-[9px] text-neutral-500">
            Tự động: bắt sâu → thu hoạch → tưới nước → trồng → bón phân
            <br />
            Mỗi hành động: 0.2s
          </div>
        </div>
      )}
    </div>
  );
}
