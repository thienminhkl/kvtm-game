"use client";

import { useGameEngine } from "@/lib/game";
import UserBar from "./UserBar";
import Toolbar from "./Toolbar";
import CloudGrid from "./CloudGrid";
import CloudNavigator from "./CloudNavigator";
import MonkeyToggle from "./MonkeyToggle";

export default function GameBoard() {
  useGameEngine();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 via-sky-800 to-indigo-900 flex flex-col">
      {/* Top: User stats */}
      <div className="p-2">
        <UserBar />
      </div>

      {/* Center: Cloud grid */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-3 pb-2 overflow-hidden">
        <CloudNavigator />
        <CloudGrid />
        <MonkeyToggle />
      </div>

      {/* Bottom: Toolbar with integrated inventory */}
      <div className="sticky bottom-0 p-2 flex justify-center">
        <Toolbar />
      </div>
    </div>
  );
}
