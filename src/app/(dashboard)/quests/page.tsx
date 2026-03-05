"use client";

import QuestList from "@/components/quest/QuestList";
import Button from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export default function QuestsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                        ⚔️ Quests
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">
                        Complete quests to earn XP, coins, and stat boosts
                    </p>
                </div>
                <Button variant="accent" size="md">
                    <Sparkles size={16} className="mr-1" />
                    AI Generate
                </Button>
            </div>

            {/* Quest Sections */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-3">Daily Quests</h2>
                    <QuestList quests={[]} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-3">Story Quests</h2>
                    <QuestList quests={[]} />
                </div>
            </div>
        </div>
    );
}
