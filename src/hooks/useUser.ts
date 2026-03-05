"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile, CharacterStats } from "@/types/user";

const DEFAULT_STATS: CharacterStats = {
    health: 50,
    knowledge: 50,
    discipline: 50,
    finance: 50,
    creativity: 50,
};

const DEFAULT_USER: UserProfile = {
    id: "",
    username: "Adventurer",
    email: "",
    level: 1,
    xp: 0,
    xp_to_next_level: 100,
    coins: 0,
    stats: DEFAULT_STATS,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

export function useUser() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            // TODO: Replace with Supabase auth + profile fetch
            // For now, use default user for development
            setUser(DEFAULT_USER);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch user");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const updateStats = useCallback(
        (statUpdates: Partial<CharacterStats>) => {
            if (!user) return;
            setUser({
                ...user,
                stats: { ...user.stats, ...statUpdates },
                updated_at: new Date().toISOString(),
            });
        },
        [user]
    );

    const addXP = useCallback(
        (amount: number) => {
            if (!user) return;
            const newXP = user.xp + amount;
            // TODO: Handle level up logic
            setUser({
                ...user,
                xp: newXP,
                updated_at: new Date().toISOString(),
            });
        },
        [user]
    );

    return { user, loading, error, updateStats, addXP, refetch: fetchUser };
}
