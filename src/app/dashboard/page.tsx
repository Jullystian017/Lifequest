"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
    fetchUser, fetchQuests, fetchHabits,
    userQueryKey, questsQueryKey, habitsQueryKey
} from "@/lib/queries";
import { completeQuest } from "@/lib/mutations";

import GoalPlannerWidget from "@/components/dashboard/GoalPlannerWidget";
import ProductivityTrendsWidget from "@/components/dashboard/ProductivityTrendsWidget";
import DailyQuestPanel from "@/components/dashboard/DailyQuestPanel";
import ActiveStreaksWidget from "@/components/dashboard/ActiveStreaksWidget";
import RecentActivityWidget from "@/components/dashboard/RecentActivityWidget";
import AIInsightWidget from "@/components/dashboard/AIInsightWidget";

import {
    Heart, BookOpen, Dumbbell, PiggyBank, Palette,
    Loader2, Flame, Zap, Swords, ArrowRight, Star,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const supabase = createClient();
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState<string | null>(null);

    // Get current user ID once on mount
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) { window.location.href = "/login"; return; }
            setUserId(data.user.id);
        });
    }, []);

    // Parallel queries — all fire at once
    const { data: user, isLoading: loadingUser } = useQuery({
        queryKey: userQueryKey(userId!),
        queryFn: () => fetchUser(userId!),
        enabled: !!userId,
    });

    const { data: quests = [], isLoading: loadingQuests, refetch: refetchQuests } = useQuery({
        queryKey: questsQueryKey(userId!),
        queryFn: () => fetchQuests(userId!),
        enabled: !!userId,
    });

    const { data: habits = [], isLoading: loadingHabits } = useQuery({
        queryKey: habitsQueryKey(userId!),
        queryFn: () => fetchHabits(userId!),
        enabled: !!userId,
    });

    // Complete quest mutation
    const completeQuestMutation = useMutation({
        mutationFn: async (questId: string) => {
            const quest = quests.find(q => q.id === questId);
            if (!quest || quest.is_completed) return;
            await completeQuest(userId!, quest, user!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userQueryKey(userId!) });
            queryClient.invalidateQueries({ queryKey: questsQueryKey(userId!) });
        },
    });

    const isLoading = !userId || loadingUser || loadingQuests || loadingHabits;

    if (isLoading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
                <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
                <p className="text-sm font-semibold uppercase tracking-widest">Memuat Dashboard...</p>
            </div>
        );
    }

    const stats = user?.stats ?? { health: 0, knowledge: 0, discipline: 0, finance: 0, creativity: 0 };
    const xp = user?.xp ?? 0;
    const xpToNextLevel = user?.xp_to_next_level ?? 100;
    const level = user?.level ?? 1;
    const gold = user?.gold ?? 0;
    const username = user?.username ?? "Petualang";
    const avatar_url = user?.avatar_url ?? "/lifequest.png";
    const xpPercent = xpToNextLevel > 0 ? Math.round((xp / xpToNextLevel) * 100) : 0;

    const completedToday = quests.filter(q => q.is_completed).length;
    const pendingQuests = quests.filter(q => !q.is_completed);
    const todayXp = quests.filter(q => q.is_completed).reduce((sum, q) => sum + (q.xp_reward || 0), 0);

    return (
        <div className="space-y-8 pb-20 animate-fade-in w-full">

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* User Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[var(--bg-card)] to-[#1a1b2e] border border-[var(--border-light)] relative overflow-hidden group"
                >
                    <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="flex items-center gap-5 relative z-10 mb-6">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.3)] shrink-0">
                            <img src={avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-semibold text-white truncate">{username}</h2>
                            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Level {level} Petualang</p>

                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Pengalaman</span>
                                    <span className="text-[10px] font-semibold text-white">{xp} / {xpToNextLevel} XP</span>
                                </div>
                                <div className="h-2.5 w-full bg-[#2a2b3d] rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${xpPercent}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">{xpToNextLevel - xp} XP lagi menuju Level {level + 1}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 relative z-10">
                        <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                            <Flame size={16} className="text-orange-500 mx-auto mb-1" />
                            <p className="text-lg font-semibold text-white leading-none">{habits.filter(h => h.completed_today).length}</p>
                            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Streak Hari Ini</p>
                        </div>
                        <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                            <Zap size={16} className="text-indigo-400 mx-auto mb-1" />
                            <p className="text-lg font-semibold text-white leading-none">{todayXp}</p>
                            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">XP Hari Ini</p>
                        </div>
                        <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                            <Star size={16} className="text-yellow-500 mx-auto mb-1" />
                            <p className="text-lg font-semibold text-white leading-none">{gold.toLocaleString()}</p>
                            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Gold</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stat Cards + Continue */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {[
                        { label: "Vitalitas", short: "HP", value: stats.health, icon: Heart, color: "var(--health)", desc: "Kesehatan fisikmu" },
                        { label: "Kecerdasan", short: "INT", value: stats.knowledge, icon: BookOpen, color: "var(--knowledge)", desc: "Pengetahuan & belajar" },
                        { label: "Disiplin", short: "DIS", value: stats.discipline, icon: Dumbbell, color: "var(--discipline)", desc: "Fokus & konsistensi" },
                        { label: "Kreativitas", short: "CRT", value: stats.creativity, icon: Palette, color: "var(--creativity)", desc: "Inspirasi & seni" },
                    ].map((stat, idx) => (
                        <div key={stat.short} className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-4 group hover:border-white/10 transition-all">
                            <div className="p-2.5 rounded-xl border border-white/5" style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)` }}>
                                <stat.icon size={18} style={{ color: stat.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs font-semibold text-slate-400">{stat.label} ({stat.short})</span>
                                    <span className="text-lg font-semibold text-white">{stat.value}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[var(--bg-sidebar)] rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: stat.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.value}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {pendingQuests.length > 0 && (
                        <Link href="/dashboard/quests" className="sm:col-span-2 p-4 rounded-2xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 flex items-center justify-between group hover:border-indigo-500/40 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
                                    <Swords size={18} className="text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Lanjutkan Quest</p>
                                    <p className="text-sm font-semibold text-white truncate max-w-[300px]">{pendingQuests[0].title}</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <GoalPlannerWidget />
                    <ProductivityTrendsWidget />
                    <DailyQuestPanel
                        quests={quests}
                        userId={userId!}
                        onCompleteQuest={(id) => completeQuestMutation.mutate(id)}
                        onQuestAdded={() => refetchQuests()}
                    />
                </div>
                <div className="lg:col-span-4 space-y-10">
                    <AIInsightWidget />
                    <ActiveStreaksWidget
                        habits={habits}
                        userId={userId!}
                        onHabitToggled={() => queryClient.invalidateQueries({ queryKey: habitsQueryKey(userId!) })}
                        onHabitAdded={() => queryClient.invalidateQueries({ queryKey: habitsQueryKey(userId!) })}
                    />
                    <RecentActivityWidget quests={quests} />
                </div>
            </div>
        </div>
    );
}
