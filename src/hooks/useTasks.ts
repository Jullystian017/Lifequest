"use client";

import { useState, useCallback } from "react";
import { Task } from "@/types/task";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            // TODO: Fetch from Supabase
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const addTask = useCallback(async (task: Omit<Task, "id" | "created_at" | "user_id">) => {
        const newTask: Task = {
            ...task,
            id: Date.now().toString(),
            user_id: "",
            created_at: new Date().toISOString(),
        };
        setTasks((prev) => [newTask, ...prev]);
        // TODO: Save to Supabase
    }, []);

    const completeTask = useCallback(async (taskId: string) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId
                    ? { ...t, is_completed: true, completed_at: new Date().toISOString() }
                    : t
            )
        );
        // TODO: Award XP via Supabase
    }, []);

    const deleteTask = useCallback(async (taskId: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        // TODO: Delete from Supabase
    }, []);

    return { tasks, loading, fetchTasks, addTask, completeTask, deleteTask };
}
