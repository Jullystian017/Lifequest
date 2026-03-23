import { create } from 'zustand';
import { CharacterStats, StatKey } from '@/types/user';

interface UserStatsState {
    username: string;
    avatar_url: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    coins: number;
    equippedItems: Record<string, string>; // category -> itemId
    stats: CharacterStats;
    setUserProfile: (profile: Partial<UserStatsState>) => void;
    setUsername: (username: string) => void;
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
    username: "Adventurer",
    avatar_url: "/lifequest.png",
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    coins: 0,
    equippedItems: {},
    showLevelUpModal: false,
    stats: {
        health: 0,
        knowledge: 0,
        discipline: 0,
        finance: 0,
        creativity: 0,
    },
    setUserProfile: (profile) => set((state) => ({ ...state, ...profile })),
    setUsername: (username) => set({ username }),
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
