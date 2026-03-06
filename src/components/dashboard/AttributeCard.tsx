"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AttributeCardProps {
  label: string;
  value: number;
  max?: number;
  icon: ReactNode;
  color: string;
  shortLabel: string;
}

export default function AttributeCard({
  label,
  value,
  max = 100,
  icon,
  color,
  shortLabel,
}: AttributeCardProps) {
  const percentage = (value / max) * 100;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-2xl p-4 flex flex-col gap-3 group hover:border-[var(--primary)]/30 transition-all cursor-default">
      {/* Content Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold uppercase tracking-[1px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
              {shortLabel}
            </span>
            <span className="text-xs font-semibold leading-none">{label}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold italic">{value}%</span>
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div className="h-1 w-full bg-[var(--bg-sidebar)] rounded-full overflow-hidden border border-[var(--border-light)]">
        <motion.div
            className="h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)]"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "circOut" }}
          />
      </div>
    </div>
  );
}
