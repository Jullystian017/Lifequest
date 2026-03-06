"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, Zap, Target, Award } from "lucide-react";

interface QuickActionProps {
  onAction?: (type: string) => void;
}

export default function QuickActions({ onAction }: QuickActionProps) {
  const actions = [
    { id: "task", label: "New Task", icon: Plus, variant: "primary" as const },
    { id: "habit", label: "New Habit", icon: Zap, variant: "secondary" as const },
    { id: "goal", label: "Set Goal", icon: Target, variant: "accent" as const },
    { id: "claim", label: "Claim Rewards", icon: Award, variant: "ghost" as const },
  ];

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
        ⚡ Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => onAction?.(action.id)}
          >
            <action.icon size={16} />
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
