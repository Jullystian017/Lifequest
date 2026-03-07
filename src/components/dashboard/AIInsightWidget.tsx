"use client";

import { Sparkles, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AIInsightWidget() {
    return (
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all hover:border-[var(--secondary)]/30">
            {/* Background Subtle AI Glow (Magenta/Purple) */}
            <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-[var(--secondary)]/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-[var(--secondary)]/20 transition-colors"></div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-[var(--secondary)] shadow-lg">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">
                        AI Insight
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">System Analysis</p>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-sidebar)]/50 border border-[var(--border-light)] group-hover:border-[var(--secondary)]/20 transition-all">
                    <p className="text-sm leading-relaxed text-slate-300">
                        "Your <span className="text-white font-semibold">Discipline</span> is peaking in the morning! Completing habits before <span className="text-[var(--secondary)] font-bold">09:00 AM</span> today will grant a <span className="text-[var(--discipline)] font-bold">1.2x XP Multiplier</span>."
                    </p>
                </div>


            </div>
        </div>
    );
}
