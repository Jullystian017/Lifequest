"use client";

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { getLevelTitle, getLevelColor } from "@/lib/gamification/levels";
import { CharacterStats } from "@/types/user";

interface CharacterCardProps {
    username: string;
    level: number;
    xp: number;
    xpToNext: number;
    stats: CharacterStats;
    avatarUrl?: string;
}

const statConfig: { key: keyof CharacterStats; label: string; color: string; icon: string }[] = [
    { key: "health", label: "Health", color: "var(--health)", icon: "❤️" },
    { key: "knowledge", label: "Knowledge", color: "var(--knowledge)", icon: "📚" },
    { key: "discipline", label: "Discipline", color: "var(--discipline)", icon: "⚔️" },
    { key: "finance", label: "Finance", color: "var(--finance)", icon: "💰" },
    { key: "creativity", label: "Creativity", color: "var(--creativity)", icon: "🎨" },
];

export default function CharacterCard({
    username,
    level,
    xp,
    xpToNext,
    stats,
    avatarUrl,
}: CharacterCardProps) {
    const levelTitle = getLevelTitle(level);
    const levelColor = getLevelColor(level);

    return (
        <Card className="relative overflow-hidden">
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
                    style={{
                        background: `linear-gradient(135deg, ${levelColor}40, ${levelColor}20)`,
                        border: `2px solid ${levelColor}60`,
                    }}
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={username} className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                        <span>{username.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-heading)]">{username}</h3>
                    <div className="flex items-center gap-2">
                        <Badge label={`Lv. ${level}`} color={levelColor} size="sm" />
                        <span className="text-xs text-[var(--text-muted)]">{levelTitle}</span>
                    </div>
                </div>
            </div>

            {/* XP Bar */}
            <ProgressBar
                value={xp}
                max={xpToNext}
                color={levelColor}
                showLabel
                label="XP"
                height="md"
            />

            {/* Stats */}
            <div className="mt-4 space-y-2.5">
                {statConfig.map((stat) => (
                    <div key={stat.key} className="flex items-center gap-2">
                        <span className="text-sm w-5">{stat.icon}</span>
                        <span className="text-xs text-[var(--text-secondary)] w-20">{stat.label}</span>
                        <div className="flex-1">
                            <ProgressBar
                                value={stats[stat.key]}
                                max={100}
                                color={stat.color}
                                height="sm"
                                showLabel
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
