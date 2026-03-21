"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAchievementStore, AchievementCategory } from "@/store/achievementStore";
import { useQuestStore } from "@/store/questStore";
import { useHabitStore } from "@/store/habitStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import {
    Trophy,
    Award,
    ShieldCheck,
    Star,
    Flag,
    Hammer,
    Flame,
    Zap,
    Swords,
    Skull,
    Lock,
    CheckCircle2
} from "lucide-react";

const ICON_MAP: Record<string, any> = { Flag, Hammer, Flame, Zap, Swords, Skull };

const CATEGORY_TABS: { id: AchievementCategory | 'all', label: string }[] = [
    { id: 'all', label: 'Semua' },
    { id: 'quest', label: 'Quest' },
    { id: 'streak', label: 'Streak' },
    { id: 'combat', label: 'Pertarungan' },
    { id: 'social', label: 'Sosial' },
];

export default function AchievementsPage() {
    const { achievements, unlockedIds, unlockAchievement } = useAchievementStore();
    const { quests } = useQuestStore();
    const { habits } = useHabitStore();
    const { level } = useUserStatsStore();
    const [activeTab, setActiveTab] = useState<AchievementCategory | 'all'>('all');

    // Dynamic Progress Calculation
    const getProgress = (type: string, target: number) => {
        let current = 0;
        switch(type) {
            case 'complete_quests':
                current = quests.filter(q => q.is_completed).length;
                break;
            case 'reach_streak':
                current = habits.filter(h => h.completed_today).length; // Simplify for now
                break;
            case 'reach_level':
                current = level;
                break;
            case 'defeat_enemies':
                current = 0; // Connect to shadow store history later
                break;
            default: current = 0;
        }
        
        const isCompleted = current >= target;
        const percentage = Math.min((current / target) * 100, 100);

        return { current, percentage, isCompleted };
    };

    // Filter by tab
    const filteredAchievements = achievements.filter(a => activeTab === 'all' || a.category === activeTab);
    
    // Stats
    const totalUnlocked = unlockedIds.length;
    const totalCount = achievements.length;
    const progressPercent = (totalUnlocked / totalCount) * 100;

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in">
            {/* Overall Progress */}
            <div className="flex justify-end mb-6">
                <div className="w-full md:w-64 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-4 shrink-0">
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-slate-400 uppercase tracking-widest">Total Terkumpul</span>
                        <span className="text-yellow-500">{totalUnlocked} / {totalCount}</span>
                    </div>
                    <div className="h-2.5 bg-black/30 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORY_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" 
                            : "bg-[var(--bg-card)] border border-[var(--border-light)] text-slate-400 hover:text-white"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredAchievements.map((ach) => {
                        const IconComp = ICON_MAP[ach.icon] || Star;
                        const { current, percentage, isCompleted } = getProgress(ach.requirementType, ach.requirementValue);
                        
                        // Fake auto-unlock for demo
                        if (isCompleted && !unlockedIds.includes(ach.id)) {
                            // In a real app this would trigger via a listener, 
                            // doing it directly here for UI demo purposes only
                            setTimeout(() => unlockAchievement(ach.id), 100); 
                        }

                        const isUnlocked = unlockedIds.includes(ach.id);

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={ach.id}
                                className={`relative p-6 rounded-3xl border transition-all overflow-hidden ${
                                    isUnlocked 
                                    ? "bg-[var(--bg-card)] border-yellow-500/30 shadow-[inset_0_0_30px_rgba(234,179,8,0.02)]" 
                                    : "bg-black/20 border-white/5 opacity-70 grayscale-[0.8]"
                                }`}
                            >
                                {/* Badge Icon */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-4 rounded-full border ${
                                        isUnlocked ? ach.color : "bg-black/40 border-white/10 text-slate-600"
                                    }`}>
                                        <IconComp size={28} />
                                    </div>
                                    {isUnlocked && (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/20">
                                            <CheckCircle2 size={14} /> Terbuka
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="space-y-1 mb-6">
                                    <h3 className={`font-bold font-[family-name:var(--font-heading)] text-lg ${isUnlocked ? "text-white" : "text-slate-400"}`}>
                                        {ach.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 min-h-[32px]">
                                        {ach.description}
                                    </p>
                                </div>

                                {/* Progress Footer */}
                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                        <span className={isUnlocked ? "text-emerald-400" : "text-slate-500"}>
                                            {isUnlocked ? "Selesai" : "Progres"}
                                        </span>
                                        <span className={isUnlocked ? "text-emerald-400" : "text-slate-400"}>
                                            {isUnlocked ? ach.requirementValue : current} / {ach.requirementValue}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className={`h-full rounded-full ${isUnlocked ? "bg-emerald-500" : "bg-[var(--primary)]"}`}
                                        />
                                    </div>
                                    
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hadiah:</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                            isUnlocked ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" : "text-slate-600 bg-slate-800 border-white/5"
                                        }`}>
                                            +{ach.xpReward} XP
                                        </span>
                                    </div>
                                </div>
                                
                                {!isUnlocked && (
                                    <div className="absolute top-4 right-4 text-slate-600">
                                        <Lock size={16} />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            
        </div>
    );
}
