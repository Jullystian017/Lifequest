/**
 * LifeQuest - Reward Distribution System
 */

import { StatKey } from "@/types/user";
import { TaskCategory } from "@/types/task";

/** Map task categories to primary stat rewards */
export const CATEGORY_STAT_MAP: Record<TaskCategory, StatKey> = {
    study: "knowledge",
    health: "health",
    work: "discipline",
    creative: "creativity",
    finance: "finance",
    personal: "discipline",
};

/** Stat point rewards by task priority */
export const STAT_POINTS_BY_PRIORITY = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 5,
} as const;

/** Coin rewards */
export const COIN_REWARDS = {
    TASK_COMPLETE: 5,
    QUEST_COMPLETE: 20,
    DAILY_LOGIN: 10,
    STREAK_BONUS: 15,
    BOSS_DEFEAT: 100,
    ACHIEVEMENT_UNLOCK: 50,
} as const;

/** Calculate stat rewards for completing a task */
export function calculateTaskReward(
    category: TaskCategory,
    priority: "low" | "medium" | "high" | "urgent"
): { stat: StatKey; points: number; coins: number; xp: number } {
    const stat = CATEGORY_STAT_MAP[category];
    const points = STAT_POINTS_BY_PRIORITY[priority];
    const xpBase = { low: 15, medium: 25, high: 40, urgent: 60 };

    return {
        stat,
        points,
        coins: COIN_REWARDS.TASK_COMPLETE,
        xp: xpBase[priority],
    };
}
