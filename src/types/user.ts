export type DevClass = "frontend" | "backend" | "devops" | "fullstack";

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    avatar_url?: string;
    class?: DevClass;
    level: number;
    xp: number;
    xp_to_next_level: number;
    coins: number;
    stats: CharacterStats;
    created_at: string;
    updated_at: string;
}

export interface CharacterStats {
    vitality: number;
    knowledge: number;
    discipline: number;
    creativity: number;
}

export type StatKey = keyof CharacterStats;
