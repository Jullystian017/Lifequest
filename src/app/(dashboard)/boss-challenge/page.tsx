"use client";

import BossCard from "@/components/boss/BossCard";
import { BOSS_TEMPLATES } from "@/constants/quests";

export default function BossChallengePage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                    💀 Weekly Boss Challenge
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    Defeat the boss by completing challenges this week
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {BOSS_TEMPLATES.map((boss, i) => (
                    <BossCard
                        key={i}
                        name={boss.name}
                        description={boss.description}
                        currentProgress={0}
                        target={boss.target}
                        xpReward={boss.xp_reward}
                        badge={boss.badge}
                    />
                ))}
            </div>
        </div>
    );
}
