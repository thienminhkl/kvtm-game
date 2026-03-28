"use client";

import { useGameStore, useGameEngine } from "@/lib/game";
import UserBar from "./UserBar";
import Toolbar from "./Toolbar";
import CloudGrid from "./CloudGrid";
import CloudNavigator from "./CloudNavigator";
import GroundView from "./GroundView";

export default function GameBoard() {
  useGameEngine();
  const currentView = useGameStore((s) => s.currentView);
  const setCurrentView = useGameStore((s) => s.setCurrentView);

  const isCloud = currentView === "cloud";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isCloud
          ? "bg-gradient-to-b from-sky-900 via-sky-800 to-indigo-900"
          : "bg-gradient-to-b from-amber-900 via-amber-800 to-stone-900"
      }`}
    >
      {/* Top: User stats + view toggle */}
      <div className="p-2 flex items-start gap-2">
        <UserBar />
        <button
          onClick={() => setCurrentView(isCloud ? "ground" : "cloud")}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-[11px] text-neutral-300 hover:bg-neutral-700 transition-all"
        >
          {isCloud ? "🏠 Nhà" : "☁️ Mây"}
        </button>
      </div>

      {/* Center: Cloud or Ground view */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-3 pb-2 overflow-hidden">
        {isCloud ? (
          <>
            <CloudNavigator />
            <CloudGrid />
          </>
        ) : (
          <GroundView />
        )}
      </div>

      {/* Bottom: Toolbar (only show in cloud view) */}
      {isCloud && (
        <div className="sticky bottom-0 p-2 flex justify-center">
          <Toolbar />
        </div>
      )}
    </div>
  );
}
