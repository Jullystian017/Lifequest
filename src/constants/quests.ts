/**
 * LifeQuest - Default Quest Templates
 */

import { Quest } from "@/types/quest";

/** Daily quest templates */
export const DAILY_QUEST_TEMPLATES: Omit<Quest, "id" | "created_at" | "current_value" | "is_completed">[] = [
    {
        title: "Complete 3 Tasks",
        description: "Finish any 3 tasks from your task list",
        type: "daily",
        difficulty: "easy",
        xp_reward: 50,
        coin_reward: 10,
        stat_rewards: { discipline: 2 },
        target_value: 3,
        priority: 'medium',
    },
    {
        title: "Study for 1 Hour",
        description: "Dedicate 1 hour to learning something new",
        type: "daily",
        difficulty: "medium",
        xp_reward: 80,
        coin_reward: 15,
        stat_rewards: { knowledge: 3 },
        target_value: 1,
        priority: 'high',
    },
    {
        title: "Drink 2L Water",
        description: "Stay hydrated by drinking at least 2 liters of water",
        type: "daily",
        difficulty: "easy",
        xp_reward: 30,
        coin_reward: 5,
        stat_rewards: { health: 2 },
        target_value: 2,
        priority: 'medium',
    },
    {
        title: "Read 10 Pages",
        description: "Read at least 10 pages of any book",
        type: "daily",
        difficulty: "easy",
        xp_reward: 40,
        coin_reward: 8,
        stat_rewards: { knowledge: 2, creativity: 1 },
        target_value: 10,
        priority: 'medium',
    },
    {
        title: "30 Min Workout",
        description: "Exercise for at least 30 minutes",
        type: "daily",
        difficulty: "medium",
        xp_reward: 70,
        coin_reward: 12,
        stat_rewards: { health: 4 },
        target_value: 1,
        priority: 'high',
    },
    {
        title: "Save Money Today",
        description: "Track and save at least some money today",
        type: "daily",
        difficulty: "easy",
        xp_reward: 35,
        coin_reward: 20,
        stat_rewards: { finance: 3 },
        target_value: 1,
        priority: 'low',
    },
];

/** Weekly boss challenge templates */
export const BOSS_TEMPLATES = [
    {
        name: "Procrastination Monster",
        description: "Defeat by completing 20 tasks this week",
        target: 20,
        xp_reward: 1000,
        badge: "Procrastination Slayer",
    },
    {
        name: "Laziness Dragon",
        description: "Defeat by maintaining all habits for 7 days",
        target: 7,
        xp_reward: 1200,
        badge: "Dragon Slayer",
    },
    {
        name: "Distraction Phantom",
        description: "Defeat by completing 5 study sessions this week",
        target: 5,
        xp_reward: 800,
        badge: "Focus Master",
    },
];
