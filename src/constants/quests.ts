/**
 * LifeQuest for Developers - Default Quest Templates
 */

import { Quest } from "@/types/quest";

/** Daily quest templates */
export const DAILY_QUEST_TEMPLATES: Omit<Quest, "id" | "created_at" | "current_value" | "is_completed" | "is_archived" | "workspaceId" | "assigneeId" | "completed_at" | "status" | "category">[] = [
    {
        title: "Push Code Today",
        description: "Make at least one commit and push to your repository",
        type: "daily",
        difficulty: "easy",
        xp_reward: 50,
        coin_reward: 10,
        stat_rewards: { discipline: 2 },
        target_value: 1,
        priority: 'medium',
    },
    {
        title: "Write or Update Tests",
        description: "Write new tests or update existing ones for your codebase",
        type: "daily",
        difficulty: "medium",
        xp_reward: 80,
        coin_reward: 15,
        stat_rewards: { knowledge: 3 },
        target_value: 1,
        priority: 'high',
    },
    {
        title: "Fix a Bug",
        description: "Hunt down and squash at least one bug",
        type: "daily",
        difficulty: "medium",
        xp_reward: 70,
        coin_reward: 12,
        stat_rewards: { vitality: 2, discipline: 1 },
        target_value: 1,
        priority: 'high',
    },
    {
        title: "Code Review",
        description: "Review a pull request or someone's code",
        type: "daily",
        difficulty: "easy",
        xp_reward: 40,
        coin_reward: 8,
        stat_rewards: { knowledge: 2, creativity: 1 },
        target_value: 1,
        priority: 'medium',
    },
    {
        title: "Read Tech Docs",
        description: "Spend 30 minutes reading documentation or tech articles",
        type: "daily",
        difficulty: "easy",
        xp_reward: 35,
        coin_reward: 6,
        stat_rewards: { knowledge: 2 },
        target_value: 1,
        priority: 'low',
    },
    {
        title: "Refactor a Module",
        description: "Clean up and improve code quality in an existing module",
        type: "daily",
        difficulty: "hard",
        xp_reward: 100,
        coin_reward: 20,
        stat_rewards: { discipline: 3, creativity: 2 },
        target_value: 1,
        priority: 'medium',
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
