"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStatsStore } from "@/store/userStatsStore";
import { useHabitStore } from "@/store/habitStore";
import {
    Sparkles,
    TrendingUp,
    TrendingDown,
    Hourglass,
    BrainCircuit,
    ArrowRight,
    Star,
    AlertTriangle,
    CalendarDays,
    Target
} from "lucide-react";

type Timeframe = "1_month" | "6_months" | "1_year" | "5_years";

export default function SimulationPage() {
    const { level, xp, stats } = useUserStatsStore();
    const { habits } = useHabitStore();
    const [timeframe, setTimeframe] = useState<Timeframe>("6_months");
    const [isSimulating, setIsSimulating] = useState(false);

    // Calculate generic active habits ratio
    const activeHabitsCount = habits.filter(h => h.completed_today).length;
    const totalHabitsCount = habits.length || 1; 
    const consistencyRate = Math.round((activeHabitsCount / totalHabitsCount) * 100);

    // Dummy predictions based on current generic stats
    const generatePredictions = () => {
        setIsSimulating(true);
        setTimeout(() => setIsSimulating(false), 1500);
    };

    const getPredictionText = (type: "positive" | "negative") => {
        if (consistencyRate > 70) {
            return type === "positive" 
                ? "Lintasanmu sangat luar biasa. Jika kamu mempertahankan disiplin ini, kamu akan mencapai penguasaan level tinggi di semua atribut utama. Peluang baru akan bermunculan karena konsistensimu."
                : "Tidak ada ancaman besar terlihat, namun berhati-hatilah terhadap burnout. Ambisimu tinggi, pastikan waktu pemulihan (Health) tetap seimbang.";
        } else if (consistencyRate > 40) {
            return type === "positive"
                ? "Kamu berada di jalur rata-rata. Ada progres yang stabil, namun belum cukup eksplosif untuk terobosan besar. Tingkatkan rutinitas harianmu."
                : "Kamu berisiko stagnan. Beberapa kebiasaan mulai kendor. Jika dibiarkan 6 bulan ke depan, kamu mungkin akan menyesali waktu yang terbuang karena prokrastinasi.";
        } else {
            return type === "positive"
                ? "Masih ada waktu untuk berbalik arah. Setiap langkah kecil sekarang akan berdampak besar secara compounding (bunga berbunga) di masa depan."
                : "PERINGATAN KRITIS: Jika kamu melanjutkan pola saat ini, kamu berpotensi kehilangan banyak kesempatan. Penurunan drastis pada atribut Disiplin dan Kesehatan terdeteksi.";
        }
    };

    const getMultipliers = () => {
        const base = consistencyRate > 50 ? 1 : -1;
        switch(timeframe) {
            case "1_month": return { xp: 5000 * base, lvl: 2 * base, str: 10 * base };
            case "6_months": return { xp: 35000 * base, lvl: 15 * base, str: 60 * base };
            case "1_year": return { xp: 100000 * base, lvl: 35 * base, str: 100 * base };
            case "5_years": return { xp: 500000 * base, lvl: 100 * base, str: 500 * base };
        }
    };

    const mults = getMultipliers();

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                            <BrainCircuit size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight font-[family-name:var(--font-heading)]">
                            Simulasi Masa Depan
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        AI memproyeksikan lintasan hidupmu (Trajectory) berdasarkan konsistensi, kebiasaan, dan atribut karaktermu saat ini.
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Input & Reality Check */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Reality Dashboard */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-5 blur-[50px] rounded-full" />
                        
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Target size={16} className="text-[var(--primary)]" /> Realita Saat Ini
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tingkat Konsistensi</span>
                                <span className={`text-lg font-bold font-mono ${consistencyRate >= 70 ? 'text-emerald-400' : consistencyRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {consistencyRate}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Habit Aktif</span>
                                <span className="text-lg font-bold font-mono text-white">
                                    {activeHabitsCount}/{totalHabitsCount}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Level Saat Ini</span>
                                <span className="text-lg font-bold font-mono text-indigo-400">
                                    Lv.{level}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="mt-8 space-y-4">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pilih Jendela Waktu</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: "1_month", label: "1 Bulan" },
                                    { id: "6_months", label: "6 Bulan" },
                                    { id: "1_year", label: "1 Tahun" },
                                    { id: "5_years", label: "5 Tahun" }
                                ].map(tf => (
                                    <button
                                        key={tf.id}
                                        onClick={() => setTimeframe(tf.id as Timeframe)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                            timeframe === tf.id 
                                            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" 
                                            : "bg-black/30 border border-white/10 text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        {tf.label}
                                    </button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={generatePredictions}
                                disabled={isSimulating}
                                className="w-full mt-4 py-3.5 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSimulating ? (
                                    <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Menganalisis...</div>
                                ) : (
                                    <><Sparkles size={16} /> Prediksi Masa Depan</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Simulated Future */}
                <div className="lg:col-span-7 space-y-6">
                    <AnimatePresence mode="wait">
                        {isSimulating ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-black/10"
                            >
                                <BrainCircuit size={48} className="text-indigo-500/50 animate-pulse mb-6" />
                                <div className="space-y-2 text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Memproses Data Historis...</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse" style={{ animationDelay: "0.2s" }}>Mengevaluasi Variabel Disiplin...</p>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest animate-pulse" style={{ animationDelay: "0.4s" }}>Menghitung Garis Waktu Probabilitas...</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Projected Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Proyeksi Level</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-xl font-bold text-slate-400 line-through decoration-slate-600">{level}</span>
                                            <ArrowRight size={14} className="text-slate-600" />
                                            <span className={`text-2xl font-bold ${mults.lvl > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {Math.max(1, level + mults.lvl)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Proyeksi XP</p>
                                        <div className="flex justify-center">
                                            <span className={`text-xl font-bold font-mono ${mults.xp > 0 ? 'text-indigo-400' : 'text-red-400'}`}>
                                                {mults.xp > 0 ? '+' : ''}{mults.xp.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Proyeksi Atribut</p>
                                        <div className="flex justify-center">
                                            <span className={`text-xl font-bold flex items-center justify-center gap-1 ${mults.str > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {mults.str > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                                {mults.str > 0 ? '+' : ''}{mults.str}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Narrative - Positive */}
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Star size={100} />
                                    </div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">
                                        <Sparkles size={16} /> Paradigma Positif
                                    </h4>
                                    <p className="text-emerald-100/80 leading-relaxed text-sm relative z-10">
                                        {getPredictionText("positive")}
                                    </p>
                                </div>

                                {/* AI Narrative - Negative */}
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <AlertTriangle size={100} />
                                    </div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-widest mb-4">
                                        <AlertTriangle size={16} /> Risiko Masa Depan
                                    </h4>
                                    <p className="text-red-100/80 leading-relaxed text-sm relative z-10">
                                        {getPredictionText("negative")}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
