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
  subtitle?: string; // e.g. "Rest recommended in 4h"
}

export default function AttributeCard({
  label,
  value,
  max = 100,
  icon,
  color,
  shortLabel,
  subtitle,
}: AttributeCardProps) {
  return (
    <div className="bg-[#1b1c28] p-5 rounded-2xl border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 shadow-lg">
      
      {/* Top Row: Icon (Left) & Value (Right) */}
      <div className="flex justify-between items-start mb-5">
        <div style={{ color }} className="opacity-90">
           {icon}
        </div>
        <div className="text-3xl font-bold text-white font-[family-name:var(--font-heading)] leading-none">
           {value}
        </div>
      </div>

      {/* Middle: Label */}
      <div className="mb-2.5">
         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label} ({shortLabel})
         </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-[#2a2b3d] rounded-full overflow-hidden mb-3">
        <motion.div 
           className="h-full rounded-full" 
           style={{ backgroundColor: color }}
           initial={{ width: 0 }}
           animate={{ width: `${(value / max) * 100}%` }}
           transition={{ duration: 1, ease: "circOut" }}
        ></motion.div>
      </div>

      {/* Bottom: Subtitle */}
      {subtitle && (
        <div className="text-[10px] font-medium text-slate-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}
