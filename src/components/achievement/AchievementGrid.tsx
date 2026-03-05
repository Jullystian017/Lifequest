"use client";

import AchievementBadge from "./AchievementBadge";
import { Achievement } from "@/types/achievement";

interface AchievementGridProps {
    achievements: Achievement[];
}

export default function AchievementGrid({ achievements }: AchievementGridProps) {
    const unlocked = achievements.filter((a) => a.is_unlocked);
    const locked = achievements.filter((a) => !a.is_unlocked);

    return (
        <div>
            <p className="text-sm text-[var(--text-muted)] mb-4">
                {unlocked.length} / {achievements.length} Unlocked
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...unlocked, ...locked].map((achievement) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
            </div>
        </div>
    );
}
