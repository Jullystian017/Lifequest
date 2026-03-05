export interface LeaderboardEntry {
    rank: number;
    user_id: string;
    username: string;
    avatar_url?: string;
    level: number;
    xp: number;
    streak: number;
    tasks_completed: number;
}

export type LeaderboardCategory =
    | "most_productive"
    | "highest_level"
    | "longest_streak";

export interface LeaderboardState {
    category: LeaderboardCategory;
    entries: LeaderboardEntry[];
    userRank?: number;
}
