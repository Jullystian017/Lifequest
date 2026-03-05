"use client";

import { useState } from "react";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import Button from "@/components/ui/Button";
import { LeaderboardCategory } from "@/types/leaderboard";

const categories: { key: LeaderboardCategory; label: string; icon: string }[] = [
    { key: "most_productive", label: "Most Productive", icon: "⚡" },
    { key: "highest_level", label: "Highest Level", icon: "👑" },
    { key: "longest_streak", label: "Longest Streak", icon: "🔥" },
];

export default function LeaderboardPage() {
    const [activeCategory, setActiveCategory] =
        useState<LeaderboardCategory>("most_productive");

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                    👑 Leaderboard
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    See how you rank among other adventurers
                </p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2">
                {categories.map((cat) => (
                    <Button
                        key={cat.key}
                        variant={activeCategory === cat.key ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveCategory(cat.key)}
                    >
                        {cat.icon} {cat.label}
                    </Button>
                ))}
            </div>

            <LeaderboardTable entries={[]} />
        </div>
    );
}
