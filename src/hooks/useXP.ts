"use client";

import { useState, useCallback } from "react";
import { getLevelFromXP } from "@/lib/gamification/xp";

export function useXP() {
    const [totalXP, setTotalXP] = useState(0);

    const levelInfo = getLevelFromXP(totalXP);

    const addXP = useCallback((amount: number) => {
        setTotalXP((prev) => prev + amount);
        // TODO: Trigger level up animation if level changed
        // TODO: Persist to Supabase
    }, []);

    return {
        totalXP,
        level: levelInfo.level,
        currentXP: levelInfo.currentXP,
        xpToNext: levelInfo.xpToNext,
        progress: levelInfo.progress,
        addXP,
    };
}
