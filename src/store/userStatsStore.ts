import { create } from 'zustand';
import { CharacterStats, StatKey } from '@/types/user';

interface UserStatsState {
    level: number;
    xp: number;
    xpToNextLevel: number;
    coins: number;
    stats: CharacterStats;
    addXp: (amount: number) => void;
    addCoins: (amount: number) => void;
    updateStat: (stat: StatKey, amount: number) => void;
    setLevel: (level: number) => void;
}

export const useUserStatsStore = create<UserStatsState>((set) => ({
    level: 12,
    xp: 740,
    xpToNextLevel: 1000,
    coins: 2450,
    stats: {
        health: 75,
        knowledge: 60,
        discipline: 80,
        finance: 45,
        creativity: 50,
    },
    addXp: (amount) =>
        set((state) => {
            let newXp = state.xp + amount;
            let newLevel = state.level;
            let newXpToNextLevel = state.xpToNextLevel;

            if (newXp >= state.xpToNextLevel) {
                newXp -= state.xpToNextLevel;
                newLevel += 1;
                newXpToNextLevel = Math.floor(newXpToNextLevel * 1.1); // 10% increase per level
            }

            return { xp: newXp, level: newLevel, xpToNextLevel: newXpToNextLevel };
        }),
    addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
    updateStat: (stat, amount) =>
        set((state) => ({
            stats: { ...state.stats, [stat]: Math.min(100, state.stats[stat] + amount) },
        })),
    setLevel: (level) => set({ level }),
}));
