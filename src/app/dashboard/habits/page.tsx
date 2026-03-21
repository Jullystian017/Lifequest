"use client";

import { useHabitStore } from "@/store/habitStore";
import { useGoalStore } from "@/store/goalStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import {
    Plus,
    Sparkles,
    Target,
    Zap,
    TrendingUp,
    ShieldCheck,
    Award,
    Trophy,
    ChevronRight,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Button from "@/components/ui/Button";
import GoalCard from "@/components/habit/GoalCard";
import HabitCard from "@/components/habit/HabitCard";
import AttributeRadarChart from "@/components/dashboard/AttributeRadarChart";

export default function HabitsPage() {
    const { habits, toggleHabit } = useHabitStore();
    const { goals } = useGoalStore();
    const { stats, level, xp, xpToNextLevel, addXp, addCoins, updateStat } = useUserStatsStore();
    const [searchQuery, setSearchQuery] = useState("");

    const handleToggleHabit = (id: string) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;

        toggleHabit(id);

        // If becoming completed, reward user
        if (!habit.completed_today) {
            addXp(habit.xp_per_completion);
            updateStat(habit.stat_reward, 1);
            addCoins(10);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10 pb-20 animate-fade-in w-full">
            {/* Left Column: Goals & Habits (Main Content) */}
            <div className="flex-1 space-y-12">

                {/* 1. Life Goals Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                <Award size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white font-[family-name:var(--font-heading)]">Life Goals</h2>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Epic Objectives</p>
                            </div>
                        </div>
                        <Button className="rounded-xl flex items-center gap-2 bg-[#1b1c28] border border-white/5 hover:bg-white/5 transition-all">
                            <Plus size={18} /> New Goal
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {goals.map(goal => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                </section>

                {/* 2. Daily Habits Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white font-[family-name:var(--font-heading)]">Daily Habits</h2>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Momentum Builder</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input
                                    type="text"
                                    placeholder="Filter habits..."
                                    className="bg-[#151921] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[var(--primary)]/30 transition-all w-48"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button className="rounded-xl flex items-center gap-2">
                                <Plus size={18} /> New Habit
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {habits
                                .filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(habit => (
                                    <HabitCard
                                        key={habit.id}
                                        habit={habit}
                                        onToggle={handleToggleHabit}
                                    />
                                ))}
                        </AnimatePresence>
                    </div>
                </section>
            </div>

            {/* Right Column: Character Stats Sidebar */}
            <aside className="lg:w-[380px] space-y-8">

                {/* Radar Chart Card */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-[2px] ml-2">Growth Analysis</h3>
                    <AttributeRadarChart />
                </div>

                {/* Detailed Stats List */}
                <div className="bg-[#151921] rounded-3xl p-6 border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-[2px]">Attribute Mastery</h4>
                        <TrendingUp size={14} className="text-emerald-400" />
                    </div>

                    <div className="space-y-5">
                        {[
                            { label: "Vitality", value: stats.health, color: "var(--health)", icon: ShieldCheck },
                            { label: "Intelligence", value: stats.knowledge, color: "var(--knowledge)", icon: Target },
                            { label: "Discipline", value: stats.discipline, color: "var(--discipline)", icon: Zap },
                            { label: "Finance", value: stats.finance, color: "var(--finance)", icon: Award },
                            { label: "Creativity", value: stats.creativity, color: "var(--creativity)", icon: Sparkles }
                        ].map((stat) => (
                            <div key={stat.label} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <div className="flex items-center gap-2">
                                        <stat.icon size={12} style={{ color: stat.color }} />
                                        <span className="text-[11px] font-semibold text-white">{stat.label}</span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-white italic">LVL {Math.floor(stat.value / 10)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.value % 100}%` }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: stat.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-3 text-[10px] font-semibold text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all uppercase tracking-widest">
                        View Detailed Stats
                    </button>
                </div>

                {/* Next Milestone Card */}
                <div className="relative group overflow-hidden bg-[#151921] rounded-3xl p-6 border border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        <Trophy size={80} className="text-white" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Trophy size={20} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-tight">Next Milestone</h4>
                            <p className="text-xs text-slate-400 font-medium">Intelligence Level 6</p>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                className="h-full bg-[var(--primary)] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                            />
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-semibold text-white uppercase tracking-widest group/btn">
                            Track Progress <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
