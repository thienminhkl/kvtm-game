"use client";

import { useState } from "react";
import { useGameStore, useGameEngine, useKeyboardShortcuts } from "@/lib/game";
import UserBar from "./UserBar";
import Toolbar from "./Toolbar";
import CloudGrid from "./CloudGrid";
import Beanstalk from "./Beanstalk";
import SettingsPanel from "./SettingsPanel";
import ToastContainer from "./ToastContainer";
import AchievementPanel from "./AchievementPanel";
import Tutorial from "./Tutorial";

function JackHouse() {
  return (
    <div className="w-full max-w-[580px] relative">
      {/* Ground layer */}
      <div className="ground-grass rounded-t-2xl pt-3 pb-4 px-4 relative overflow-hidden">
        {/* Decorative grass tufts */}
        <div className="absolute top-1 left-[5%] text-sm opacity-40">🌿</div>
        <div className="absolute top-0 left-[20%] text-xs opacity-30">🌱</div>
        <div className="absolute top-1 right-[8%] text-sm opacity-40">🌿</div>

        {/* Cobblestone path */}
        <div className="ground-path absolute bottom-2 left-[15%] right-[15%] h-3 opacity-50" />

        {/* Fence */}
        <div className="absolute top-0 left-[35%] right-[35%] flex justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="fence-post w-1 h-5" />
          ))}
        </div>
        <div className="absolute top-1.5 left-[35%] right-[35%] h-0.5 fence-rail" />

        {/* Scene */}
        <div className="flex items-end justify-between relative z-10 mt-2">
          {/* Jack */}
          <div className="flex flex-col items-center">
            <span className="text-xl">👨‍🌾</span>
          </div>

          {/* House - proper structure */}
          <div className="flex flex-col items-center relative">
            {/* Chimney */}
            <div className="absolute -top-3 right-2 w-2 h-4 bg-stone-600 rounded-t-sm" />
            {/* Roof */}
            <div className="house-roof w-28 h-10" />
            {/* Wall */}
            <div className="house-wall w-28 h-14 relative">
              {/* Windows */}
              <div className="house-window absolute top-2 left-2 w-4 h-4" />
              <div className="house-window absolute top-2 right-2 w-4 h-4" />
              {/* Door */}
              <div className="house-door absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-7 rounded-t-md">
                <div className="absolute top-3 right-1 w-1 h-1 bg-yellow-600 rounded-full" />
              </div>
            </div>
          </div>

          {/* Water wheel */}
          <div className="flex flex-col items-center">
            <div className="animate-water-wheel text-3xl" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>⚙️</div>
            <div className="w-10 h-1.5 bg-blue-300/40 rounded-full mt-0.5" />
          </div>

          {/* Machines */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>🧃</span>
            <span className="text-sm" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>🧁</span>
          </div>
        </div>

        {/* Lake */}
        <div className="ground-lake absolute bottom-0 right-0 w-20 h-6 opacity-60" />

        {/* Trees */}
        <div className="absolute bottom-2 left-[2%] text-xl opacity-50">🌳</div>
        <div className="absolute bottom-2 right-[2%] text-lg opacity-40">🌲</div>
      </div>
    </div>
  );
}

export default function GameBoard() {
  useGameEngine();
  useKeyboardShortcuts();
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 19;
  const isSunset = hour >= 17 && hour < 19;

  return (
    <div className={`relative min-h-screen flex flex-col overflow-hidden ${
      isNight ? "bg-gradient-to-b from-indigo-900 via-slate-800 to-slate-900"
        : isSunset ? "bg-gradient-to-b from-orange-300 via-sky-500 to-indigo-700"
        : "sky-gradient"
    }`}>
      {/* Sky cloud layer (parallax) */}
      <div className="absolute inset-0 sky-cloud-layer pointer-events-none" />

      {/* Drifting clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[8%] w-28 h-10 bg-white/15 rounded-full blur-lg animate-cloud-drift" />
        <div className="absolute top-[18%] w-20 h-7 bg-white/10 rounded-full blur-lg animate-cloud-drift" style={{ animationDelay: "15s" }} />
        <div className="absolute top-[12%] w-32 h-12 bg-white/12 rounded-full blur-lg animate-cloud-drift" style={{ animationDelay: "30s" }} />
      </div>

      {/* Day/Night overlay */}
      {isNight && <div className="absolute inset-0 filter-night" />}
      {isSunset && <div className="absolute inset-0 filter-sunset" />}

      {/* Night fireflies */}
      {isNight && (
        <>
          <div className="absolute top-[30%] left-[20%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-firefly" />
          <div className="absolute top-[50%] left-[70%] w-1 h-1 bg-yellow-200 rounded-full animate-firefly" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[35%] left-[85%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-firefly" style={{ animationDelay: "2s" }} />
        </>
      )}

      {/* Toast + Tutorial */}
      <ToastContainer />
      <Tutorial />

      {/* Top bar */}
      <div className="p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2 z-10 relative">
        <UserBar />
        <button onClick={() => setShowAchievements(!showAchievements)} className="flex-shrink-0 w-7 h-7 rounded-lg bg-neutral-800/80 border border-neutral-700 text-sm flex items-center justify-center hover:bg-neutral-700">🏆</button>
        <button onClick={() => setShowSettings(!showSettings)} className="flex-shrink-0 w-7 h-7 rounded-lg bg-neutral-800/80 border border-neutral-700 text-sm flex items-center justify-center hover:bg-neutral-700">⚙️</button>
      </div>

      {/* Panels */}
      {showSettings && <div className="absolute top-14 right-2 z-50"><SettingsPanel onClose={() => setShowSettings(false)} /></div>}
      {showAchievements && <div className="absolute top-14 right-10 z-50"><AchievementPanel onClose={() => setShowAchievements(false)} /></div>}

      {/* Main world area */}
      <div className="flex-1 flex items-end justify-center gap-2 px-2 pb-1 relative z-10">
        {/* Beanstalk */}
        <div className="flex-shrink-0 h-[260px]">
          <Beanstalk />
        </div>

        {/* Cloud + Ground */}
        <div className="flex flex-col items-center">
          <CloudGrid />
          <JackHouse />
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky bottom-0 p-1.5 flex justify-center z-10 relative">
        <Toolbar />
      </div>
    </div>
  );
}
