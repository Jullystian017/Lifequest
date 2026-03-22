"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useQuestStore } from "@/store/questStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import {
  Wand2,
  Sparkles,
  Loader2,
  ChevronRight,
  Zap,
  Coins,
  Check,
  Plus,
  RotateCcw,
  Target,
  BookOpen,
  Hammer,
  Search,
  Trophy,
  Star,
} from "lucide-react";

interface GeneratedQuest {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | "epic";
  xp_reward: number;
  coin_reward: number;
  category: "research" | "practice" | "create" | "review" | "milestone";
  order: number;
  selected: boolean;
}

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  research: { icon: Search, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", label: "Riset" },
  practice: { icon: Hammer, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", label: "Latihan" },
  create: { icon: Star, color: "text-purple-400 bg-purple-500/10 border-purple-500/20", label: "Buat" },
  review: { icon: BookOpen, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "Review" },
  milestone: { icon: Trophy, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", label: "Milestone" },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-500/10",
  medium: "text-blue-400 bg-blue-500/10",
  hard: "text-orange-400 bg-orange-500/10",
  epic: "text-red-400 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.15)]",
};

const SAMPLE_GOALS = [
  "Aku mau jago React.js dalam 1 bulan",
  "Aku ingin bisa public speaking dengan percaya diri",
  "Aku mau belajar desain UI/UX dari nol",
  "Aku ingin menguasai bahasa Inggris level intermediate",
  "Aku mau bisa main gitar dalam 3 bulan",
];

export default function QuestMasterPage() {
  const [goal, setGoal] = useState("");
  const [quests, setQuests] = useState<GeneratedQuest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedCount, setAddedCount] = useState(0);
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  
  const { addQuest } = useQuestStore();
  const { activeWorkspaceId } = useWorkspaceStore();
  const supabase = createClient();

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setStep("loading");
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/quest-master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();

      if (data.quests && Array.isArray(data.quests)) {
        setQuests(data.quests.map((q: any) => ({ ...q, selected: true })));
        setStep("result");
      } else {
        alert("Gagal generate quest plan. Coba lagi.");
        setStep("input");
      }
    } catch {
      alert("Gagal terhubung ke AI. Periksa koneksi internet.");
      setStep("input");
    }
    setIsGenerating(false);
  };

  const toggleQuest = (index: number) => {
    setQuests((prev) =>
      prev.map((q, i) => (i === index ? { ...q, selected: !q.selected } : q))
    );
  };

  const handleAddToBoard = async () => {
    setIsAdding(true);
    const selected = quests.filter((q) => q.selected);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsAdding(false); return; }

    let added = 0;
    for (const quest of selected) {
      const newQuest: any = {
        workspace_id: activeWorkspaceId || "personal-1",
        assignee_id: user.id,
        title: quest.title,
        description: quest.description,
        type: "ai_generated",
        difficulty: quest.difficulty,
        priority: quest.category === "milestone" ? "high" : "medium",
        xp_reward: quest.xp_reward,
        coin_reward: quest.coin_reward,
        stat_rewards: {},
        target_value: 1,
        current_value: 0,
        is_completed: false,
      };

      const { data, error } = await supabase.from("quests").insert(newQuest).select().single();
      if (data && !error) {
        addQuest(data);
        added++;
      }
    }
    setAddedCount(added);
    setIsAdding(false);
  };

  const resetAll = () => {
    setGoal("");
    setQuests([]);
    setStep("input");
    setAddedCount(0);
  };

  return (
    <div className="space-y-8 pb-20 w-full animate-fade-in">
      <AnimatePresence mode="wait">
        {/* ===== STEP 1: INPUT GOAL ===== */}
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-8"
          >
            {/* Hero */}
            <div className="text-center space-y-4">
              <div className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-[var(--primary)]/20 to-purple-500/10 border border-[var(--primary)]/20 mb-4">
                <Wand2 size={48} className="text-[var(--primary)]" />
              </div>
              <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-heading)]">
                Apa tujuan besarmu?
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Ketik goal apapun dan AI Quest Master akan merancang roadmap quest khusus untukmu.
              </p>
            </div>

            {/* Input */}
            <div className="w-full max-w-2xl space-y-4">
              <div className="relative">
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder='Contoh: "Aku mau jago React.js dalam 1 bulan"'
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-light)] text-white rounded-2xl px-6 py-5 pr-14 outline-none focus:border-[var(--primary)] transition-all placeholder:text-slate-600 text-base font-medium shadow-xl"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!goal.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[var(--primary)]/20"
                >
                  <Sparkles size={20} />
                </button>
              </div>

              {/* Sample Goals */}
              <div className="flex flex-wrap gap-2 justify-center">
                {SAMPLE_GOALS.map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setGoal(sample)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] text-xs font-medium text-slate-400 hover:text-white hover:border-[var(--primary)]/30 transition-all"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== STEP 2: LOADING ===== */}
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
          >
            <div className="relative">
              <div className="p-8 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 animate-pulse">
                <Wand2 size={56} className="text-[var(--primary)] animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 animate-ping">
                <Sparkles size={16} className="text-yellow-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Loader2 className="animate-spin text-[var(--primary)]" size={20} />
                Game Master sedang merancang quest...
              </h3>
              <p className="text-sm text-slate-500">
                &quot;{goal}&quot;
              </p>
            </div>
          </motion.div>
        )}

        {/* ===== STEP 3: RESULT ===== */}
        {step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Result Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-[var(--primary)]" />
                  <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest">Quest Plan AI</span>
                </div>
                <h2 className="text-xl font-bold text-white">&quot;{goal}&quot;</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {quests.filter(q => q.selected).length} dari {quests.length} quest dipilih · Total{" "}
                  {quests.filter(q => q.selected).reduce((s, q) => s + q.xp_reward, 0)} XP
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] text-sm font-semibold text-slate-400 hover:text-white transition-all"
                >
                  <RotateCcw size={14} /> Ulang
                </button>
                {addedCount > 0 ? (
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm">
                    <Check size={16} /> {addedCount} Quest Ditambahkan!
                  </div>
                ) : (
                  <button
                    onClick={handleAddToBoard}
                    disabled={isAdding || quests.filter(q => q.selected).length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-[var(--primary)]/20"
                  >
                    {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    Tambahkan ke Quest Board
                  </button>
                )}
              </div>
            </div>

            {/* Quest Timeline */}
            <div className="relative space-y-4 pl-8">
              {/* Timeline Line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[var(--primary)] via-blue-500 to-purple-500 rounded-full" />

              {quests.map((quest, idx) => {
                const catConfig = CATEGORY_CONFIG[quest.category] || CATEGORY_CONFIG.practice;
                const CatIcon = catConfig.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => toggleQuest(idx)}
                    className={`relative flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all group ${
                      quest.selected
                        ? "bg-[var(--bg-card)] border-[var(--border-light)] hover:border-[var(--primary)]/30"
                        : "bg-[var(--bg-card)]/40 border-white/5 opacity-50"
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute -left-8 top-6 w-4 h-4 rounded-full border-2 transition-all ${
                      quest.selected
                        ? "bg-[var(--primary)] border-[var(--primary)] shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                        : "bg-slate-800 border-slate-600"
                    }`} />

                    {/* Checkbox */}
                    <div className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 ${
                      quest.selected
                        ? "bg-[var(--primary)] border-[var(--primary)]"
                        : "border-slate-600 bg-transparent"
                    }`}>
                      {quest.selected && <Check size={14} className="text-white" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${catConfig.color}`}>
                          <CatIcon size={10} className="inline mr-1 -mt-0.5" />
                          {catConfig.label}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${DIFFICULTY_COLORS[quest.difficulty]}`}>
                          {quest.difficulty}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{quest.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{quest.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1">
                          <Zap size={12} className="text-indigo-400" />
                          <span className="text-[11px] font-bold text-indigo-400">+{quest.xp_reward} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins size={12} className="text-yellow-500" />
                          <span className="text-[11px] font-bold text-yellow-500">+{quest.coin_reward} G</span>
                        </div>
                      </div>
                    </div>

                    {/* Step Number */}
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-400">{quest.order}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
