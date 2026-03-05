"use client";

import QuestCard from "./QuestCard";
import { Quest } from "@/types/quest";

interface QuestListProps {
    quests: Quest[];
    onCompleteQuest?: (id: string) => void;
}

export default function QuestList({ quests, onCompleteQuest }: QuestListProps) {
    if (quests.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--text-muted)]">
                <p className="text-4xl mb-3">⚔️</p>
                <p className="text-sm">No quests available right now.</p>
                <p className="text-xs mt-1">New quests appear daily!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {quests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} onComplete={onCompleteQuest} />
            ))}
        </div>
    );
}
