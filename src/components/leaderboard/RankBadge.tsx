"use client";

import { getLevelColor, getLevelTitle } from "@/lib/gamification/levels";

interface RankBadgeProps {
    rank: number;
    level: number;
    size?: "sm" | "md" | "lg";
}

export default function RankBadge({ rank, level, size = "md" }: RankBadgeProps) {
    const color = getLevelColor(level);
    const title = getLevelTitle(level);

    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-lg",
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className={`
          ${sizes[size]} rounded-2xl flex items-center justify-center font-bold
          border-2
        `}
                style={{
                    background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                    borderColor: `${color}50`,
                    color,
                }}
            >
                #{rank}
            </div>
            <span className="text-xs text-[var(--text-muted)]">{title}</span>
        </div>
    );
}
