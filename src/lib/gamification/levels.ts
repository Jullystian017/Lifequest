/**
 * LifeQuest - Level Progression System
 */

export interface LevelInfo {
    level: number;
    title: string;
    minXP: number;
    color: string;
}

/** Level titles and thresholds */
export const LEVEL_TIERS: LevelInfo[] = [
    { level: 1, title: "Beginner", minXP: 0, color: "#94A3B8" },
    { level: 3, title: "Novice", minXP: 350, color: "#22C55E" },
    { level: 5, title: "Explorer", minXP: 1_100, color: "#3B82F6" },
    { level: 10, title: "Achiever", minXP: 5_700, color: "#8B5CF6" },
    { level: 15, title: "Warrior", minXP: 24_000, color: "#F59E0B" },
    { level: 20, title: "Master", minXP: 86_000, color: "#EF4444" },
    { level: 25, title: "Champion", minXP: 280_000, color: "#EC4899" },
    { level: 30, title: "Legend", minXP: 880_000, color: "#6366F1" },
];

/** Get the tier info for a given level */
export function getLevelTier(level: number): LevelInfo {
    let tier = LEVEL_TIERS[0];
    for (const t of LEVEL_TIERS) {
        if (level >= t.level) {
            tier = t;
        } else {
            break;
        }
    }
    return tier;
}

/** Get the display title for a level */
export function getLevelTitle(level: number): string {
    return getLevelTier(level).title;
}

/** Get the color for a level */
export function getLevelColor(level: number): string {
    return getLevelTier(level).color;
}
