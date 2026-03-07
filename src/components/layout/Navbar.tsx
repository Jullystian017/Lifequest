"use client";

import { Bell, Flame } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Determine dynamic title based on the active route
  const getPageInfo = () => {
    switch (pathname) {
      case "/dashboard":
        return { title: "System Overview", subtitle: "Node Sync: Optimal" };
      case "/quests":
        return { title: "Active Quests", subtitle: "Manage your daily objectives" };
      case "/habits":
        return { title: "Habit Tracker", subtitle: "Build consistency" };
      default:
        return { title: "LifeQuest", subtitle: "Welcome back, Alex" };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="h-24 flex items-center justify-between px-10 bg-[var(--bg-main)] sticky top-0 z-30 w-full">

      {/* Left Side: Page Title */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-white tracking-tight leading-none">
          {title}
        </h1>
        <p className="text-xs font-medium text-slate-500 tracking-wide">
          {subtitle}
        </p>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Legendary Streak Pill */}
        <div className="flex items-center gap-3 bg-[#1e1511] border border-orange-900/30 px-5 py-2.5 rounded-2xl shadow-lg ring-1 ring-orange-500/10 hidden md:flex">
          <div className="bg-orange-500/20 rounded-full p-1.5 flex items-center justify-center">
            <Flame size={16} className="text-orange-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest leading-none mb-0.5">Legendary Streak</span>
            <span className="text-sm font-bold text-white leading-none">42 Days</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="p-3 bg-[#1b1c28] border border-white/[0.05] rounded-2xl text-slate-400 hover:text-white transition-all relative shadow-sm">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#1b1c28]" />
        </button>

        {/* User Mini Avatar */}
        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/[0.05] cursor-pointer hover:border-indigo-500 transition-colors shadow-sm">
          <img src="/lifequest.png" alt="Profile" className="w-[120%] h-[120%] object-cover opacity-80" />
        </div>
      </div>
    </header>
  );
}
