"use client";

interface StreakIndicatorProps {
    streak: number;
    maxDisplay?: number;
}

export default function StreakIndicator({ streak, maxDisplay = 7 }: StreakIndicatorProps) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxDisplay }).map((_, i) => (
                <div
                    key={i}
                    className={`
            w-6 h-6 rounded-lg flex items-center justify-center text-xs
            ${i < streak
                            ? "bg-[var(--secondary)]/20 text-[var(--secondary)] border border-[var(--secondary)]/30"
                            : "bg-[var(--dark-surface)] text-[var(--text-muted)] border border-[var(--dark-border)]"
                        }
          `}
                >
                    {i < streak ? "🔥" : "·"}
                </div>
            ))}
            {streak > maxDisplay && (
                <span className="text-xs text-[var(--text-muted)] ml-1">+{streak - maxDisplay}</span>
            )}
        </div>
    );
}
