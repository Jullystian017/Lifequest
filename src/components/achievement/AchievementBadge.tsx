"use client";

import { Achievement } from "@/types/achievement";
import { getRarityColor, getRarityGlow } from "@/lib/gamification/achievements";

interface AchievementBadgeProps {
    achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
    const color = getRarityColor(achievement.rarity);
    const glow = achievement.is_unlocked ? getRarityGlow(achievement.rarity) : "none";

    return (
        <div
            className={`
        p-4 rounded-2xl border text-center transition-all
        ${achievement.is_unlocked
                    ? "bg-[var(--dark-secondary)] border-opacity-50"
                    : "bg-[var(--dark-surface)]/50 border-[var(--dark-border)] opacity-40 grayscale"
                }
      `}
            style={{
                borderColor: achievement.is_unlocked ? `${color}50` : undefined,
                boxShadow: glow,
            }}
        >
            <div className="text-3xl mb-2">{achievement.icon}</div>
            <h4 className="text-sm font-semibold mb-0.5">{achievement.title}</h4>
            <p className="text-xs text-[var(--text-muted)]">{achievement.description}</p>
            <div className="mt-2 text-xs font-medium" style={{ color }}>
                {achievement.rarity.toUpperCase()}
            </div>
        </div>
    );
}
