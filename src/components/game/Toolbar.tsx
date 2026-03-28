"use client";

import { useGameStore, TOOLS } from "@/lib/game";
import type { ToolId } from "@/lib/game";

const TOOL_ITEMS: { id: ToolId; icon: string }[] = [
  { id: "tool_plant", icon: "🌱" },
  { id: "tool_water", icon: "💧" },
  { id: "tool_pest", icon: "🪲" },
  { id: "tool_fertilize", icon: "🧪" },
  { id: "tool_harvest", icon: "🌾" },
  { id: "tool_pick_pot", icon: "📦" },
  { id: "tool_place_pot", icon: "🪴" },
];

export default function Toolbar() {
  const activeTool = useGameStore((s) => s.activeTool);
  const setActiveTool = useGameStore((s) => s.setActiveTool);

  return (
    <div className="flex flex-col gap-1 bg-neutral-800/80 rounded-lg p-1.5 border border-neutral-700">
      <span className="text-[10px] text-neutral-400 text-center font-medium mb-0.5">
        Công Cụ
      </span>
      {TOOL_ITEMS.map(({ id, icon }) => {
        const tool = TOOLS[id];
        const isActive = activeTool === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTool(isActive ? null : id)}
            title={tool?.description}
            className={`
              w-10 h-10 rounded-md flex items-center justify-center text-lg
              transition-all duration-150
              ${isActive
                ? "bg-blue-600 ring-2 ring-blue-400 scale-110"
                : "bg-neutral-700 hover:bg-neutral-600"
              }
            `}
          >
            {icon}
          </button>
        );
      })}

      {/* Clear tool selection */}
      {activeTool && (
        <button
          onClick={() => setActiveTool(null)}
          className="w-10 h-6 rounded-md bg-red-900/60 hover:bg-red-800 text-[10px] text-red-300 mt-1"
        >
          Bỏ
        </button>
      )}
    </div>
  );
}
