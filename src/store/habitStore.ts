import { create } from 'zustand';
import { Habit } from '@/types/habit';

interface HabitState {
    habits: Habit[];
    addHabit: (habit: Habit) => void;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
    deleteHabit: (id: string) => void;
    toggleHabit: (id: string) => void; // Mark as completed for today
    setHabits: (habits: Habit[]) => void;
}

export const useHabitStore = create<HabitState>((set) => ({
    habits: [],
    addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
    updateHabit: (id, updates) =>
        set((state) => ({
            habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),
    deleteHabit: (id) =>
        set((state) => ({
            habits: state.habits.filter((h) => (h.id !== id)),
        })),
    toggleHabit: (id) =>
        set((state) => ({
            habits: state.habits.map((h) => {
                if (h.id === id) {
                    const completed = !h.completed_today;
                    return {
                        ...h,
                        completed_today: completed,
                        current_streak: completed ? h.current_streak + 1 : Math.max(0, h.current_streak - 1),
                    };
                }
                return h;
            }),
        })),
    setHabits: (habits) => set({ habits }),
}));
