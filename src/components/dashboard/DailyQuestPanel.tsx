"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Quest } from "@/types/quest";
import { motion } from "framer-motion";
import { Swords, Trophy, Sparkles } from "lucide-react";

interface DailyQuestPanelProps {
  quests: Quest[];
  onCompleteQuest?: (questId: string) => void;
}

const difficultyColors = {
  easy: "var(--secondary)",
  medium: "var(--accent)",
  hard: "var(--health)",
  epic: "var(--discipline)",
};

export default function DailyQuestPanel({
  quests,
  onCompleteQuest,
}: DailyQuestPanelProps) {
  const completedCount = quests.filter((q) => q.is_completed).length;

  return (
    <Card className="border-[var(--dark-border)] overflow-hidden">
      {/* Header Overlay Gradient */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--dark-border)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--primary)]/10 rounded-xl">
             <Swords size={20} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-[family-name:var(--font-heading)]">
              Daily Quests
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Resets in 12h 45m
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-[10px] items-center gap-1.5 flex uppercase font-bold tracking-widest text-[var(--text-muted)]">
              Progress
            </span>
            <Badge 
              label={`${completedCount}/${quests.length}`} 
              color={completedCount === quests.length ? "var(--secondary)" : "var(--primary)"} 
              size="md" 
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.length === 0 ? (
          <div className="col-span-2 py-10 flex flex-col items-center justify-center text-center opacity-40">
             <Trophy size={48} className="mb-4 text-[var(--text-muted)]" />
             <p className="text-sm font-bold">No Quests To Embark On</p>
             <p className="text-xs">You're all caught up for today!</p>
          </div>
        ) : (
          quests.map((quest, idx) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`
                group relative p-4 rounded-2xl border transition-all duration-300
                ${
                  quest.is_completed
                    ? "bg-[var(--secondary)]/5 border-[var(--secondary)]/20 opacity-70"
                    : "bg-[var(--dark-surface)]/30 border-[var(--dark-border)] hover:bg-[var(--dark-surface)]/50 hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-[var(--primary)]/5"
                }
              `}
            >
              {/* Difficuly Stripe */}
              <div 
                className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full group-hover:w-1.5 transition-all"
                style={{ backgroundColor: difficultyColors[quest.difficulty] }}
              />

              <div className="pl-3 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold leading-none mb-1">{quest.title}</span>
                    <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                      {quest.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-[var(--accent)] flex items-center gap-1 justify-end">
                      +{quest.xp_reward} <Sparkles size={8} />
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)] font-black uppercase">XP</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <ProgressBar
                      value={quest.current_value}
                      max={quest.target_value}
                      color={difficultyColors[quest.difficulty]}
                      height="sm"
                    />
                  </div>
                  {quest.current_value >= quest.target_value && !quest.is_completed ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 text-[10px] uppercase font-bold px-4"
                      onClick={() => onCompleteQuest?.(quest.id)}
                    >
                      Claim
                    </Button>
                  ) : (
                    <span className="text-[10px] font-bold text-[var(--text-muted)] min-w-[32px] text-right">
                      {Math.round((quest.current_value / quest.target_value) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
