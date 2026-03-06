"use client";

import { motion } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  color?: string;
}

export default function XPBar({
  currentXP,
  maxXP,
  level,
  color = "var(--primary)",
}: XPBarProps) {
  const percentage = (currentXP / maxXP) * 100;
  const remainingXP = maxXP - currentXP;

  return (
    <div className="relative p-6 bg-[var(--dark-secondary)] border border-[var(--dark-border)] rounded-2xl overflow-hidden shadow-xl group">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
        {/* Level Counter */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">
            Stage
          </span>
          <div
            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-semibold text-2xl shadow-lg ring-4 ring-offset-4 ring-offset-[var(--dark-secondary)] transition-transform group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}CC)`,
              color: 'white',
              ringColor: `${color}30`,
              boxShadow: `0 10px 20px -5px ${color}50`,
            }}
          >
            {level}
          </div>
        </div>

        {/* Bar & Information */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2">
                Experience Progress
                <ArrowUpCircle size={14} className="text-[var(--primary)] animate-pulse" />
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                {remainingXP.toLocaleString()} XP to next level tier.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-semibold text-[var(--text-primary)]">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>

          {/* Progress Track */}
          <div className="h-4 bg-[var(--dark-surface)] rounded-full border border-[var(--dark-border)] p-1 overflow-hidden">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: `linear-gradient(90deg, ${color}, ${color}EE)`,
                boxShadow: `0 0 12px ${color}60`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
        </div>

        {/* Milestone Indicator */}
        <div className="hidden lg:flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
           <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Target</span>
           <div className="w-12 h-12 rounded-xl bg-[var(--dark-surface)] border-2 border-dashed border-[var(--dark-border)] flex items-center justify-center font-semibold text-sm text-[var(--text-muted)]">
             {level + 1}
           </div>
        </div>
      </div>
    </div>
  );
}
