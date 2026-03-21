"use client";

import { useEffect, useState } from "react";
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
import { useGoalStore } from "@/store/goalStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { createClient } from "@/lib/supabase/client";

import {
  Heart,
  BookOpen,
  Dumbbell,
  PiggyBank,
  Palette,
  Loader2
} from "lucide-react";

export default function DashboardPage() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { stats, addXp, addCoins, updateStat, setUserProfile } = useUserStatsStore();
  const { quests, setQuests, completeQuest } = useQuestStore();
  const { habits, setHabits } = useHabitStore();
  const { goals, setGoals } = useGoalStore();
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const activeQuests = quests.filter(q => q.workspaceId === (activeWorkspaceId || 'personal-1'));

  useEffect(() => {
    async function loadBackendData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          window.location.href = "/login";
          return;
      }

      // 1. Fetch real Quests from Supabase
      const { data: fetchedQuests } = await supabase
        .from('quests')
        .select('*')
        .eq('workspace_id', activeWorkspaceId || 'personal-1')
        .order('created_at', { ascending: false });
        
      if (fetchedQuests) setQuests(fetchedQuests);

      // 2. Fetch real Habits from Supabase
      const { data: fetchedHabits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);
        
      if (fetchedHabits) setHabits(fetchedHabits);

      // 3. Fetch real Goals & Milestones from Supabase
      const { data: fetchedGoals } = await supabase
        .from('goals')
        .select('*, milestones:goal_milestones(*)')
        .eq('user_id', user.id);
        
      if (fetchedGoals) setGoals(fetchedGoals);

      // 4. Fetch User Profile
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (userData && !error) {
          setUserProfile({
              username: userData.username || user.user_metadata?.username || "Adventurer",
              avatar_url: userData.avatar_url || user.user_metadata?.avatar_url || "/lifequest.png",
              level: userData.level || 1,
              xp: userData.xp || 0,
              coins: userData.gold || 0
          });
      } else {
          // Fallback if public.users row doesn't exist yet
          setUserProfile({
              username: user.user_metadata?.username || "Adventurer",
              avatar_url: user.user_metadata?.avatar_url || "/lifequest.png",
              level: 1,
              xp: 0,
              coins: 0
          });
      }

      setLoading(false);
    }
    
    loadBackendData();
  }, [activeWorkspaceId, setQuests, setHabits, setGoals]);

  const handleCompleteQuest = async (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.is_completed) return;

    // Optimistic UI Update in Zustand
    completeQuest(questId);
    if (quest.xp_reward) addXp(quest.xp_reward);
    if (quest.coin_reward) addCoins(quest.coin_reward);

    if (quest.stat_rewards) {
      Object.entries(quest.stat_rewards).forEach(([stat, amount]) => {
        updateStat(stat as any, amount);
      });
    }

    // Persist to Real Backend
    await supabase.from('quests').update({ 
         is_completed: true,
         completed_at: new Date().toISOString()
    }).eq('id', questId);
  };

  if (loading) {
      return (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
              <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
              <p className="text-sm font-semibold uppercase tracking-widest">Memuat Data Server...</p>
          </div>
      );
  }

  return (
    <div className="space-y-8 pb-20 animate-fade-in w-full">
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
          <DailyQuestPanel quests={activeQuests} onCompleteQuest={handleCompleteQuest} />
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
