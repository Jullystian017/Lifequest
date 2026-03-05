"use client";

import CharacterCard from "@/components/dashboard/CharacterCard";
import XPBar from "@/components/dashboard/XPBar";
import StatsRadar from "@/components/dashboard/StatsRadar";
import DailyQuestPanel from "@/components/dashboard/DailyQuestPanel";
import ProgressChart from "@/components/dashboard/ProgressChart";
import { CharacterStats } from "@/types/user";

// Placeholder data for development
const mockStats: CharacterStats = {
    health: 75,
    knowledge: 60,
    discipline: 80,
    finance: 45,
    creativity: 50,
};

export default function DashboardPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                    Dashboard
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    Welcome back, Adventurer! Here&apos;s your quest overview.
                </p>
            </div>

            {/* XP Bar */}
            <XPBar currentXP={1240} maxXP={1500} level={12} />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <DailyQuestPanel quests={[]} />
                    <ProgressChart />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <CharacterCard
                        username="Alex"
                        level={12}
                        xp={1240}
                        xpToNext={1500}
                        stats={mockStats}
                    />
                    <StatsRadar stats={mockStats} />
                </div>
            </div>
        </div>
    );
}
