"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/game";
import type { ToolId } from "@/lib/game";

const KEY_TOOL_MAP: Record<string, ToolId> = {
  "1": "tool_place_pot",
  "2": "tool_plant",
  "3": "tool_water",
  "4": "tool_pest",
  "5": "tool_fertilize",
  "6": "tool_harvest",
  "7": "tool_pick_pot",
};

export function useKeyboardShortcuts() {
  const setActiveTool = useGameStore((s) => s.setActiveTool);
  const activeTool = useGameStore((s) => s.activeTool);
  const setCurrentView = useGameStore((s) => s.setCurrentView);
  const currentView = useGameStore((s) => s.currentView);
  const setActiveCloudIndex = useGameStore((s) => s.setActiveCloudIndex);
  const activeCloudIndex = useGameStore((s) => s.activeCloudIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't handle if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();

      // Tool shortcuts (1-7)
      if (KEY_TOOL_MAP[e.key]) {
        e.preventDefault();
        const toolId = KEY_TOOL_MAP[e.key];
        setActiveTool(activeTool === toolId ? null : toolId);
        return;
      }

      // Escape - clear tool
      if (key === "escape") {
        setActiveTool(null);
        return;
      }

      // Q - toggle cloud/ground view
      if (key === "q") {
        e.preventDefault();
        setCurrentView(currentView === "cloud" ? "ground" : "cloud");
        return;
      }

      // Arrow up/down - navigate cloud layers
      if (key === "arrowup" || key === "w") {
        e.preventDefault();
        if (activeCloudIndex < 7) setActiveCloudIndex(activeCloudIndex + 1);
        return;
      }
      if (key === "arrowdown" || key === "s") {
        e.preventDefault();
        if (activeCloudIndex > 0) setActiveCloudIndex(activeCloudIndex - 1);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeTool, currentView, activeCloudIndex, setActiveTool, setCurrentView, setActiveCloudIndex]);
}
