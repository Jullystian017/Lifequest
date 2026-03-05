"use client";

import { useState, useCallback } from "react";
import { LeaderboardEntry, LeaderboardCategory, LeaderboardState } from "@/types/leaderboard";

export function useLeaderboard() {
    const [state, setState] = useState<LeaderboardState>({
        category: "most_productive",
        entries: [],
        userRank: undefined,
    });
    const [loading, setLoading] = useState(false);

    const fetchLeaderboard = useCallback(
        async (category: LeaderboardCategory) => {
            try {
                setLoading(true);
                // TODO: Fetch from Supabase
                setState({ category, entries: [], userRank: undefined });
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const changeCategory = useCallback(
        (category: LeaderboardCategory) => {
            fetchLeaderboard(category);
        },
        [fetchLeaderboard]
    );

    return { ...state, loading, fetchLeaderboard, changeCategory };
}
