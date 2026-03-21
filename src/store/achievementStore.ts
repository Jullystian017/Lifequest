import { create } from 'zustand';

export type AchievementCategory = 'quest' | 'streak' | 'social' | 'combat';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: AchievementCategory;
    requirementType: 'complete_quests' | 'reach_streak' | 'reach_level' | 'defeat_enemies';
    requirementValue: number;
    xpReward: number;
    color: string;
}

export interface AchievementState {
    achievements: Achievement[];
    unlockedIds: string[];
    setAchievements: (achievements: Achievement[]) => void;
    unlockAchievement: (id: string) => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    {
        id: "a1", title: "Langkah Pertama", description: "Menyelesaikan 1 quest", icon: "Flag", category: "quest", requirementType: "complete_quests", requirementValue: 1, xpReward: 50, color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
        id: "a2", title: "Pekerja Keras", description: "Menyelesaikan 10 quest", icon: "Hammer", category: "quest", requirementType: "complete_quests", requirementValue: 10, xpReward: 200, color: "text-blue-500 bg-blue-600/10 border-blue-600/20"
    },
    {
        id: "a3", title: "Konsisten", description: "Mencapai 3 hari streak", icon: "Flame", category: "streak", requirementType: "reach_streak", requirementValue: 3, xpReward: 100, color: "text-orange-400 bg-orange-500/10 border-orange-500/20"
    },
    {
        id: "a4", title: "Tak Terhentikan", description: "Mencapai 7 hari streak", icon: "Zap", category: "streak", requirementType: "reach_streak", requirementValue: 7, xpReward: 300, color: "text-red-500 bg-red-500/10 border-red-500/20"
    },
    {
        id: "a5", title: "Petarung Pemula", description: "Mencapai Level 5", icon: "Swords", category: "combat", requirementType: "reach_level", requirementValue: 5, xpReward: 150, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
        id: "a6", title: "Pembasmi Bayangan", description: "Mengalahkan 5 Shadow Enemies", icon: "Skull", category: "combat", requirementType: "defeat_enemies", requirementValue: 5, xpReward: 250, color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
];

export const useAchievementStore = create<AchievementState>((set) => ({
    achievements: DEFAULT_ACHIEVEMENTS,
    unlockedIds: [],
    setAchievements: (achievements) => set({ achievements }),
    unlockAchievement: (id) => set((state) => ({
        unlockedIds: state.unlockedIds.includes(id) ? state.unlockedIds : [...state.unlockedIds, id]
    })),
}));
