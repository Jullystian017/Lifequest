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
    Award
} from "lucide-react";

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
        <div className="space-y-8 pb-20 w-full animate-fade-in max-w-6xl mx-auto">
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

                    <div className="h-[250px] flex items-end justify-between gap-2 px-2 pb-6 border-b border-white/5 relative">
                        {/* Background grid lines */}
                        <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between pointer-events-none z-0">
                            {[100, 75, 50, 25, 0].map(val => (
                                <div key={val} className="border-b border-white/5 w-full h-0 flex items-center">
                                    <span className="absolute -left-6 text-[10px] text-slate-600 font-bold">{val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Bars */}
                        {fakeData.map((val, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center w-full group">
                                <div className="absolute -top-8 text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {val}%
                                </div>
                                <div className="w-full max-w-[40px] bg-slate-800 rounded-t-lg overflow-hidden h-[200px] flex items-end">
                                    <div 
                                        className="w-full bg-gradient-to-t from-[var(--primary)] to-blue-400 rounded-t-lg transition-all duration-1000 group-hover:opacity-80"
                                        style={{ height: `${val}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 mt-3 uppercase">{last7Days[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: AI Insight */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-[var(--bg-card)] to-indigo-900/10 border border-[var(--border-light)]">
                    <div className="flex items-center gap-2 mb-6 text-indigo-400">
                        <BrainCircuit size={18} />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Wawasan AI</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Waktu Emas
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Kamu paling banyak menyelesaikan tugas pada pukul 09:00 - 11:30. Jadwalkan 'Deep Work' atau tugas tersulitmu di periode ini.
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500" /> Peringatan Disiplin
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Atribut <span className="text-yellow-400 font-bold">Health</span> kamu menunjukkan pola menurun di akhir pekan. Pertimbangkan menambahkan rutinitas ringan pada hari Sabtu/Minggu.
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" /> Momentum
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Streak fantastis selama 5 hari terakhir di kategori 'Belajar'. Terus pertahankan untuk mendapat XP Bonus minggu ini!
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
