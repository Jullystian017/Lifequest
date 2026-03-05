"use client";

import { useState, useCallback } from "react";
import { Quest } from "@/types/quest";

export function useQuests() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchQuests = useCallback(async () => {
        try {
            setLoading(true);
            // TODO: Fetch from Supabase
            setQuests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const completeQuest = useCallback(
        async (questId: string) => {
            setQuests((prev) =>
                prev.map((q) => (q.id === questId ? { ...q, is_completed: true } : q))
            );
            // TODO: Award XP and coins via Supabase
        },
        []
    );

    const updateQuestProgress = useCallback(
        (questId: string, value: number) => {
            setQuests((prev) =>
                prev.map((q) =>
                    q.id === questId ? { ...q, current_value: value } : q
                )
            );
        },
        []
    );

    return { quests, loading, fetchQuests, completeQuest, updateQuestProgress };
}
