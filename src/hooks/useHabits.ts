"use client";

import { useState, useCallback } from "react";
import { Habit } from "@/types/habit";

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchHabits = useCallback(async () => {
        try {
            setLoading(true);
            // TODO: Fetch from Supabase
            setHabits([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const addHabit = useCallback(async (habit: Omit<Habit, "id" | "user_id" | "created_at" | "current_streak" | "longest_streak" | "completed_today" | "completions">) => {
        const newHabit: Habit = {
            ...habit,
            id: Date.now().toString(),
            user_id: "",
            current_streak: 0,
            longest_streak: 0,
            completed_today: false,
            completions: [],
            created_at: new Date().toISOString(),
        };
        setHabits((prev) => [newHabit, ...prev]);
        // TODO: Save to Supabase
    }, []);

    const completeHabit = useCallback(async (habitId: string) => {
        setHabits((prev) =>
            prev.map((h) => {
                if (h.id !== habitId) return h;
                const newStreak = h.current_streak + 1;
                return {
                    ...h,
                    completed_today: true,
                    current_streak: newStreak,
                    longest_streak: Math.max(h.longest_streak, newStreak),
                };
            })
        );
        // TODO: Update in Supabase and award XP
    }, []);

    return { habits, loading, fetchHabits, addHabit, completeHabit };
}
