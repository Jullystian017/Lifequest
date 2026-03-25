"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchHabits, fetchQuests, userQueryKey, habitsQueryKey, questsQueryKey } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import {
    TrendingUp,
    Zap,
    Flame,
    Target,
    Award,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Coins,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
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

    const { data: habits = [] } = useQuery({
        queryKey: habitsQueryKey(userId!),
        queryFn: () => fetchHabits(userId!),
        enabled: !!userId,
    });

    const { data: quests = [] } = useQuery({
        queryKey: questsQueryKey(userId!),
        queryFn: () => fetchQuests(userId!),
        enabled: !!userId,
    });

    const level = user?.level || 1;
    const xp = user?.total_xp || 0;
    const stats: Record<string, number> = user?.stats || { health: 0, knowledge: 0, discipline: 0, finance: 0, creativity: 0 };
    const coins = user?.coins || 0;

    // Real data calculations
    const completedQuests = quests.filter((q: any) => q.is_completed);
    const activeQuests = quests.filter((q: any) => !q.is_completed);
    const totalXpEarned = completedQuests.reduce((sum: number, q: any) => sum + (q.xp_reward || 0), 0);
    const totalGoldEarned = completedQuests.reduce((sum: number, q: any) => sum + (q.coin_reward || 0), 0);

    const activeHabits = habits.filter((h: any) => h.completed_today).length;
    const totalHabits = habits.length || 1;
    const completionRate = Math.round((activeHabits / totalHabits) * 100);

    // Best streak from habits
    const bestStreak = habits.reduce((max: number, h: any) => Math.max(max, h.longest_streak || h.current_streak || 0), 0);

    // Build real 7-day chart data from completed quests
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const today = new Date();
    const last7Days: { label: string; quests: number; xp: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayIdx = d.getDay();
        const dateStr = d.toISOString().split('T')[0];

        const dayQuests = completedQuests.filter((q: any) => {
            if (!q.completed_at) return false;
            return q.completed_at.startsWith(dateStr);
        });

        last7Days.push({
            label: dayNames[dayIdx],
            quests: dayQuests.length,
            xp: dayQuests.reduce((s: number, q: any) => s + (q.xp_reward || 0), 0),
        });
    }

    const maxXp = Math.max(...last7Days.map(d => d.xp), 1);

    // Quest type breakdown
    const dailyCount = quests.filter((q: any) => q.type === 'daily').length;
    const weeklyCount = quests.filter((q: any) => q.type === 'weekly').length;
    const storyCount = quests.filter((q: any) => q.type === 'story').length;
    const aiCount = quests.filter((q: any) => q.type === 'ai_generated').length;

    // Stat with highest value
    const statsEntries = Object.entries(stats);
    const topStat = statsEntries.reduce((best, [key, val]) => val > best.val ? { key, val } : best, { key: '', val: 0 });

    const statLabels: Record<string, string> = {
        health: "Vitalitas", knowledge: "Kecerdasan", discipline: "Disiplin",
        finance: "Keuangan", creativity: "Kreativitas"
    };

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Target size={60} /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Target size={16} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tingkat Penyelesaian</span>
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tighter">{completionRate}%</span>
                    <div className="text-xs font-bold text-slate-500 mt-1">{activeHabits}/{totalHabits} habit hari ini</div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Flame size={60} /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400"><Flame size={16} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Streak Terbaik</span>
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tighter">{bestStreak} Hari</span>
                    <div className="text-xs font-bold text-slate-500 mt-1">{habits.length} kebiasaan dilacak</div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Zap size={60} /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Zap size={16} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total XP</span>
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tighter">{totalXpEarned.toLocaleString()}</span>
                    <div className="text-xs font-bold text-slate-500 mt-1">Level {level} · {xp} XP saat ini</div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Award size={60} /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Coins size={16} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gold Terkumpul</span>
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tighter">{totalGoldEarned.toLocaleString()}</span>
                    <div className="text-xs font-bold text-slate-500 mt-1">{coins.toLocaleString()} G tersedia</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* XP Chart - Real Data */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 size={16} className="text-blue-400" /> XP Per Hari (7 Hari Terakhir)
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Data XP dari quest yang diselesaikan</p>
                        </div>
                    </div>

                    <div className="h-[280px] mt-6 flex justify-between gap-2 sm:gap-6 px-2 sm:px-6">
                        {last7Days.map((day, i) => (
                            <div key={i} className="flex flex-col items-center justify-end w-full h-full group">
                                <div className="opacity-0 group-hover:opacity-100 mb-2 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs font-bold text-white bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/20 px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap">
                                    {day.xp} XP · {day.quests} quest
                                </div>

                                <div className="w-full max-w-[48px] flex-1 bg-slate-800/40 rounded-2xl flex items-end overflow-hidden border border-white/5 relative shadow-inner">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${day.xp > 0 ? Math.max((day.xp / maxXp) * 100, 8) : 3}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className={`w-full transition-all duration-1000 group-hover:brightness-110 relative ${
                                            day.xp > 0 ? "bg-gradient-to-t from-[var(--primary)] to-blue-400" : "bg-slate-700/50"
                                        }`}
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-white/30 to-transparent mix-blend-overlay" />
                                    </motion.div>
                                </div>

                                <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-4 uppercase tracking-widest group-hover:text-white transition-colors">
                                    {day.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side Stats */}
                <div className="space-y-4">
                    {/* Quest Breakdown */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)]">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-400" /> Ringkasan Quest
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-semibold">Quest Selesai</span>
                                <span className="text-sm font-bold text-emerald-400">{completedQuests.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-semibold">Quest Aktif</span>
                                <span className="text-sm font-bold text-yellow-500">{activeQuests.length}</span>
                            </div>
                            <div className="h-px bg-white/5 my-2" />
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-semibold">Harian</span>
                                <span className="text-xs font-bold text-slate-300">{dailyCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-semibold">Mingguan</span>
                                <span className="text-xs font-bold text-slate-300">{weeklyCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-semibold">Cerita</span>
                                <span className="text-xs font-bold text-slate-300">{storyCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-semibold">Dari AI</span>
                                <span className="text-xs font-bold text-slate-300">{aiCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Stat */}
                    <div className="p-6 rounded-3xl bg-gradient-to-b from-[var(--bg-card)] to-indigo-900/10 border border-[var(--border-light)] flex flex-col items-center justify-center text-center gap-4">
                        <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <TrendingUp size={28} className="text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Atribut Terkuat</h4>
                            <p className="text-lg font-bold text-indigo-400 mt-1">
                                {topStat.key ? `${statLabels[topStat.key] || topStat.key} (${topStat.val}%)` : "Belum ada data"}
                            </p>
                        </div>
                        <Link href="/dashboard/character" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                            Lihat Profil Karakter <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
