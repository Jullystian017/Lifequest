import { StatKey } from "./user";

export interface Goal {
    id: string;
    title: string;
    description?: string;
    category: GoalCategory;
    status: GoalStatus;
    priority: GoalPriority;
    progress: number; // 0-100
    milestones: Milestone[];
    stat_rewards: Partial<Record<StatKey, number>>;
    xp_reward: number;
    deadline?: string;
    created_at: string;
}

export interface Milestone {
    id: string;
    goal_id: string;
    title: string;
    is_completed: boolean;
    order: number;
}

export type GoalCategory = "career" | "fitness" | "education" | "finance" | "personal";
export type GoalStatus = "not_started" | "in_progress" | "completed" | "archived";
export type GoalPriority = "low" | "medium" | "high" | "epic";
