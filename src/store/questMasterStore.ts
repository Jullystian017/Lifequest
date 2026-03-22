import { create } from 'zustand';

interface GeneratedQuest {
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard" | "epic";
    xp_reward: number;
    coin_reward: number;
    category: "research" | "practice" | "create" | "review" | "milestone";
    order: number;
    selected: boolean;
}

interface QuestMasterState {
    goal: string;
    quests: GeneratedQuest[];
    step: "input" | "loading" | "result";
    addedCount: number;

    setGoal: (goal: string) => void;
    setQuests: (quests: GeneratedQuest[]) => void;
    setStep: (step: "input" | "loading" | "result") => void;
    setAddedCount: (count: number) => void;
    toggleQuest: (index: number) => void;
    resetAll: () => void;
}

export const useQuestMasterStore = create<QuestMasterState>((set) => ({
    goal: "",
    quests: [],
    step: "input",
    addedCount: 0,

    setGoal: (goal) => set({ goal }),
    setQuests: (quests) => set({ quests }),
    setStep: (step) => set({ step }),
    setAddedCount: (count) => set({ addedCount: count }),
    toggleQuest: (index) => set((state) => ({
        quests: state.quests.map((q, i) => i === index ? { ...q, selected: !q.selected } : q),
    })),
    resetAll: () => set({ goal: "", quests: [], step: "input", addedCount: 0 }),
}));
