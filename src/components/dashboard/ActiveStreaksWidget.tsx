"use client";

import { Flame, Plus } from "lucide-react";
import { motion } from "framer-motion";

const streaks = [
  { name: "Morning Reading", goal: "15 mins daily", days: 12, color: "#FF7E33", progress: 100 },
  { name: "Deep Work", goal: "4 hours daily", days: 8, color: "#33A1FF", progress: 65 },
  { name: "No Junk Food", goal: "All day", days: 21, color: "#33FF7E", progress: 100 },
];

export default function ActiveStreaksWidget() {
  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all">
      {/* Background Subtle Glow */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-orange-500">
            <Flame size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">
              Active Streaks
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Maintain your daily momentum</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-light)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-orange-500 transition-all">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-6">
        {streaks.map((streak) => (
          <div key={streak.name} className="space-y-2 group cursor-default">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm font-semibold group-hover:text-white transition-colors">{streak.name}</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Goal: {streak.goal}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold italic">{streak.days}</span>
                <span className="text-[10px] font-semibold uppercase tracking-tighter text-[var(--text-muted)]">DAYS</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[var(--bg-sidebar)] rounded-full overflow-hidden border border-[var(--border-light)]">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: streak.color, boxShadow: `0 0 10px ${streak.color}40` }}
                initial={{ width: 0 }}
                animate={{ width: `${streak.progress}%` }}
                transition={{ duration: 1.2, ease: "circOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
