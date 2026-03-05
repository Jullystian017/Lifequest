"use client";

import HabitList from "@/components/habit/HabitList";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function HabitsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                        🔁 Habits
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">
                        Build positive habits and maintain your streaks
                    </p>
                </div>
                <Button>
                    <Plus size={16} className="mr-1" />
                    New Habit
                </Button>
            </div>

            <HabitList habits={[]} />
        </div>
    );
}
