"use client";

import Button from "@/components/ui/Button";
import { Quest } from "@/types/quest";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Coins, Scroll, Plus, X, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface DailyQuestPanelProps {
  quests: Quest[];
  onCompleteQuest?: (questId: string) => void;
  onQuestAdded?: () => void;  // callback to refetch quests after adding
  userId?: string;
}

export default function DailyQuestPanel({
  quests,
  onCompleteQuest,
  onQuestAdded,
  userId,
}: DailyQuestPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const XP_MAP = { easy: 25, medium: 50, hard: 100 };
  const COIN_MAP = { easy: 10, medium: 25, hard: 50 };
  const DIFF_LABEL: Record<string, string> = { easy: "Mudah", medium: "Sedang", hard: "Sulit" };

  const handleQuickAdd = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    const supabase = createClient();
    const uid = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!uid) { setIsSubmitting(false); return; }

    const statReward = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 5;

    await supabase.from("quests").insert({
      user_id: uid,
      title: title.trim(),
      description: "",
      type: "daily",
      difficulty,
      priority: "medium",
      xp_reward: XP_MAP[difficulty],
      coin_reward: COIN_MAP[difficulty],
      stat_rewards: { discipline: statReward },
      target_value: 1,
      current_value: 0,
      is_completed: false,
    });

    setTitle("");
    setShowForm(false);
    setIsSubmitting(false);
    onQuestAdded?.();
  };

  const pendingQuests = quests.filter(q => !q.is_completed);
  const completedQuests = quests.filter(q => q.is_completed);

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all">
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-indigo-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">
              Log Quest Harian
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {pendingQuests.length} quest aktif · {completedQuests.length} selesai
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/quests" className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-colors">
            Semua Quest
          </Link>
        </div>
      </div>


      {quests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
            <Scroll size={32} className="text-indigo-500/40" />
          </div>
          <p className="text-sm font-semibold text-slate-400 mb-1">Belum ada quest yang aktif</p>
          <p className="text-xs text-slate-500 mb-4">Buka papan quest untuk memulai petualangan!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quests.slice(0, 5).map((quest, idx) => (
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
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-sidebar)] border border-[var(--border-light)] flex items-center justify-center font-semibold text-[var(--text-secondary)] shadow-inner">
                  {quest.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold group-hover:text-white transition-colors">
                    {quest.title}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Zap size={10} className="text-indigo-400" />
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase">+{quest.xp_reward} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins size={10} className="text-yellow-500" />
                      <span className="text-[10px] font-semibold text-yellow-500 uppercase">+{quest.coin_reward} G</span>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
          {quests.length > 5 && (
            <Link href="/dashboard/quests" className="block text-center text-xs font-bold text-indigo-400 hover:text-indigo-300 py-2 transition-colors">
              Lihat {quests.length - 5} quest lainnya →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
