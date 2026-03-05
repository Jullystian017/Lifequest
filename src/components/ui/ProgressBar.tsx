"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    value: number;
    max: number;
    color?: string;
    showLabel?: boolean;
    label?: string;
    height?: "sm" | "md" | "lg";
    animated?: boolean;
}

const heightStyles = {
    sm: "h-1.5",
    md: "h-3",
    lg: "h-5",
};

export default function ProgressBar({
    value,
    max,
    color = "var(--primary)",
    showLabel = false,
    label,
    height = "md",
    animated = true,
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className="w-full">
            {(showLabel || label) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && (
                        <span className="text-xs font-medium text-[var(--text-secondary)]">
                            {label}
                        </span>
                    )}
                    {showLabel && (
                        <span className="text-xs text-[var(--text-muted)]">
                            {value} / {max}
                        </span>
                    )}
                </div>
            )}
            <div
                className={`
          w-full bg-[var(--dark-surface)] rounded-full overflow-hidden
          ${heightStyles[height]}
        `}
            >
                <motion.div
                    className={`${heightStyles[height]} rounded-full`}
                    style={{ backgroundColor: color }}
                    initial={animated ? { width: 0 } : { width: `${percentage}%` }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
