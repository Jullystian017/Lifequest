"use client";

import { Sparkles } from "lucide-react";
import { useUserStatsStore } from "@/store/userStatsStore";

export default function AIInsightWidget() {
    const { level, username } = useUserStatsStore();

    const getInsight = () => {
        if (level <= 1) {
            return (
                <p className="text-sm leading-relaxed text-slate-300">
                    &quot;Selamat datang, <span className="text-white font-semibold">{username}</span>! Ini awal petualanganmu. Mulailah dengan menambahkan <span className="text-[var(--secondary)] font-semibold">Quest harian</span> dan <span className="text-[var(--discipline)] font-semibold">Kebiasaan</span> pertamamu untuk mendapatkan XP.&quot;
                </p>
            );
        }
        return (
            <p className="text-sm leading-relaxed text-slate-300">
                &quot;<span className="text-white font-semibold">{username}</span>, kamu sudah Level <span className="text-[var(--secondary)] font-semibold">{level}</span>! Terus pertahankan momentummu. Selesaikan quest harianmu sebelum tengah malam untuk mendapatkan <span className="text-[var(--discipline)] font-semibold">bonus streak XP</span>.&quot;
            </p>
        );
    };

    return (
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all hover:border-[var(--secondary)]/30">
            <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-[var(--secondary)]/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-[var(--secondary)]/20 transition-colors"></div>

            <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-[var(--secondary)] shadow-lg">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">
                        Wawasan AI
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Analisis Sistem</p>
                </div>
            </div>

            <div className="relative z-10 space-y-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-sidebar)]/50 border border-[var(--border-light)] group-hover:border-[var(--secondary)]/20 transition-all">
                    {getInsight()}
                </div>
            </div>
        </div>
    );
}
