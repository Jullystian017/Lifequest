"use client";

import Card from "@/components/ui/Card";
import { Habit } from "@/types/habit";
import { getStreakEmoji } from "@/lib/gamification/streaks";

interface HabitCardProps {
    habit: Habit;
    onComplete?: (id: string) => void;
}

export default function HabitCard({ habit, onComplete }: HabitCardProps) {
    return (
        <Card hover className={habit.completed_today ? "border-[var(--secondary)]/30" : ""}>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => !habit.completed_today && onComplete?.(habit.id)}
                    className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-xl
            transition-all flex-shrink-0 cursor-pointer
            ${habit.completed_today
                            ? "bg-[var(--secondary)]/20 border-2 border-[var(--secondary)]"
                            : "bg-[var(--dark-surface)] border-2 border-[var(--dark-border)] hover:border-[var(--primary)]"
                        }
          `}
                >
                    {habit.completed_today ? "✅" : habit.icon || "🎯"}
                </button>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{habit.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[var(--text-muted)]">
                            {getStreakEmoji(habit.current_streak)} {habit.current_streak} day streak
                        </span>
                        <span className="text-xs text-[var(--accent)]">+{habit.xp_per_completion} XP</span>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[var(--text-muted)]">Best</p>
                    <p className="text-sm font-semibold text-[var(--primary-light)]">{habit.longest_streak}🔥</p>
                </div>
            </div>
        </Card>
    );
}
