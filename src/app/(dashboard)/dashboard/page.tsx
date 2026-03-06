"use client";

import CharacterCard from "@/components/dashboard/CharacterCard";
import XPBar from "@/components/dashboard/XPBar";
import StatsRadar from "@/components/dashboard/StatsRadar";
import DailyQuestPanel from "@/components/dashboard/DailyQuestPanel";
import ProgressChart from "@/components/dashboard/ProgressChart";
import QuickActions from "@/components/dashboard/QuickActions";
import { CharacterStats } from "@/types/user";
import { Quest } from "@/types/quest";
import { Coins, Flame, Star } from "lucide-react";

// Rich Mock Data for UI/UX demonstration
const mockStats: CharacterStats = {
  health: 82,
  knowledge: 65,
  discipline: 88,
  finance: 42,
  creativity: 55,
};

const mockQuests: Quest[] = [
  {
    id: "q1",
    title: "The Scholar's Path",
    description: "Read 10 pages of any non-fiction book.",
    difficulty: "easy",
    xp_reward: 50,
    coin_reward: 10,
    current_value: 7,
    target_value: 10,
    is_completed: false,
    type: "daily",
    stat_rewards: { knowledge: 2 },
    created_at: new Date().toISOString(),
  },
  {
    id: "q2",
    title: "Iron Core",
    description: "Complete a 20-minute core workout session.",
    difficulty: "medium",
    xp_reward: 120,
    coin_reward: 25,
    current_value: 20,
    target_value: 20,
    is_completed: true,
    type: "daily",
    stat_rewards: { health: 4 },
    created_at: new Date().toISOString(),
  },
  {
    id: "q3",
    title: "Digital Architect",
    description: "Design one UI component from scratch.",
    difficulty: "hard",
    xp_reward: 250,
    coin_reward: 50,
    current_value: 0,
    target_value: 1,
    is_completed: false,
    type: "daily",
    stat_rewards: { creativity: 5 },
    created_at: new Date().toISOString(),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)]">
            Morning, <span className="text-[var(--primary)]">Alex</span>!
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 flex items-center gap-2">
            <Flame size={16} className="text-orange-500" /> 
            You're on a 7-day streak! Keep it up.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[var(--dark-secondary)] p-3 rounded-2xl border border-[var(--dark-border)]">
          <div className="flex items-center gap-2 px-3 border-r border-[var(--dark-border)]">
            <Coins size={18} className="text-yellow-500" />
            <span className="font-bold">1,240</span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={18} className="text-[var(--primary)]" />
            <span className="font-bold text-[var(--text-secondary)]">Master tier</span>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <XPBar currentXP={1240} maxXP={1500} level={12} />
        </div>
        <div className="hidden md:block">
           <div className="h-full flex items-center justify-end">
             <span className="text-xs text-[var(--text-muted)] animate-pulse">Leveling up soon...</span>
           </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          <DailyQuestPanel quests={mockQuests} />
          <ProgressChart />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <CharacterCard
            username="Alex"
            level={12}
            xp={1240}
            xpToNext={1500}
            stats={mockStats}
          />
          <QuickActions onAction={(type) => console.log("Action:", type)} />
          <StatsRadar stats={mockStats} />
        </div>
      </div>
    </div>
  );
}
