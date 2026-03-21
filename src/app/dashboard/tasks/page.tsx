"use client";

import { useState } from "react";
import TaskList from "@/components/task/TaskList";
import TaskForm from "@/components/task/TaskForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Plus } from "lucide-react";

export default function TasksPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setShowForm(true)}>
                    <Plus size={16} className="mr-1" />
                    New Task
                </Button>
            </div>

            <TaskList tasks={[]} />

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title="Create New Task"
            >
                <TaskForm
                    onSubmit={(data) => {
                        console.log("New task:", data);
                        setShowForm(false);
                    }}
                    onCancel={() => setShowForm(false)}
                />
            </Modal>
        </div>
    );
}
