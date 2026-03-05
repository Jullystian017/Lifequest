/**
 * LifeQuest - Achievement Checking System
 */

import { Achievement, AchievementRarity } from "@/types/achievement";

/** Default achievement definitions */
export const DEFAULT_ACHIEVEMENTS: Omit<Achievement, "is_unlocked" | "unlocked_at">[] = [
    {
        id: "7_day_streak",
        title: "7 Day Streak",
        description: "Complete habits for 7 days in a row",
        icon: "🔥",
        category: "streak",
        requirement: { type: "streak", value: 7 },
        xp_reward: 200,
        coin_reward: 50,
        rarity: "common",
    },
    {
        id: "30_day_streak",
        title: "Unstoppable",
        description: "Complete habits for 30 days in a row",
        icon: "⚡",
        category: "streak",
        requirement: { type: "streak", value: 30 },
        xp_reward: 1000,
        coin_reward: 200,
        rarity: "epic",
    },
    {
        id: "early_bird",
        title: "Early Bird",
        description: "Complete 5 tasks before 9 AM",
        icon: "🌅",
        category: "productivity",
        requirement: { type: "tasks_completed", value: 5 },
        xp_reward: 150,
        coin_reward: 30,
        rarity: "common",
    },
    {
        id: "task_master",
        title: "Task Master",
        description: "Complete 100 tasks",
        icon: "⚔️",
        category: "productivity",
        requirement: { type: "tasks_completed", value: 100 },
        xp_reward: 500,
        coin_reward: 100,
        rarity: "rare",
    },
    {
        id: "study_champion",
        title: "Study Champion",
        description: "Complete 50 study-related tasks",
        icon: "📚",
        category: "knowledge",
        requirement: { type: "tasks_completed", value: 50 },
        xp_reward: 400,
        coin_reward: 80,
        rarity: "rare",
    },
    {
        id: "money_saver",
        title: "Money Saver",
        description: "Complete 30 finance-related tasks",
        icon: "💰",
        category: "finance",
        requirement: { type: "tasks_completed", value: 30 },
        xp_reward: 350,
        coin_reward: 150,
        rarity: "rare",
    },
    {
        id: "level_10",
        title: "Achiever",
        description: "Reach Level 10",
        icon: "🏆",
        category: "special",
        requirement: { type: "level_reached", value: 10 },
        xp_reward: 500,
        coin_reward: 100,
        rarity: "epic",
    },
    {
        id: "level_20",
        title: "Grand Master",
        description: "Reach Level 20",
        icon: "👑",
        category: "special",
        requirement: { type: "level_reached", value: 20 },
        xp_reward: 2000,
        coin_reward: 500,
        rarity: "legendary",
    },
];

/** Get rarity color */
export function getRarityColor(rarity: AchievementRarity): string {
    const colors: Record<AchievementRarity, string> = {
        common: "#94A3B8",
        rare: "#3B82F6",
        epic: "#8B5CF6",
        legendary: "#F59E0B",
    };
    return colors[rarity];
}

/** Get rarity glow */
export function getRarityGlow(rarity: AchievementRarity): string {
    const glows: Record<AchievementRarity, string> = {
        common: "0 0 10px rgba(148, 163, 184, 0.3)",
        rare: "0 0 15px rgba(59, 130, 246, 0.4)",
        epic: "0 0 20px rgba(139, 92, 246, 0.5)",
        legendary: "0 0 25px rgba(245, 158, 11, 0.6)",
    };
    return glows[rarity];
}
