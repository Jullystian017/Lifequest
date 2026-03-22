"use client";

import { motion } from "framer-motion";
import { useUserStatsStore } from "@/store/userStatsStore";
import { useHabitStore } from "@/store/habitStore";
import {
    Activity,
    LineChart,
    BarChart3,
    TrendingUp,
    Zap,
    Flame,
    Target,
    BrainCircuit,
    Award,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
    const { level, xp, stats } = useUserStatsStore();
    const { habits } = useHabitStore();

    // Fake last 7 days data
    const last7Days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const fakeData = [40, 65, 50, 80, 95, 70, 100]; // percentages
    
    const activeHabits = habits.filter(h => h.completed_today).length;
    const totalHabits = habits.length || 1;
    const completionRate = Math.round((activeHabits / totalHabits) * 100);

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Micro Stats Cards */}
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp size={60} /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Target size={16} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tingkat Penyelesaian</span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-white tracking-tighter">{completionRate}%</span>
                        <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">+12% dari minggu lalu</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Flame size={60} /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400"><Flame size={16} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Streak Terbaik</span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-white tracking-tighter">14 Hari</span>
                        <div className="text-xs font-bold text-slate-500 mt-1">Rekor pribadi baru!</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Zap size={60} /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Zap size={16} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waktu Puncak</span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-white tracking-tighter">09:00 - 11:30</span>
                        <div className="text-xs font-bold text-slate-500 mt-1">Paling produktif (AI)</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Award size={60} /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Award size={16} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">XP Mingguan</span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-white tracking-tighter">4,250</span>
                        <div className="text-xs font-bold text-emerald-400 mt-1">+850 vs minggu lalu</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Center: Fake Graph (CSS UI) */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <LineChart size={16} className="text-blue-400" /> Tren Produktivitas 7 Hari
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Aktivitas quest dan habit harian</p>
                        </div>
                    </div>

                    <div className="h-[280px] mt-6 flex justify-between gap-2 sm:gap-6 px-2 sm:px-6">
                        {fakeData.map((val, i) => (
                            <div key={i} className="flex flex-col items-center justify-end w-full h-full group">
                                {/* Hover Values on top */}
                                <div className="opacity-0 group-hover:opacity-100 mb-2 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs font-bold text-white bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/20 px-2 py-1 rounded-lg pointer-events-none">
                                    {val}%
                                </div>
                                
                                {/* Capsule Bar Container */}
                                <div className="w-full max-w-[48px] flex-1 bg-slate-800/40 rounded-2xl flex items-end overflow-hidden border border-white/5 relative shadow-inner">
                                    {/* The filled bar */}
                                    <div 
                                        className="w-full bg-gradient-to-t from-[var(--primary)] to-blue-400 transition-all duration-1000 group-hover:brightness-110 relative"
                                        style={{ height: `${val}%` }}
                                    >
                                        {/* Glass highlight effect */}
                                        <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-white/30 to-transparent mix-blend-overlay" />
                                    </div>
                                </div>

                                {/* X-Axis Label */}
                                <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-4 uppercase tracking-widest group-hover:text-white transition-colors">
                                    {last7Days[i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Quick Stats or Placeholder */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-[var(--bg-card)] to-indigo-900/10 border border-[var(--border-light)] flex flex-col items-center justify-center text-center gap-4">
                    <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <Award size={32} className="text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Analitik Mendalam</h4>
                        <p className="text-xs text-slate-500 mt-1">Wawasan cerdas kini dikelola sepenuhnya oleh <span className="text-indigo-400 font-bold">Life Engine</span> di Dashboard.</p>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                        Buka Life Engine <ArrowRight size={12} />
                    </Link>
                </div>

            </div>
        </div>
    );
}
