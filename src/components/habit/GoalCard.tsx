"use client";

import { Goal } from "@/types/goal";
import { useGoalStore } from "@/store/goalStore";
import { CheckCircle2, Circle, Target, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GoalCardProps {
    goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
    const { toggleMilestone } = useGoalStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const completedMilestones = goal.milestones.filter(m => m.is_completed).length;
    const totalMilestones = goal.milestones.length;

    return (
        <motion.div
            layout
            className="bg-[#151921] rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10 shadow-lg"
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                            {goal.category}
                        </span>
                        <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">{goal.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-md">{goal.description}</p>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-colors"
                    >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>

                {/* Progress HUD */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                            <Target size={14} className="text-[var(--primary)]" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                Overall Progress
                            </span>
                        </div>
                        <span className="text-sm font-black text-white italic">{goal.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-indigo-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-white/[0.01]"
                    >
                        <div className="p-6 pt-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Requirements ({completedMilestones}/{totalMilestones})</h4>
                                <span className="text-[9px] font-bold text-emerald-400">+{goal.xp_reward} XP REWARD</span>
                            </div>

                            <div className="space-y-2">
                                {goal.milestones.map((milestone) => (
                                    <div
                                        key={milestone.id}
                                        onClick={() => toggleMilestone(goal.id, milestone.id)}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                                    >
                                        <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${milestone.is_completed
                                                ? "bg-emerald-500 border-emerald-500 scale-110"
                                                : "border-slate-700 group-hover:border-[var(--primary)]"
                                            }`}>
                                            {milestone.is_completed && <CheckCircle2 size={10} className="text-white" />}
                                        </div>
                                        <span className={`text-xs font-bold transition-colors ${milestone.is_completed ? "text-slate-500 line-through" : "text-slate-200"
                                            }`}>
                                            {milestone.title}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Reward Summary */}
                            <div className="flex items-center gap-4 pt-2">
                                {Object.entries(goal.stat_rewards).map(([stat, amount]) => (
                                    <div key={stat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">+{amount} {stat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
