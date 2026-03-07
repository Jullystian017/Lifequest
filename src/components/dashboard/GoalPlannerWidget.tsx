"use client";

import { Target, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useGoalStore } from "@/store/goalStore";
import { useEffect } from "react";
import { Goal } from "@/types/goal";

const INITIAL_GOALS: Goal[] = [
    {
        id: "g1",
        title: "Master Full-Stack Dev",
        description: "Complete 5 major projects and learn 3 new frameworks.",
        category: "career",
        status: "in_progress",
        priority: "high",
        progress: 45,
        milestones: [],
        stat_rewards: { knowledge: 10, discipline: 5 },
        xp_reward: 1000,
        created_at: new Date().toISOString(),
    },
    {
        id: "g2",
        title: "Reach 15% Body Fat",
        description: "Consistent gym and clean diet.",
        category: "fitness",
        status: "in_progress",
        priority: "medium",
        progress: 30,
        milestones: [],
        stat_rewards: { health: 15 },
        xp_reward: 800,
        created_at: new Date().toISOString(),
    }
];

export default function GoalPlannerWidget() {
    const { goals, setGoals } = useGoalStore();

    useEffect(() => {
        if (goals.length === 0) setGoals(INITIAL_GOALS);
    }, [goals.length, setGoals]);

    return (
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all">
            <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-emerald-400">
                        <Target size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">
                            Primary Objectives
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Focus on your long-term legacy</p>
                    </div>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-colors">
                    View All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                    <motion.div
                        key={goal.id}
                        whileHover={{ y: -4 }}
                        className="p-5 rounded-2xl bg-[var(--bg-sidebar)] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group/goal"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider bg-emerald-500/10 px-2 py-1 rounded-md">
                                {goal.category}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                <span>{goal.progress}% met</span>
                            </div>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-2 group-hover/goal:text-emerald-400 transition-colors">
                            {goal.title}
                        </h4>

                        <div className="h-1.5 w-full bg-[var(--bg-main)] rounded-full overflow-hidden mb-4 border border-white/5">
                            <motion.div
                                className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {/* Visual reward indicators */}
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400" title="XP Reward">
                                    XP
                                </div>
                                <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-[10px] font-bold text-yellow-500" title="Stat Boost">
                                    ST
                                </div>
                            </div>
                            <ChevronRight size={14} className="text-slate-600 group-hover/goal:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
