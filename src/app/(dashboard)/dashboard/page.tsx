"use client";

import AttributeCard from "@/components/dashboard/AttributeCard";
import DailyQuestPanel from "@/components/dashboard/DailyQuestPanel";
import ProductivityTrendsWidget from "@/components/dashboard/ProductivityTrendsWidget";
import ActiveStreaksWidget from "@/components/dashboard/ActiveStreaksWidget";
import RecentActivityWidget from "@/components/dashboard/RecentActivityWidget";
import AIInsightWidget from "@/components/dashboard/AIInsightWidget";
import GoalPlannerWidget from "@/components/dashboard/GoalPlannerWidget";

import { useUserStatsStore } from "@/store/userStatsStore";
import { useQuestStore } from "@/store/questStore";
import { useHabitStore } from "@/store/habitStore";
import { Quest } from "@/types/quest";
import { Habit } from "@/types/habit";
import { useEffect } from "react";
import {
  Heart,
  BookOpen,
  Dumbbell,
  PiggyBank,
  Palette
} from "lucide-react";

// Initial Mock Data
const INITIAL_QUESTS: Quest[] = [
  {
    id: "q1",
    title: "Study React Basics",
    description: "Dive deep into the core concepts of React.js to build a solid foundation.",
    difficulty: "medium",
    priority: "medium",
    xp_reward: 120,
    coin_reward: 30,
    current_value: 0,
    target_value: 1,
    is_completed: false,
    type: "daily",
    stat_rewards: { knowledge: 10 },
    tasks: [
      { id: "t1", title: "Review JSX syntax", is_completed: true },
      { id: "t2", title: "Install React DevTools", is_completed: true },
      { id: "t3", title: "Understand props vs state", is_completed: false },
      { id: "t4", title: "Build first functional component", is_completed: false },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: "q2",
    title: "Workout 30 Minutes",
    description: "Keep your physical stats high with a quick session.",
    difficulty: "hard",
    priority: "high",
    xp_reward: 250,
    coin_reward: 50,
    current_value: 0,
    target_value: 1,
    is_completed: false,
    type: "daily",
    stat_rewards: { health: 15, discipline: 5 },
    tasks: [
      { id: "t5", title: "10 min Warm up", is_completed: false },
      { id: "t6", title: "20 min Strength training", is_completed: false },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: "q3",
    title: "Read 20 Pages",
    description: "Expand your knowledge through consistent reading.",
    difficulty: "easy",
    priority: "low",
    xp_reward: 90,
    coin_reward: 15,
    current_value: 0,
    target_value: 1,
    is_completed: false,
    type: "daily",
    stat_rewards: { knowledge: 5 },
    tasks: [
      { id: "t7", title: "Select a book", is_completed: true },
      { id: "t8", title: "Read for 20 mins", is_completed: false },
    ],
    created_at: new Date().toISOString(),
  },
];

const INITIAL_HABITS: Habit[] = [
  { id: "h1", user_id: "u1", title: "Morning Reading", description: "15 mins daily", frequency: "daily", stat_reward: "knowledge", xp_per_completion: 50, current_streak: 12, longest_streak: 20, completed_today: true, completions: [], created_at: new Date().toISOString() },
  { id: "h3", user_id: "u1", title: "No Junk Food", description: "All day", frequency: "daily", stat_reward: "health", xp_per_completion: 30, current_streak: 21, longest_streak: 30, completed_today: true, completions: [], created_at: new Date().toISOString() },
];

export default function DashboardPage() {
  const { stats, addXp, addCoins, updateStat } = useUserStatsStore();
  const { quests, setQuests, completeQuest } = useQuestStore();
  const { habits, setHabits } = useHabitStore();

  useEffect(() => {
    if (quests.length === 0) setQuests(INITIAL_QUESTS);
    if (habits.length === 0) setHabits(INITIAL_HABITS);
  }, [quests.length, habits.length, setQuests, setHabits]);

  const handleCompleteQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.is_completed) return;

    completeQuest(questId);
    addXp(quest.xp_reward);
    addCoins(quest.coin_reward);

    if (quest.stat_rewards) {
      Object.entries(quest.stat_rewards).forEach(([stat, amount]) => {
        updateStat(stat as any, amount);
      });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-fade-in">
      {/* 1. Attributes Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <AttributeCard
          label="Vitality"
          shortLabel="HP"
          value={stats.health}
          icon={<Heart size={16} />}
          color="var(--health)"
          subtitle="Rest recommended in 4h"
        />
        <AttributeCard
          label="Intelligence"
          shortLabel="INT"
          value={stats.knowledge}
          icon={<BookOpen size={16} />}
          color="var(--knowledge)"
          subtitle="Next level in 140 XP"
        />
        <AttributeCard
          label="Discipline"
          shortLabel="DIS"
          value={stats.discipline}
          icon={<Dumbbell size={16} />}
          color="var(--discipline)"
          subtitle="High Focus State"
        />
        <AttributeCard
          label="Finance"
          shortLabel="FIN"
          value={stats.finance}
          icon={<PiggyBank size={16} />}
          color="var(--finance)"
          subtitle="Savings goal: 24% met"
        />
        <AttributeCard
          label="Creativity"
          shortLabel="CRT"
          value={stats.creativity}
          icon={<Palette size={16} />}
          color="var(--creativity)"
          subtitle="Inspire phase active"
        />
      </div>

      {/* 2. Main content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (Wide) */}
        <div className="lg:col-span-8 space-y-10">
          <GoalPlannerWidget />
          <ProductivityTrendsWidget />
          <DailyQuestPanel quests={quests} onCompleteQuest={handleCompleteQuest} />
        </div>

        {/* Right Column (Narrow) */}
        <div className="lg:col-span-4 space-y-10">
          <AIInsightWidget />
          <ActiveStreaksWidget />
          <RecentActivityWidget />
        </div>
      </div>
    </div>
  );
}
