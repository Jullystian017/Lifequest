"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AchievementCategory, DEFAULT_ACHIEVEMENTS, Achievement } from "@/lib/achievements"; // From library constants
import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchQuests, fetchHabits, userQueryKey, questsQueryKey, habitsQueryKey } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
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
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserId(data.user.id);
        });
    }, []);

    const { data: user } = useQuery({
        queryKey: userQueryKey(userId!),
        queryFn: () => fetchUser(userId!),
        enabled: !!userId,
    });

    const { data: quests = [] } = useQuery({
        queryKey: questsQueryKey(userId!),
        queryFn: () => fetchQuests(userId!),
        enabled: !!userId,
    });

    const { data: habits = [] } = useQuery({
        queryKey: habitsQueryKey(userId!),
        queryFn: () => fetchHabits(userId!),
        enabled: !!userId,
    });

    const level = user?.level || 1;
    // In actual implementation we would track `unlockedIds` in DB, but for now we default to empty array
    const unlockedIds: string[] = user?.unlocked_achievements || [];
    
    const achievements = DEFAULT_ACHIEVEMENTS; // Pull from constants file directly so we don't need store logic
    
    const [activeTab, setActiveTab] = useState<AchievementCategory | 'all'>('all');

    // Dynamic Progress Calculation
    const getProgress = (type: string, target: number) => {
        let current = 0;
        switch(type) {
            case 'complete_quests':
                current = quests.filter((q: any) => q.is_completed).length;
                break;
            case 'reach_streak':
                current = habits.filter((h: any) => h.completed_today).length; // Simplify for now
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

    const filteredAchievements = achievements.filter((a: Achievement) => activeTab === 'all' || a.category === activeTab);
    
    // Stats
    const totalUnlocked = unlockedIds.length;
    const totalCount = achievements.length;
    const progressPercent = (totalUnlocked / totalCount) * 100;

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6 pb-6">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
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

                {/* Overall Progress */}
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

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredAchievements.map((ach: Achievement) => {
                        const IconComp = ICON_MAP[ach.icon] || Star;
                        const { current, percentage, isCompleted } = getProgress(ach.requirementType, ach.requirementValue);
                        
                        // Fake auto-unlock for demo
                        if (isCompleted && !unlockedIds.includes(ach.id)) {
                            // In a real app this would trigger via a listener, 
                            // doing it directly here for UI demo purposes only
                            // unlockAchievement(ach.id); 
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
