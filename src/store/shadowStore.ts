import { create } from 'zustand';

export interface ShadowEnemy {
    id: string;
    name: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard" | "Boss";
    hp: number;
    maxHp: number;
    xpReward: number;
    coinReward: number;
    icon: string; // lucide icon name
    color: string;
}

interface ShadowState {
    enemies: ShadowEnemy[];
    activeBattleId: string | null;
    setEnemies: (enemies: ShadowEnemy[]) => void;
    startBattle: (id: string) => void;
    dealDamage: (amount: number) => void;
    fleeBattle: () => void;
}

const DEFAULT_ENEMIES: ShadowEnemy[] = [
    {
        id: "e1",
        name: "Prokrastinator Kecil",
        description: "Bayangan kemalasan yang menunda pekerjaan 5 menit berturut-turut.",
        difficulty: "Easy",
        hp: 100,
        maxHp: 100,
        xpReward: 50,
        coinReward: 20,
        icon: "Clock",
        color: "text-slate-400",
    },
    {
        id: "e2",
        name: "Doom Scroller",
        description: "Monster yang memakan waktumu di sosial media tanpa henti.",
        difficulty: "Medium",
        hp: 250,
        maxHp: 250,
        xpReward: 150,
        coinReward: 50,
        icon: "Smartphone",
        color: "text-blue-400",
    },
    {
        id: "e3",
        name: "Burnout Spectre",
        description: "Hantu kelelahan akibat kerja berlebihan tanpa istirahat.",
        difficulty: "Hard",
        hp: 500,
        maxHp: 500,
        xpReward: 300,
        coinReward: 100,
        icon: "Flame",
        color: "text-orange-400",
    },
    {
        id: "b1",
        name: "Raja Penundaan (Boss)",
        description: "Wujud raksasa dari semua tugas yang tak kunjung diselesaikan.",
        difficulty: "Boss",
        hp: 2000,
        maxHp: 2000,
        xpReward: 1000,
        coinReward: 500,
        icon: "Skull",
        color: "text-red-500",
    }
];

export const useShadowStore = create<ShadowState>((set, get) => ({
    enemies: DEFAULT_ENEMIES,
    activeBattleId: null,
    setEnemies: (enemies) => set({ enemies }),
    startBattle: (id) => set({ activeBattleId: id }),
    dealDamage: (amount) => set((state) => {
        if (!state.activeBattleId) return state;
        const enemies = state.enemies.map(e => 
            e.id === state.activeBattleId 
                ? { ...e, hp: Math.max(0, e.hp - amount) } 
                : e
        );
        return { enemies };
    }),
    fleeBattle: () => set({ activeBattleId: null }),
}));
