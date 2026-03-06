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
  // Mock trend for the Stitch-style visual
  const trend = Math.floor(value / 10) + 1; 

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-3xl p-5 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:border-[var(--border-medium)] transition-all duration-300 min-h-[140px]">
      
      {/* Top Row: Label & Icon */}
      <div className="flex items-start justify-between">
         <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[var(--text-muted)]">{label}</span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-secondary)]">
               {shortLabel}
            </span>
         </div>
         <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            <div className="scale-110">{icon}</div>
          </div>
      </div>
      
      {/* Bottom Row: Big Value & Trend */}
      <div className="flex items-baseline gap-3 mt-4">
         <h4 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-white">
            {value}
         </h4>
         <div className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span>↗</span>
            <span>{trend}%</span>
         </div>
      </div>

    </div>
  );
}
