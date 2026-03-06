"use client";

import { motion } from "framer-motion";

interface DashboardHeaderProps {
  username: string;
  questCount: number;
  currentXp: number;
  maxXp: number;
}

export default function DashboardHeader({
  username,
  questCount,
  currentXp,
  maxXp,
}: DashboardHeaderProps) {
  const xpPercentage = (currentXp / maxXp) * 100;

  return (
    <div className="flex flex-col md:flex-row items-end justify-between gap-6 py-6">
      {/* Greeting Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold font-[family-name:var(--font-heading)] leading-tight flex items-center gap-3">
          Good Morning, {username} <span className="animate-float">👋</span>
        </h1>
        <p className="text-[var(--text-secondary)] font-medium">
          You have <span className="text-[var(--primary-light)] font-semibold">{questCount} quests</span> scheduled for today. Ready to level up?
        </p>
      </div>

      {/* Experience Widget (Right) */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-2xl p-5 min-w-[280px] shadow-xl group hover:border-[var(--primary)]/30 transition-all">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[var(--primary-light)]">Experience</span>
          <span className="text-xs font-semibold font-mono">
            {currentXp.toLocaleString()} / {maxXp.toLocaleString()}
          </span>
        </div>
        <div className="h-2.5 w-full bg-[var(--bg-sidebar)] rounded-full overflow-hidden border border-[var(--border-light)] relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-light)] shadow-lg shadow-[var(--primary)]/20"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
          />
        </div>
      </div>
    </div>
  );
}
