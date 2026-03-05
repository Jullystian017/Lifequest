"use client";

import AchievementGrid from "@/components/achievement/AchievementGrid";
import { DEFAULT_ACHIEVEMENTS } from "@/lib/gamification/achievements";
import { Achievement } from "@/types/achievement";

export default function AchievementsPage() {
    // For development, mark first 2 as unlocked
    const achievements: Achievement[] = DEFAULT_ACHIEVEMENTS.map((a, i) => ({
        ...a,
        is_unlocked: i < 2,
        unlocked_at: i < 2 ? new Date().toISOString() : undefined,
    }));

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                    🏆 Achievements
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    Unlock badges by reaching milestones
                </p>
            </div>

            <AchievementGrid achievements={achievements} />
        </div>
    );
}
