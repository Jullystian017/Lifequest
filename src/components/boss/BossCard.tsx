"use client";

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

interface BossCardProps {
    name: string;
    description: string;
    currentProgress: number;
    target: number;
    xpReward: number;
    badge: string;
    isDefeated?: boolean;
}

export default function BossCard({
    name,
    description,
    currentProgress,
    target,
    xpReward,
    badge,
    isDefeated = false,
}: BossCardProps) {
    return (
        <Card className={`relative overflow-hidden ${isDefeated ? "opacity-60" : ""}`}>
            {/* Boss Icon */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-purple-600/20 border-2 border-red-500/30 flex items-center justify-center text-3xl flex-shrink-0">
                    {isDefeated ? "💀" : "👹"}
                </div>
                <div>
                    <h3 className="font-bold text-lg font-[family-name:var(--font-heading)]">
                        {name}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">{description}</p>
                </div>
            </div>

            {/* Progress */}
            <ProgressBar
                value={currentProgress}
                max={target}
                color={isDefeated ? "var(--secondary)" : "#EF4444"}
                showLabel
                label="Boss HP"
                height="lg"
            />

            {/* Rewards */}
            <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-[var(--text-muted)]">
                    Reward: <span className="text-[var(--accent)] font-medium">+{xpReward} XP</span>
                </span>
                <span className="text-[var(--primary-light)]">🏅 {badge}</span>
            </div>

            {isDefeated && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                    <span className="text-2xl font-bold text-[var(--secondary)] font-[family-name:var(--font-heading)]">
                        ✅ DEFEATED
                    </span>
                </div>
            )}
        </Card>
    );
}
