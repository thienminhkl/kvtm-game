"use client";

import { useGameEngine } from "@/lib/game";
import UserBar from "./UserBar";
import Toolbar from "./Toolbar";
import CloudGrid from "./CloudGrid";
import CloudNavigator from "./CloudNavigator";
import InventoryPanel from "./InventoryPanel";
import MonkeyToggle from "./MonkeyToggle";

export default function GameBoard() {
  useGameEngine();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 via-sky-800 to-indigo-900 flex flex-col">
      {/* Top bar */}
      <div className="p-3">
        <UserBar />
      </div>

      {/* Main game area */}
      <div className="flex-1 flex items-start justify-center gap-4 px-3 pb-3">
        {/* Left sidebar: Toolbar */}
        <div className="flex-shrink-0">
          <Toolbar />
        </div>

        {/* Center: Cloud grid + navigator */}
        <div className="flex flex-col items-center gap-4">
          <CloudNavigator />
          <CloudGrid />
          <MonkeyToggle />
        </div>

        {/* Right sidebar: Inventory */}
        <div className="flex-shrink-0">
          <InventoryPanel />
        </div>
      </div>
    </div>
  );
}
