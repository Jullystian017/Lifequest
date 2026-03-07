import { create } from 'zustand';
import { Goal, Milestone } from '@/types/goal';

interface GoalState {
    goals: Goal[];
    addGoal: (goal: Goal) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;
    toggleMilestone: (goalId: string, milestoneId: string) => void;
    setGoals: (goals: Goal[]) => void;
}

export const useGoalStore = create<GoalState>((set) => ({
    goals: [],
    addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
    updateGoal: (id, updates) =>
        set((state) => ({
            goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),
    deleteGoal: (id) =>
        set((state) => ({
            goals: state.goals.filter((g) => (g.id !== id)),
        })),
    toggleMilestone: (goalId, milestoneId) =>
        set((state) => ({
            goals: state.goals.map((g) => {
                if (g.id === goalId) {
                    const updatedMilestones = g.milestones.map((m) =>
                        m.id === milestoneId ? { ...m, is_completed: !m.is_completed } : m
                    );
                    const completedCount = updatedMilestones.filter((m) => m.is_completed).length;
                    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

                    return {
                        ...g,
                        milestones: updatedMilestones,
                        progress: progress,
                        status: progress === 100 ? "completed" : "in_progress"
                    };
                }
                return g;
            }),
        })),
    setGoals: (goals) => set({ goals }),
}));
