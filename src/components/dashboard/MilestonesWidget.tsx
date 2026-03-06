"use client";

import { Award, Code, Dumbbell, Lock } from "lucide-react";

const milestones = [
  { id: 1, name: "First Blood", description: "Completed first 10 quests", icon: Award, color: "#F59E0B", unlocked: true },
  { id: 2, name: "Fullstack King", description: "Learned React & Node", icon: Code, color: "#3B82F6", unlocked: true },
  { id: 3, name: "Iron Will", description: "30 days gym streak", icon: Dumbbell, color: "#22C55E", unlocked: true },
  { id: 4, name: "Next Milestone", description: "", icon: Lock, color: "#4B5563", unlocked: false },
];

export default function MilestonesWidget() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-yellow-500" />
          <h3 className="text-lg font-black font-[family-name:var(--font-heading)]">
            Recent Milestones
          </h3>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--primary-light)] transition-colors">
          History
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {milestones.map((ms) => (
          <div 
            key={ms.id} 
            className={`
              p-4 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all group
              ${ms.unlocked 
                ? "bg-[var(--bg-sidebar)] border-[var(--border-light)] hover:border-[var(--primary)]/30 cursor-pointer" 
                : "bg-[var(--bg-sidebar)]/50 border-dashed border-[var(--border-light)] opacity-50"
              }
            `}
          >
            <div 
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}
              style={{ backgroundColor: `${ms.color}15`, color: ms.color }}
            >
              <ms.icon size={20} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold leading-tight truncate px-1">{ms.name}</span>
              {ms.description && (
                <span className="text-[8px] text-[var(--text-muted)] leading-tight">{ms.description}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
