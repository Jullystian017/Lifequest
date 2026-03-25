"use client";

import { motion } from "framer-motion";
import { Heart, BookOpen, Dumbbell, Palette, PiggyBank, LucideIcon } from "lucide-react";

interface StatProp {
  label: string;
  short: string;
  value: number;
  icon: LucideIcon;
  color: string;
  subtext: string;
}

interface SummaryStatCardsProps {
  stats: {
    health: number;
    knowledge: number;
    discipline: number;
    creativity: number;
  };
}

export default function SummaryStatCards({ stats }: SummaryStatCardsProps) {
  const getSubtext = (stat: string, value: number) => {
    if (stat === "health") {
      if (value < 30) return "Rest strongly recommended";
      if (value < 70) return "Good physical condition";
      return "Peak vitality reached";
    }
    if (stat === "knowledge") {
      return `Next level in ${Math.max(0, 100 - value) * 10} XP`;
    }
    if (stat === "discipline") {
      if (value > 80) return "High Focus State";
      return "Consistency is key";
    }
    if (stat === "finance") {
      return `Gold efficiency: ${Math.round(value / 2)}%`;
    }
    if (stat === "creativity") {
      return "Inspiration phase active";
    }
    return "Status stable";
  };

  const statItems: StatProp[] = [
    { label: "Vitality", short: "HP", value: stats.health, icon: Heart, color: "#ef4444", subtext: getSubtext("health", stats.health) },
    { label: "Intelligence", short: "INT", value: stats.knowledge, icon: BookOpen, color: "#3b82f6", subtext: getSubtext("knowledge", stats.knowledge) },
    { label: "Discipline", short: "DIS", value: stats.discipline, icon: Dumbbell, color: "#22c55e", subtext: getSubtext("discipline", stats.discipline) },
    { label: "Creativity", short: "CRT", value: stats.creativity, icon: Palette, color: "#a855f7", subtext: getSubtext("creativity", stats.creativity) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, idx) => (
        <motion.div
          key={stat.short}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="p-5 rounded-[24px] bg-[#11121d] border border-white/5 flex flex-col justify-between min-h-[160px] group hover:border-white/10 transition-all hover:bg-[#151625]"
        >
          {/* Top Row: Icon & Large Value */}
          <div className="flex justify-between items-start mb-4">
            <div className="p-1">
              <stat.icon size={20} style={{ color: stat.color }} className="opacity-80" />
            </div>
            <span className="text-4xl font-bold text-white leading-none tracking-tight">
              {stat.value}
            </span>
          </div>

          {/* Middle Row: Label */}
          <div className="mb-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              {stat.label} ({stat.short})
            </p>
          </div>

          {/* Bottom Row: Progress Bar & Subtext */}
          <div className="space-y-3">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, stat.value)}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] font-medium text-slate-500/80">
              {stat.subtext}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
