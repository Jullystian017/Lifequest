import { StatKey } from "./user";

export type QuestCategory = "general" | "feature" | "bugfix" | "refactor" | "devops" | "documentation" | "review" | "testing" | "planning";
export type QuestStatus = "todo" | "in_progress" | "in_review" | "done";

export interface QuestTask {
    id: string;
    title: string;
    is_completed: boolean;
}

export interface Quest {
    id: string;
    workspaceId: string;
    assigneeId?: string;
    title: string;
    description: string;
    status: QuestStatus;
    type: QuestType;
    category?: QuestCategory;
    difficulty: QuestDifficulty;
    priority: QuestPriority;
    xp_reward: number;
    coin_reward: number;
    stat_rewards: Partial<Record<StatKey, number>>;
    target_value: number;
    current_value: number;
    is_completed: boolean;
    is_archived: boolean;
    tasks?: QuestTask[];
    expires_at?: string;
    completed_at?: string;
    created_at: string;
}

export type QuestType = "daily" | "weekly" | "story" | "ai_generated";
export type QuestDifficulty = "easy" | "medium" | "hard" | "extreme";
export type QuestPriority = "low" | "medium" | "high" | "urgent";
