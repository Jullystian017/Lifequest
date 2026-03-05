"use client";

import TaskCard from "./TaskCard";
import { Task } from "@/types/task";

interface TaskListProps {
    tasks: Task[];
    onCompleteTask?: (id: string) => void;
    onDeleteTask?: (id: string) => void;
}

export default function TaskList({ tasks, onCompleteTask, onDeleteTask }: TaskListProps) {
    const pending = tasks.filter((t) => !t.is_completed);
    const completed = tasks.filter((t) => t.is_completed);

    return (
        <div className="space-y-4">
            {/* Pending Tasks */}
            <div className="space-y-2">
                {pending.length === 0 && completed.length === 0 && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <p className="text-4xl mb-3">✅</p>
                        <p className="text-sm">No tasks yet. Create one to get started!</p>
                    </div>
                )}
                {pending.map((task) => (
                    <TaskCard key={task.id} task={task} onComplete={onCompleteTask} onDelete={onDeleteTask} />
                ))}
            </div>

            {/* Completed Tasks */}
            {completed.length > 0 && (
                <div>
                    <h4 className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">
                        Completed ({completed.length})
                    </h4>
                    <div className="space-y-2">
                        {completed.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
