export interface UserProfile {
    id: string;
    username: string;
    email: string;
    avatar_url?: string;
    level: number;
    xp: number;
    xp_to_next_level: number;
    coins: number;
    stats: CharacterStats;
    created_at: string;
    updated_at: string;
}

export interface CharacterStats {
    health: number;
    knowledge: number;
    discipline: number;
    finance: number;
    creativity: number;
}

export type StatKey = keyof CharacterStats;
