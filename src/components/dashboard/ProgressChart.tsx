"use client";

import Card from "@/components/ui/Card";

/**
 * ProgressChart placeholder — will be implemented with Recharts
 * Shows productivity trends, XP growth, and habit consistency
 */
export default function ProgressChart() {
    return (
        <Card>
            <h3 className="text-sm font-semibold mb-3 text-[var(--text-secondary)]">
                📊 Progress Overview
            </h3>
            <div className="h-48 flex items-center justify-center text-[var(--text-muted)] text-sm">
                <div className="text-center">
                    <p className="text-3xl mb-2">📈</p>
                    <p>Charts will be rendered here with Recharts</p>
                    <p className="text-xs mt-1">Productivity Trends • XP Growth • Habit Consistency</p>
                </div>
            </div>
        </Card>
    );
}
