import { create } from 'zustand';
import { Quest } from '@/types/quest';

interface QuestState {
    quests: Quest[];
    addQuest: (quest: Quest) => void;
    updateQuest: (id: string, updates: Partial<Quest>) => void;
    deleteQuest: (id: string) => void;
    completeQuest: (id: string) => void;
    toggleTask: (questId: string, taskId: string) => void;
    setQuests: (quests: Quest[]) => void;
}

export const useQuestStore = create<QuestState>((set) => ({
    quests: [],
    addQuest: (quest) => set((state) => ({ quests: [quest, ...state.quests] })),
    updateQuest: (id, updates) =>
        set((state) => ({
            quests: state.quests.map((q) => (q.id === id ? { ...q, ...updates } : q)),
        })),
    deleteQuest: (id) =>
        set((state) => ({
            quests: state.quests.filter((q) => (q.id !== id)),
        })),
    completeQuest: (id) =>
        set((state) => ({
            quests: state.quests.map((q) =>
                q.id === id ? { ...q, is_completed: true, current_value: q.target_value } : q
            ),
        })),
    toggleTask: (questId, taskId) =>
        set((state) => ({
            quests: state.quests.map((q) => {
                if (q.id !== questId || !q.tasks) return q;
                return {
                    ...q,
                    tasks: q.tasks.map((t) =>
                        t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
                    ),
                };
            }),
        })),
    setQuests: (quests) => set({ quests }),
}));
