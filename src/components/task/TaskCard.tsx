"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Task } from "@/types/task";
import { Check, Trash2 } from "lucide-react";

interface TaskCardProps {
    task: Task;
    onComplete?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const priorityColors = {
    low: "#94A3B8",
    medium: "#F59E0B",
    high: "#EF4444",
    urgent: "#DC2626",
};

const categoryIcons: Record<string, string> = {
    study: "📚",
    health: "💪",
    work: "💼",
    creative: "🎨",
    finance: "💰",
    personal: "🏠",
};

export default function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
    return (
        <div
            className={`
        flex items-center gap-3 p-3 rounded-xl border transition-all
        ${task.is_completed
                    ? "bg-[var(--secondary)]/5 border-[var(--secondary)]/20 opacity-60"
                    : "bg-[var(--dark-surface)]/50 border-[var(--dark-border)] hover:border-[var(--primary)]/30"
                }
      `}
        >
            {/* Complete Button */}
            <button
                onClick={() => !task.is_completed && onComplete?.(task.id)}
                className={`
          w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0
          transition-all cursor-pointer
          ${task.is_completed
                        ? "bg-[var(--secondary)] border-[var(--secondary)] text-white"
                        : "border-[var(--dark-border)] hover:border-[var(--primary)]"
                    }
        `}
            >
                {task.is_completed && <Check size={14} />}
            </button>

            {/* Icon */}
            <span className="text-lg">{categoryIcons[task.category] || "📋"}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.is_completed ? "line-through" : ""}`}>
                    {task.title}
                </p>
                {task.description && (
                    <p className="text-xs text-[var(--text-muted)] truncate">{task.description}</p>
                )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Badge label={task.priority} color={priorityColors[task.priority]} size="sm" />
                <span className="text-xs text-[var(--accent)]">+{task.xp_reward} XP</span>
                {!task.is_completed && (
                    <button
                        onClick={() => onDelete?.(task.id)}
                        className="p-1 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}
