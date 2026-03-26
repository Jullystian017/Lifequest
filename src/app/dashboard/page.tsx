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
import GuildMaster from "@/components/dashboard/GuildMaster";

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

    // Evaluate Habit Streaks daily
    useEffect(() => {
        if (!userId) return;
        fetch("/api/habits/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientDate: new Date().toISOString().split("T")[0] })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.evaluated > 0) {
                queryClient.invalidateQueries({ queryKey: habitsQueryKey(userId) });
            }
        })
        .catch(console.error);
    }, [userId, queryClient]);

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


            {/* Summary Stat Cards */}
            <SummaryStatCards stats={stats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column (Wider) */}
                <div className="lg:col-span-8 space-y-10">
                    
                    <GuildMaster user={user} quests={quests} habits={habits} />
                    
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
