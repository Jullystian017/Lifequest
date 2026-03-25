import { StatKey } from "./user";

export type HabitCategory = "coding" | "learning" | "health" | "communication" | "devops";

export interface Habit {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    icon?: string;
    category?: HabitCategory;
    frequency: HabitFrequency;
    stat_reward: StatKey;
    xp_per_completion: number;
    current_streak: number;
    longest_streak: number;
    completed_today: boolean;
    completions: HabitCompletion[];
    created_at: string;
}

export interface HabitCompletion {
    id: string;
    habit_id: string;
    completed_at: string;
}

export type HabitFrequency = "daily" | "weekly" | "custom";
