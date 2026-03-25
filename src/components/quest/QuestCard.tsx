"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Quest } from "@/types/quest";

interface QuestCardProps {
    quest: Quest;
    onComplete?: (id: string) => void;
}

const difficultyColors: Record<string, string> = {
    easy: "#22C55E",
    medium: "#F59E0B",
    hard: "#EF4444",
    extreme: "#8B5CF6",
};

export default function QuestCard({ quest, onComplete }: QuestCardProps) {
    return (
        <Card hover>
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h4 className="font-medium text-sm">{quest.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{quest.description}</p>
                </div>
                <Badge label={quest.difficulty} color={difficultyColors[quest.difficulty]} size="sm" />
            </div>
            <ProgressBar value={quest.current_value} max={quest.target_value} height="sm" showLabel />
            <div className="flex items-center justify-between mt-2 text-xs text-[var(--text-muted)]">
                <span>+{quest.xp_reward} XP • +{quest.coin_reward} 🪙</span>
                {quest.is_completed && <Badge label="Completed" color="var(--secondary)" size="sm" icon="✓" />}
            </div>
        </Card>
    );
}
