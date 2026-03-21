import { create } from 'zustand';
import { CharacterStats, StatKey } from '@/types/user';

interface UserStatsState {
    level: number;
    xp: number;
    xpToNextLevel: number;
    coins: number;
    equippedItems: Record<string, string>; // category -> itemId
    stats: CharacterStats;
    addXp: (amount: number) => void;
    addCoins: (amount: number) => void;
    subtractCoins: (amount: number) => void;
    equipItem: (category: string, itemId: string) => void;
    updateStat: (stat: StatKey, amount: number) => void;
    setLevel: (level: number) => void;
    showLevelUpModal: boolean;
    setLevelUpModal: (show: boolean) => void;
}

export const useUserStatsStore = create<UserStatsState>((set) => ({
    level: 12,
    xp: 740,
    xpToNextLevel: 1000,
    coins: 2450,
    equippedItems: {},
    showLevelUpModal: false,
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
            let leveledUp = false;

            if (newXp >= state.xpToNextLevel) {
                newXp -= state.xpToNextLevel;
                newLevel += 1;
                newXpToNextLevel = Math.floor(newXpToNextLevel * 1.1); // 10% increase per level
                leveledUp = true;
            }

            return { 
                xp: newXp, 
                level: newLevel, 
                xpToNextLevel: newXpToNextLevel,
                ...(leveledUp ? { showLevelUpModal: true } : {})
            };
        }),
    addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
    subtractCoins: (amount) => set((state) => ({ coins: Math.max(0, state.coins - amount) })),
    equipItem: (category, itemId) => 
        set((state) => {
            const currentItem = state.equippedItems[category];
            const newEquipped = { ...state.equippedItems };
            
            if (currentItem === itemId) {
                // Toggle off
                delete newEquipped[category];
            } else {
                // Toggle on (replaces existing item in that slot)
                newEquipped[category] = itemId;
            }
            
            return { equippedItems: newEquipped };
        }),
    updateStat: (stat, amount) =>
        set((state) => ({
            stats: { ...state.stats, [stat]: Math.min(100, state.stats[stat] + amount) },
        })),
    setLevel: (level) => set({ level }),
    setLevelUpModal: (show) => set({ showLevelUpModal: show }),
}));
