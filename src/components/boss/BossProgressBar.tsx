"use client";

import { motion } from "framer-motion";

interface BossProgressBarProps {
    current: number;
    max: number;
    bossName: string;
}

export default function BossProgressBar({ current, max, bossName }: BossProgressBarProps) {
    const percentage = Math.min((current / max) * 100, 100);
    const hpRemaining = max - current;

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-[var(--health)]">👹 {bossName}</span>
                <span className="text-xs text-[var(--text-muted)]">HP: {hpRemaining} / {max}</span>
            </div>
            <div className="h-5 bg-[var(--dark-surface)] rounded-full overflow-hidden border border-[var(--dark-border)]">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 relative"
                    initial={{ width: "100%" }}
                    animate={{ width: `${100 - percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </motion.div>
            </div>
        </div>
    );
}
