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

import ProductivityTrendsWidget from "@/components/dashboard/ProductivityTrendsWidget";
import DailyQuestPanel from "@/components/dashboard/DailyQuestPanel";
import ActiveStreaksWidget from "@/components/dashboard/ActiveStreaksWidget";
import RecentActivityWidget from "@/components/dashboard/RecentActivityWidget";
import AIInsightWidget from "@/components/dashboard/AIInsightWidget";
import SummaryStatCards from "@/components/dashboard/SummaryStatCards";

import {
    Heart, BookOpen, Dumbbell, Palette,
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
                <p className="text-xs font-bold text-slate-500 animate-pulse">Menghubungkan ke Life Engine...</p>
            </div>
        );
    }

    const stats = user?.stats ?? { vitality: 0, knowledge: 0, discipline: 0, creativity: 0 };
    const xp = user?.xp ?? 0;
    const xpToNextLevel = user?.xp_to_next_level ?? 100;
    const level = user?.level ?? 1;
    const gold = user?.gold ?? 0;
    const username = user?.username ?? "Petualang";
    const avatar_url = user?.avatar_url ?? "/lifequest.png";
    const xpPercent = xpToNextLevel > 0 ? Math.round((xp / xpToNextLevel) * 100) : 0;

    const completedToday = quests.filter(q => q.is_completed);
    const pendingQuests = quests.filter(q => !q.is_completed);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayXp = quests
        .filter(q => q.is_completed && q.completed_at?.startsWith(todayStr))
        .reduce((sum, q) => sum + (q.xp_reward || 0), 0);

    return (
        <div className="space-y-10 pb-20 animate-fade-in w-full">

            {/* Compact Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-500/30 shadow-lg shrink-0">
                  <img src={avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Halo, {username}!</h1>
                  <p className="text-sm text-slate-500 font-medium">Selamat datang kembali di petualanganmu hari ini.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-3 shadow-sm">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Zap size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 leading-none mb-1">LEVEL {level}</span>
                    <div className="w-24 h-1.5 bg-[#1a1b2e] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${xpPercent}%` }} 
                        className="h-full bg-indigo-500" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-2 shadow-sm">
                  <Star size={16} className="text-yellow-500 shrink-0" />
                  <span className="text-sm font-bold text-white leading-none">{gold.toLocaleString()} Gold</span>
                </div>
              </div>
            </div>

            {/* Summary Stat Cards */}
            <SummaryStatCards stats={stats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column (Wider) */}
                <div className="lg:col-span-8 space-y-10">
                    
                    {pendingQuests.length > 0 && (
                        <Link href="/dashboard/quests" className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 flex items-center justify-between group hover:border-indigo-500/40 transition-all cursor-pointer shadow-xl">
                            <div className="flex items-center gap-5">
                                <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 shadow-inner">
                                    <Swords size={24} className="text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-indigo-400 mb-1">LANJUTKAN QUEST</p>
                                    <p className="text-xl font-bold text-white truncate max-w-[400px] leading-tight">{pendingQuests[0].title}</p>
                                </div>
                            </div>
                            <div className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:translate-x-1 transition-all">
                              <ArrowRight size={20} className="text-indigo-400" />
                            </div>
                        </Link>
                    )}

                    <ProductivityTrendsWidget />
                    
                    <DailyQuestPanel
                        quests={quests}
                        userId={userId!}
                        onCompleteQuest={(id) => completeQuestMutation.mutate(id)}
                        onQuestAdded={() => refetchQuests()}
                    />
                </div>

                {/* Right Column (Narrower) */}
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
