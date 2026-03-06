"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AttributeCard from "@/components/dashboard/AttributeCard";
import DailyQuestPanel from "@/components/dashboard/DailyQuestPanel";
import AIQuestBanner from "@/components/dashboard/AIQuestBanner";
import ProductivityTrendsWidget from "@/components/dashboard/ProductivityTrendsWidget";
import ActiveStreaksWidget from "@/components/dashboard/ActiveStreaksWidget";
import MilestonesWidget from "@/components/dashboard/MilestonesWidget";
import { CharacterStats } from "@/types/user";
import { Quest } from "@/types/quest";
import {
  Heart,
  BookOpen,
  Dumbbell,
  PiggyBank,
  Palette
} from "lucide-react";

// Rich Mock Data
const mockStats: CharacterStats = {
  health: 75,
  knowledge: 60,
  discipline: 80,
  finance: 45,
  creativity: 50,
};

const mockQuests: Quest[] = [
  {
    id: "q1",
    title: "Study JavaScript",
    description: "Learn about ES6 features and more.",
    difficulty: "medium",
    xp_reward: 250,
    coin_reward: 50,
    current_value: 0,
    target_value: 1,
    is_completed: false,
    type: "daily",
    stat_rewards: { knowledge: 2 },
    created_at: new Date().toISOString(),
  },
  {
    id: "q2",
    title: "Drink 2L Water",
    description: "Stay hydrated for better health.",
    difficulty: "easy",
    xp_reward: 100,
    coin_reward: 20,
    current_value: 1.5,
    target_value: 2,
    is_completed: false,
    type: "daily",
    stat_rewards: { health: 1 },
    created_at: new Date().toISOString(),
  },
  {
    id: "q3",
    title: "Workout 30 mins",
    description: "Physical strength is key.",
    difficulty: "hard",
    xp_reward: 300,
    coin_reward: 75,
    current_value: 0,
    target_value: 1,
    is_completed: false,
    type: "daily",
    stat_rewards: { health: 5, discipline: 2 },
    created_at: new Date().toISOString(),
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-fade-in">
      {/* 1. Header Section */}
      <DashboardHeader
        username="Alex"
        questCount={3}
        currentXp={1240}
        maxXp={1500}
      />

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column (Wide) */}
        <div className="lg:col-span-8 space-y-10">

          {/* Attributes Horizontal Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <AttributeCard
              label="Health"
              shortLabel="HP"
              value={mockStats.health}
              icon={<Heart size={16} />}
              color="var(--health)"
            />
            <AttributeCard
              label="Knowledge"
              shortLabel="INT"
              value={mockStats.knowledge}
              icon={<BookOpen size={16} />}
              color="var(--knowledge)"
            />
            <AttributeCard
              label="Discipline"
              shortLabel="DIS"
              value={mockStats.discipline}
              icon={<Dumbbell size={16} />}
              color="var(--discipline)"
            />
            <AttributeCard
              label="Finance"
              shortLabel="FIN"
              value={mockStats.finance}
              icon={<PiggyBank size={16} />}
              color="var(--finance)"
            />
            <AttributeCard
              label="Creativity"
              shortLabel="CRT"
              value={mockStats.creativity}
              icon={<Palette size={16} />}
              color="var(--creativity)"
            />
          </div>

          {/* AI Banner */}
          <AIQuestBanner />

          {/* Productivity Trends */}
          <ProductivityTrendsWidget />

          {/* Daily Quest Log */}
          <DailyQuestPanel quests={mockQuests} />
        </div>

        {/* Right Column (Narrow) */}
        <div className="lg:col-span-4 space-y-10">
          <ActiveStreaksWidget />
          <MilestonesWidget />

          {/* Subtle Tip / Info Card */}
          <div className="p-6 rounded-3xl bg-[var(--bg-sidebar)] border border-dashed border-[var(--border-light)] flex flex-col items-center text-center gap-3 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Pro Tip</p>
              <p className="text-[10px] leading-relaxed">Completing habits early in the morning grants a 1.2x XP multiplier!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
