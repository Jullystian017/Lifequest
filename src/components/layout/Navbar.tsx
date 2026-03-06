"use client";

import { Bell, Search, Flame } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative group flex-1 max-w-xl">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search quests, habits..."
          className="w-full bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-2xl pl-12 pr-4 py-3 text-sm text-[var(--text-primary)] transition-all focus:outline-none focus:border-[var(--primary)]/50 focus:ring-4 focus:ring-[var(--primary)]/10"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Legendary Streak Pill */}
        <div className="flex items-center gap-2.5 bg-[var(--bg-card)] border border-[var(--border-medium)] px-4 py-2.5 rounded-2xl shadow-lg ring-1 ring-orange-500/10">
          <div className="p-1 bg-orange-500/20 rounded-lg">
            <Flame size={16} className="text-orange-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-semibold text-orange-500 uppercase tracking-widest leading-none">Legendary Streak</span>
            <span className="text-sm font-semibold leading-tight">42 Days</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-2xl text-[var(--text-secondary)] hover:text-white transition-all relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-sidebar)]" />
        </button>

        {/* User Mini Avatar */}
        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[var(--border-medium)] cursor-pointer hover:border-[var(--primary)] transition-colors">
          <img src="https://i.pravatar.cc/150?u=alexmiller" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
}
