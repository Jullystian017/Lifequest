"use client";

import HabitCard from "./HabitCard";
import { Habit } from "@/types/habit";

interface HabitListProps {
    habits: Habit[];
    onCompleteHabit?: (id: string) => void;
}

export default function HabitList({ habits, onCompleteHabit }: HabitListProps) {
    if (habits.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--text-muted)]">
                <p className="text-4xl mb-3">🔁</p>
                <p className="text-sm">No habits tracked yet.</p>
                <p className="text-xs mt-1">Start building positive habits!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} onComplete={onCompleteHabit} />
            ))}
        </div>
    );
}
