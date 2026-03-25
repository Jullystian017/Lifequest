export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: AchievementCategory;
    requirement: AchievementRequirement;
    xp_reward: number;
    coin_reward: number;
    is_unlocked: boolean;
    unlocked_at?: string;
    rarity: AchievementRarity;
}

export interface AchievementRequirement {
    type: "streak" | "tasks_completed" | "level_reached" | "xp_earned" | "quests_completed" | "habit_streak";
    value: number;
}

export type AchievementCategory =
    | "streak"
    | "productivity"
    | "vitality"
    | "knowledge"
    | "finance"
    | "special";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";
