"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Quest } from "@/types/quest";

interface DailyQuestPanelProps {
    quests: Quest[];
    onCompleteQuest?: (questId: string) => void;
}

const difficultyColors = {
    easy: "#22C55E",
    medium: "#F59E0B",
    hard: "#EF4444",
    epic: "#8B5CF6",
};

export default function DailyQuestPanel({
    quests,
    onCompleteQuest,
}: DailyQuestPanelProps) {
    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
                    ⚔️ Daily Quests
                </h3>
                <Badge label={`${quests.filter((q) => q.is_completed).length}/${quests.length}`} color="var(--primary)" size="sm" />
            </div>

            <div className="space-y-3">
                {quests.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-6">
                        No quests available yet. Check back soon!
                    </p>
                ) : (
                    quests.map((quest) => (
                        <div
                            key={quest.id}
                            className={`
                p-3 rounded-xl border transition-all
                ${quest.is_completed
                                    ? "bg-[var(--secondary)]/5 border-[var(--secondary)]/20 opacity-60"
                                    : "bg-[var(--dark-surface)]/50 border-[var(--dark-border)] hover:border-[var(--primary)]/30"
                                }
              `}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{quest.title}</span>
                                        <Badge
                                            label={quest.difficulty}
                                            color={difficultyColors[quest.difficulty]}
                                            size="sm"
                                        />
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                        {quest.description}
                                    </p>
                                </div>
                                <span className="text-xs text-[var(--accent)] font-medium whitespace-nowrap">
                                    +{quest.xp_reward} XP
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <ProgressBar
                                        value={quest.current_value}
                                        max={quest.target_value}
                                        color={difficultyColors[quest.difficulty]}
                                        height="sm"
                                        showLabel
                                    />
                                </div>
                                {!quest.is_completed && quest.current_value >= quest.target_value && (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onCompleteQuest?.(quest.id)}
                                    >
                                        Claim
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
