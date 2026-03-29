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
    <div className="w-full max-w-[620px] relative">
      {/* Ground layer */}
      <div className="ground-grass rounded-t-xl pt-2 pb-3 px-4 relative overflow-hidden">
        {/* Cobblestone path */}
        <div className="absolute bottom-0 left-[20%] right-[20%] h-4 cobblestone rounded-t-lg opacity-40" />

        {/* Scene content */}
        <div className="flex items-end justify-between relative z-10">
          {/* Jack */}
          <div className="flex flex-col items-center">
            <span className="text-2xl">👨‍🌾</span>
            <span className="text-[7px] text-green-200/50">Jack</span>
          </div>

          {/* House */}
          <div className="flex flex-col items-center relative">
            {/* Roof */}
            <div className="house-roof w-20 h-6" />
            {/* Body */}
            <div className="house-body w-20 h-10 rounded-b-md relative">
              {/* Window with glow */}
              <div className="house-window absolute top-2 left-2 w-3 h-3 rounded-sm" />
              <div className="house-window absolute top-2 right-2 w-3 h-3 rounded-sm" />
              {/* Door */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-5 bg-amber-950 rounded-t-full" />
            </div>
          </div>

          {/* Water wheel */}
          <div className="flex flex-col items-center">
            <div className="animate-water-wheel text-2xl" style={{ transformOrigin: "center" }}>
              ⚙️
            </div>
            <div className="w-8 h-1 bg-blue-400/30 rounded-full mt-0.5" />
          </div>

          {/* Machines */}
          <div className="flex items-center gap-1.5">
            <span className="text-base opacity-60" title="Máy Ép">🧃</span>
            <span className="text-base opacity-60" title="Máy Nướng">🧁</span>
            <span className="text-base opacity-60" title="Máy Sấy">🌬️</span>
          </div>
        </div>

        {/* Lake in background */}
        <div className="absolute bottom-0 right-0 w-24 h-8 bg-gradient-to-t from-blue-400/20 to-transparent rounded-tl-full" />
      </div>
    </div>
  );
}

export default function GameBoard() {
  useGameEngine();
  useKeyboardShortcuts();
  const isSandbox = useGameStore((s) => s.isSandbox);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Simple day/night based on hour
  const [timePhase] = useState<"day" | "sunset" | "night">(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 17) return "day";
    if (hour >= 17 && hour < 19) return "sunset";
    return "night";
  });

  return (
    <div className={`relative min-h-screen flex flex-col ${
      timePhase === "night"
        ? "bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950"
        : timePhase === "sunset"
          ? "bg-gradient-to-b from-orange-400 via-sky-600 to-indigo-800"
          : "bg-gradient-to-b from-sky-500 via-sky-600 to-sky-700"
    }`}>
      {/* Parallax background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Far layer - small clouds drifting */}
        <div className="absolute top-[5%] w-20 h-8 bg-white/5 rounded-full blur-md animate-cloud-drift" />
        <div className="absolute top-[15%] w-16 h-6 bg-white/4 rounded-full blur-md animate-cloud-drift" style={{ animationDelay: "20s" }} />
        <div className="absolute top-[8%] w-24 h-10 bg-white/6 rounded-full blur-md animate-cloud-drift" style={{ animationDelay: "40s" }} />

        {/* Mid layer - distant mountains */}
        <div className="absolute bottom-[30%] left-0 right-0 h-20 bg-gradient-to-t from-green-900/20 to-transparent" />

        {/* Near layer - cloud puffs */}
        <div className="bg-parallax-cloud absolute inset-0" />

        {/* Night overlay */}
        {timePhase === "night" && (
          <div className="absolute inset-0 filter-night" />
        )}
        {timePhase === "sunset" && (
          <div className="absolute inset-0 filter-sunset" />
        )}

        {/* Night fireflies */}
        {timePhase === "night" && (
          <>
            <div className="absolute top-[30%] left-[20%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-firefly" />
            <div className="absolute top-[50%] left-[60%] w-1 h-1 bg-yellow-200 rounded-full animate-firefly" style={{ animationDelay: "1s" }} />
            <div className="absolute top-[40%] left-[80%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-firefly" style={{ animationDelay: "2s" }} />
            <div className="absolute top-[60%] left-[30%] w-1 h-1 bg-yellow-200 rounded-full animate-firefly" style={{ animationDelay: "0.5s" }} />
          </>
        )}

        {/* Sun rays (daytime) */}
        {timePhase === "day" && (
          <div className="absolute top-0 right-[10%] w-32 h-48 bg-gradient-to-b from-yellow-200/10 to-transparent animate-sun-ray rotate-12 origin-top" />
        )}
      </div>

      {/* Toast notifications */}
      <ToastContainer />
      <Tutorial />

      {/* Top: User stats + buttons */}
      <div className="p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2 z-10 relative">
        <UserBar />

        {isSandbox && (
          <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-yellow-600/30 text-[8px] sm:text-[9px] text-yellow-300 font-medium">
            🧪
          </span>
        )}

        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className={`flex-shrink-0 w-7 sm:w-8 h-7 sm:h-8 rounded-lg border text-sm flex items-center justify-center transition-all ${
            showAchievements ? "bg-neutral-600 border-neutral-400" : "bg-neutral-800/80 border-neutral-700 hover:bg-neutral-700"
          }`}
        >
          🏆
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex-shrink-0 w-7 sm:w-8 h-7 sm:h-8 rounded-lg border text-sm flex items-center justify-center transition-all ${
            showSettings ? "bg-neutral-600 border-neutral-400" : "bg-neutral-800/80 border-neutral-700 hover:bg-neutral-700"
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

      {/* Main world area */}
      <div className="flex-1 flex items-end justify-center gap-2 sm:gap-3 px-2 sm:px-3 pb-2 relative z-10">
        {/* Left: Beanstalk */}
        <div className="flex-shrink-0 h-[280px]">
          <Beanstalk />
        </div>

        {/* Center: Cloud + Ground */}
        <div className="flex flex-col items-center gap-0">
          <CloudGrid />
          <JackHouse />
        </div>
      </div>

      {/* Bottom: Toolbar */}
      <div className="sticky bottom-0 p-1.5 sm:p-2 flex justify-center z-10 relative">
        <Toolbar />
      </div>
    </div>
  );
}
