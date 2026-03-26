"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchHabits, fetchQuests, fetchFocusSessions, userQueryKey, habitsQueryKey, questsQueryKey, focusSessionsQueryKey } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import {
    TrendingUp,
    Zap,
    Flame,
    Target,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Clock,
    Timer,
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

    const { data: focusSessions = [] } = useQuery({
        queryKey: focusSessionsQueryKey(userId!),
        queryFn: () => fetchFocusSessions(userId!),
        enabled: !!userId,
    });

    const level = user?.level || 1;
    const totalXp = user?.total_xp || 0;
    const currentXp = user?.xp || 0;
    const stats: Record<string, number> = user?.stats || { vitality: 0, knowledge: 0, discipline: 0, creativity: 0 };
    const gold = user?.gold || 0;

    // Real data calculations
    const completedQuests = quests.filter((q: any) => q.is_completed);
    const activeQuests = quests.filter((q: any) => !q.is_completed);

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

    // Focus sessions calculations
    const totalFocusMinutes = focusSessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
    const focusHours = Math.floor(totalFocusMinutes / 60);
    const focusRemainingMinutes = totalFocusMinutes % 60;
    


    // Quest type breakdown
    const dailyCount = quests.filter((q: any) => q.type === 'daily').length;
    const weeklyCount = quests.filter((q: any) => q.type === 'weekly').length;
    const storyCount = quests.filter((q: any) => q.type === 'story').length;
    const aiCount = quests.filter((q: any) => q.type === 'ai_generated').length;

    // Stat with highest value
    const statsEntries = Object.entries(stats);
    const topStat = statsEntries.reduce((best, [key, val]) => val > best.val ? { key, val } : best, { key: '', val: 0 });

    const statLabels: Record<string, string> = {
        vitality: "Vitalitas", knowledge: "Kecerdasan", discipline: "Disiplin",
        creativity: "Kreativitas"
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
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Pengalaman</span>
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tighter">{totalXp.toLocaleString()} XP</span>
                    <div className="text-xs font-bold text-slate-500 mt-1">Level {level} · {currentXp} XP saat ini</div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Clock size={60} /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Clock size={16} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waktu Fokus</span>
                    </div>
                    <span className="text-3xl font-bold text-white tracking-tighter">{focusHours}j {focusRemainingMinutes}m</span>
                    <div className="text-xs font-bold text-slate-500 mt-1">{focusSessions.length} sesi fokus terselesaikan</div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* XP Chart - Real Data */}
                <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 size={16} className="text-blue-400" /> XP Per Hari (7 Hari Terakhir)
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Data XP dari quest yang diselesaikan</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {last7Days.map((day, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <span className="w-10 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-[var(--primary)] transition-colors">
                                    {day.label}
                                </span>
                                <div className="flex-1 h-2.5 bg-slate-800/40 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${day.xp > 0 ? Math.max((day.xp / maxXp) * 100, 2) : 0}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className="h-full bg-gradient-to-r from-[var(--primary)] to-blue-400 group-hover:brightness-110 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col items-end min-w-[60px]">
                                    <span className="text-[10px] font-bold text-white tracking-widest leading-none">
                                        {day.xp} <span className="text-[8px] text-slate-500">XP</span>
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-500 group-hover:text-[var(--primary)] transition-colors">
                                        {day.quests} QST
                                    </span>
                                </div>
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
                            {[
                                { label: "Quest Selesai", value: completedQuests.length, valColor: "text-emerald-400" },
                                { label: "Quest Aktif", value: activeQuests.length, valColor: "text-yellow-500" }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: i * 0.1 }}
                                    className="flex justify-between items-center"
                                >
                                    <span className="text-xs text-slate-400 font-semibold">{item.label}</span>
                                    <span className={`text-sm font-bold ${item.valColor}`}>{item.value}</span>
                                </motion.div>
                            ))}
                            
                            <div className="h-px bg-white/5 my-2" />
                            
                            {[
                                { label: "Harian", value: dailyCount },
                                { label: "Mingguan", value: weeklyCount },
                                { label: "Cerita", value: storyCount },
                                { label: "Dari AI", value: aiCount }
                            ].map((item, i) => (
                                <motion.div 
                                    key={item.label}
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: 0.2 + (i * 0.05) }}
                                    className="flex justify-between items-center"
                                >
                                    <span className="text-xs text-slate-400 font-semibold">{item.label}</span>
                                    <span className="text-xs font-bold text-slate-300">{item.value}</span>
                                </motion.div>
                            ))}
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
