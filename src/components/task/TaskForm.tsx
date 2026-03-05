"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { TaskCategory, TaskPriority } from "@/types/task";

interface TaskFormProps {
    onSubmit: (data: {
        title: string;
        description: string;
        category: TaskCategory;
        priority: TaskPriority;
    }) => void;
    onCancel?: () => void;
}

export default function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<TaskCategory>("personal");
    const [priority, setPriority] = useState<TaskPriority>("medium");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title, description, category, priority });
        setTitle("");
        setDescription("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Task Title"
                placeholder="What do you need to do?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <Input
                label="Description (optional)"
                placeholder="Add details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as TaskCategory)}
                        className="w-full bg-[var(--dark-surface)] border border-[var(--dark-border)] text-[var(--text-primary)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                        <option value="study">📚 Study</option>
                        <option value="health">💪 Health</option>
                        <option value="work">💼 Work</option>
                        <option value="creative">🎨 Creative</option>
                        <option value="finance">💰 Finance</option>
                        <option value="personal">🏠 Personal</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1.5">
                        Priority
                    </label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        className="w-full bg-[var(--dark-surface)] border border-[var(--dark-border)] text-[var(--text-primary)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
            </div>
            <div className="flex gap-2 justify-end">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit">Create Task</Button>
            </div>
        </form>
    );
}
