"use client";

import { useState } from "react";
import { useGameStore, useGameEngine } from "@/lib/game";
import UserBar from "./UserBar";
import Toolbar from "./Toolbar";
import CloudGrid from "./CloudGrid";
import CloudNavigator from "./CloudNavigator";
import Beanstalk from "./Beanstalk";
import GroundView from "./GroundView";
import SettingsPanel from "./SettingsPanel";
import ToastContainer from "./ToastContainer";
import AchievementPanel from "./AchievementPanel";

export default function GameBoard() {
  useGameEngine();
  const currentView = useGameStore((s) => s.currentView);
  const setCurrentView = useGameStore((s) => s.setCurrentView);
  const isSandbox = useGameStore((s) => s.isSandbox);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const isCloud = currentView === "cloud";

  return (
    <div
      className={`relative min-h-screen flex flex-col transition-colors duration-500 ${
        isCloud
          ? "bg-gradient-to-b from-sky-900 via-sky-800 to-indigo-900"
          : "bg-gradient-to-b from-amber-900 via-amber-800 to-stone-900"
      }`}
    >
      {/* Toast notifications */}
      <ToastContainer />

      {/* Top: User stats + buttons */}
      <div className="p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2">
        <UserBar />

        {isSandbox && (
          <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-yellow-600/30 text-[8px] sm:text-[9px] text-yellow-300 font-medium">
            🧪
          </span>
        )}

        <button
          onClick={() => setCurrentView(isCloud ? "ground" : "cloud")}
          className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-[10px] sm:text-[11px] text-neutral-300 hover:bg-neutral-700 transition-all"
        >
          {isCloud ? "🏠" : "☁️"}<span className="hidden sm:inline"> {isCloud ? "Nhà" : "Mây"}</span>
        </button>

        {/* Achievements */}
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className={`flex-shrink-0 w-7 sm:w-8 h-7 sm:h-8 rounded-lg border text-sm flex items-center justify-center transition-all ${
            showAchievements
              ? "bg-neutral-600 border-neutral-400"
              : "bg-neutral-800/80 border-neutral-700 hover:bg-neutral-700"
          }`}
        >
          🏆
        </button>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex-shrink-0 w-7 sm:w-8 h-7 sm:h-8 rounded-lg border text-sm flex items-center justify-center transition-all ${
            showSettings
              ? "bg-neutral-600 border-neutral-400"
              : "bg-neutral-800/80 border-neutral-700 hover:bg-neutral-700"
          }`}
        >
          ⚙️
        </button>
      </div>

      {/* Panel overlays */}
      {showSettings && (
        <div className="absolute top-14 right-2 z-50">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}
      {showAchievements && (
        <div className="absolute top-14 right-10 sm:right-12 z-50">
          <AchievementPanel onClose={() => setShowAchievements(false)} />
        </div>
      )}

      {/* Center: Game area */}
      <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-2 sm:px-3 pb-2 overflow-x-auto">
        {isCloud ? (
          <>
            <div className="hidden sm:block flex-shrink-0 h-[200px]">
              <Beanstalk />
            </div>
            <CloudGrid />
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
