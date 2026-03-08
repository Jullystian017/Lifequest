export interface BossTask {
    id: string;
    title: string;
    is_completed: boolean;
    damage: number; // HP removed from Boss when completed
    assigneeId?: string;
    assigneeName?: string;
    assigneeAvatar?: string;
}

export interface BossReward {
    xp: number;
    coins: number;
    badge?: string;
    item?: string;
}

export type BossDifficulty = 'easy' | 'medium' | 'hard' | 'epic';
export type BossStatus = 'active' | 'upcoming' | 'defeated';

export interface Boss {
    id: string;
    workspaceId: string; // "personal-1", "team-1", etc.
    name: string;
    description: string;
    avatar_url?: string;
    max_hp: number;
    current_hp: number;
    difficulty: BossDifficulty;
    status: BossStatus;
    deadline?: string;
    tasks: BossTask[];
    rewards: BossReward;
    created_at: string;
}
