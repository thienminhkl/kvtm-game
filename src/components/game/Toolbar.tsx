"use client";

import { useGameStore, TOOLS, PLANT_IDS, POT_IDS } from "@/lib/game";
import type { ToolId } from "@/lib/game";
import ToolMenu from "./ToolMenu";

const TOOL_ITEMS: { id: ToolId; icon: string }[] = [
  { id: "tool_plant", icon: "🌱" },
  { id: "tool_water", icon: "💧" },
  { id: "tool_pest", icon: "🪲" },
  { id: "tool_fertilize", icon: "🧪" },
  { id: "tool_harvest", icon: "🌾" },
  { id: "tool_pick_pot", icon: "📦" },
  { id: "tool_place_pot", icon: "🪴" },
];

const TOOLS_WITH_MENU: ToolId[] = ["tool_plant", "tool_place_pot", "tool_fertilize"];

export default function Toolbar() {
  const activeTool = useGameStore((s) => s.activeTool);
  const setActiveTool = useGameStore((s) => s.setActiveTool);
  const inventory = useGameStore((s) => s.inventory);

  const showMenu = activeTool && TOOLS_WITH_MENU.includes(activeTool);

  const handleToolClick = (id: ToolId) => {
    setActiveTool(activeTool === id ? null : id);
  };

  const totalSeeds = PLANT_IDS.reduce((s, id) => s + (inventory.seeds[id] ?? 0), 0);
  const totalPots = POT_IDS.reduce((s, id) => s + (inventory.pots[id] ?? 0), 0);
  const totalPests = Object.values(inventory.pests).reduce((s, v) => s + v, 0);

  return (
    <div className="relative flex items-center gap-1.5 bg-neutral-800/90 rounded-lg px-2 py-1.5 border border-neutral-700">
      {/* Tool buttons - horizontal */}
      {TOOL_ITEMS.map(({ id, icon }) => {
        const tool = TOOLS[id];
        const isActive = activeTool === id;
        return (
          <button
            key={id}
            onClick={() => handleToolClick(id)}
            title={tool?.description}
            className={`
              w-9 h-9 rounded-md flex items-center justify-center text-base
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

      {/* Divider */}
      <div className="w-px h-7 bg-neutral-600 mx-1" />

      {/* Inventory summary */}
      <div className="flex items-center gap-2 text-[10px] text-neutral-300">
        <span title="Hạt giống">🌱{totalSeeds}</span>
        <span title="Chậu">🪴{totalPots}</span>
        <span title="Sâu bọ">🐛{totalPests}</span>
        <span title="Nước">💧{inventory.tools.waterCan}</span>
        <span title="Vợt">🪲{inventory.tools.insectNet}</span>
      </div>

      {/* Clear tool */}
      {activeTool && (
        <>
          <div className="w-px h-7 bg-neutral-600 mx-1" />
          <button
            onClick={() => setActiveTool(null)}
            className="px-2 h-7 rounded-md bg-red-900/60 hover:bg-red-800 text-[10px] text-red-300"
          >
            Bỏ
          </button>
        </>
      )}

      {/* ToolMenu overlay - absolute positioned above toolbar, does NOT push layout */}
      {showMenu && (
        <div className="absolute bottom-full left-0 mb-1 z-50">
          <ToolMenu />
        </div>
      )}
    </div>
  );
}
