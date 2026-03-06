"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Quest } from "@/types/quest";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Coins } from "lucide-react";

interface DailyQuestPanelProps {
  quests: Quest[];
  onCompleteQuest?: (questId: string) => void;
}

export default function DailyQuestPanel({
  quests,
  onCompleteQuest,
}: DailyQuestPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={24} className="text-[var(--primary)]" />
          <h3 className="text-xl font-black font-[family-name:var(--font-heading)]">
            Daily Quest Log
          </h3>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--primary-light)] transition-colors">
          All Quests
        </button>
      </div>

      <div className="space-y-4">
        {quests.map((quest, idx) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`
              flex items-center justify-between p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-medium)] hover:border-[var(--primary)]/40 transition-all group
              ${quest.is_completed ? "opacity-50" : "hover:shadow-2xl hover:shadow-[var(--primary)]/5"}
            `}
          >
            <div className="flex items-center gap-6">
              {/* Icon / Mini Tag */}
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-sidebar)] border border-[var(--border-light)] flex items-center justify-center font-black text-[var(--text-secondary)] shadow-inner">
                 {quest.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <span className="text-lg font-bold group-hover:text-[var(--primary-light)] transition-colors">
                  {quest.title}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Zap size={10} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase">+{quest.xp_reward} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins size={10} className="text-yellow-500" />
                    <span className="text-[10px] font-black text-yellow-500 uppercase">+{quest.coin_reward} G</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <Button
              size="md"
              variant={quest.is_completed ? "ghost" : "primary"}
              className={`rounded-2xl px-8 font-black text-xs ${quest.is_completed ? "opacity-50 grayscale" : ""}`}
              disabled={quest.is_completed}
              onClick={() => onCompleteQuest?.(quest.id)}
            >
              {quest.is_completed ? "Finished" : "Complete"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
