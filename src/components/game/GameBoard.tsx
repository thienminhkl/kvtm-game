"use client";

import { useGameStore, useGameEngine } from "@/lib/game";
import UserBar from "./UserBar";
import Toolbar from "./Toolbar";
import CloudGrid from "./CloudGrid";
import CloudNavigator from "./CloudNavigator";
import Beanstalk from "./Beanstalk";
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
      <div className="p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2">
        <UserBar />
        <button
          onClick={() => setCurrentView(isCloud ? "ground" : "cloud")}
          className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-[10px] sm:text-[11px] text-neutral-300 hover:bg-neutral-700 transition-all"
        >
          {isCloud ? "🏠" : "☁️"}<span className="hidden sm:inline"> {isCloud ? "Nhà" : "Mây"}</span>
        </button>
      </div>

      {/* Center: Game area */}
      <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-2 sm:px-3 pb-2 overflow-x-auto">
        {isCloud ? (
          <>
            {/* Left: Beanstalk - hidden on small screens */}
            <div className="hidden sm:block flex-shrink-0 h-[200px]">
              <Beanstalk />
            </div>

            {/* Center: Cloud grid */}
            <CloudGrid />

            {/* Right: Navigation buttons */}
            <div className="flex-shrink-0">
              <CloudNavigator />
            </div>
          </>
        ) : (
          <GroundView />
        )}
      </div>

      {/* Bottom: Toolbar */}
      {isCloud && (
        <div className="sticky bottom-0 p-1.5 sm:p-2 flex justify-center overflow-x-auto">
          <Toolbar />
        </div>
      )}
    </div>
  );
}
