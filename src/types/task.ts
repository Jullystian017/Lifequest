import { StatKey } from "./user";

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    xp_reward: number;
    stat_reward: StatKey;
    is_completed: boolean;
    completed_at?: string;
    due_date?: string;
    created_at: string;
}

export type TaskCategory =
    | "study"
    | "health"
    | "work"
    | "creative"
    | "finance"
    | "personal";

export type TaskPriority = "low" | "medium" | "high" | "urgent";
