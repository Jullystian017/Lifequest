/**
 * LifeQuest - XP Calculation System
 * Handles XP rewards, multipliers, and calculations
 */

/** Base XP rewards for different actions */
export const XP_REWARDS = {
    TASK_COMPLETE: 25,
    QUEST_COMPLETE_EASY: 50,
    QUEST_COMPLETE_MEDIUM: 100,
    QUEST_COMPLETE_HARD: 200,
    QUEST_COMPLETE_EPIC: 500,
    HABIT_COMPLETE: 15,
    STREAK_BONUS_PER_DAY: 5,
    BOSS_DEFEAT: 1000,
} as const;

/** Calculate streak multiplier */
export function getStreakMultiplier(streakDays: number): number {
    if (streakDays >= 30) return 2.0;
    if (streakDays >= 14) return 1.5;
    if (streakDays >= 7) return 1.25;
    if (streakDays >= 3) return 1.1;
    return 1.0;
}

/** Calculate total XP with multipliers */
export function calculateXP(
    baseXP: number,
    streakDays: number = 0,
    bonusMultiplier: number = 1
): number {
    const streakMult = getStreakMultiplier(streakDays);
    return Math.round(baseXP * streakMult * bonusMultiplier);
}

/** Calculate XP needed for a specific level */
export function xpForLevel(level: number): number {
    // Exponential growth: each level requires more XP
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

/** Calculate current level from total XP */
export function getLevelFromXP(totalXP: number): {
    level: number;
    currentXP: number;
    xpToNext: number;
    progress: number;
} {
    let level = 1;
    let remainingXP = totalXP;

    while (remainingXP >= xpForLevel(level)) {
        remainingXP -= xpForLevel(level);
        level++;
    }

    const xpToNext = xpForLevel(level);
    const progress = (remainingXP / xpToNext) * 100;

    return {
        level,
        currentXP: remainingXP,
        xpToNext,
        progress,
    };
}
