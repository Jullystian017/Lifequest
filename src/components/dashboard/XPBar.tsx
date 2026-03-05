"use client";

import { motion } from "framer-motion";

interface XPBarProps {
    currentXP: number;
    maxXP: number;
    level: number;
    color?: string;
}

export default function XPBar({
    currentXP,
    maxXP,
    level,
    color = "var(--primary)",
}: XPBarProps) {
    const percentage = (currentXP / maxXP) * 100;

    return (
        <div className="flex items-center gap-3">
            {/* Level Badge */}
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                    background: `${color}20`,
                    color: color,
                    border: `2px solid ${color}40`,
                }}
            >
                {level}
            </div>

            {/* Bar */}
            <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-muted)]">XP Progress</span>
                    <span className="text-[var(--text-secondary)]">
                        {currentXP.toLocaleString()} / {maxXP.toLocaleString()}
                    </span>
                </div>
                <div className="h-3 bg-[var(--dark-surface)] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full relative"
                        style={{
                            background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </motion.div>
                </div>
            </div>

            {/* Next Level */}
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 opacity-40"
                style={{
                    background: `${color}10`,
                    color: color,
                    border: `2px dashed ${color}30`,
                }}
            >
                {level + 1}
            </div>
        </div>
    );
}
