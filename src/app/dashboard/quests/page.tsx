"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useQuestStore } from "@/store/questStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Quest } from "@/types/quest";
import {
  Plus,
  Loader2,
  X,
  Zap,
  Coins,
  Swords,
  Clock,
  CheckCircle2,
  CircleDot,
  Circle,
  Sparkles,
  ChevronDown,
} from "lucide-react";

type KanbanColumn = "todo" | "in_progress" | "done";

const columns: { id: KanbanColumn; label: string; icon: any; color: string }[] = [
  { id: "todo", label: "Belum Dimulai", icon: Circle, color: "text-slate-400" },
  { id: "in_progress", label: "Sedang Dikerjakan", icon: CircleDot, color: "text-blue-400" },
  { id: "done", label: "Selesai", icon: CheckCircle2, color: "text-emerald-400" },
];

export default function QuestBoardPage() {
  const { quests, setQuests, completeQuest, addQuest, updateQuest } = useQuestStore();
  const { addXp, addCoins, updateStat } = useUserStatsStore();
  const { activeWorkspaceId } = useWorkspaceStore();
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const supabase = createClient();

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<Quest["difficulty"]>("medium");
  const [newPriority, setNewPriority] = useState<Quest["priority"]>("medium");
  const [newXp, setNewXp] = useState(50);
  const [newGold, setNewGold] = useState(25);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      const { data } = await supabase
        .from("quests")
        .select("*")
        .eq("workspace_id", activeWorkspaceId || "personal-1")
        .order("created_at", { ascending: false });
      if (data) setQuests(data);
      setLoading(false);
    }
    load();
  }, [activeWorkspaceId, setQuests]);

  const getColumnQuests = (col: KanbanColumn) => {
    return quests.filter(q => {
      if (col === "done") return q.is_completed;
      if (col === "in_progress") return !q.is_completed && q.current_value > 0;
      return !q.is_completed && q.current_value === 0;
    });
  };

  const handleComplete = async (quest: Quest) => {
    if (quest.is_completed) return;
    completeQuest(quest.id);
    if (quest.xp_reward) addXp(quest.xp_reward);
    if (quest.coin_reward) addCoins(quest.coin_reward);
    if (quest.stat_rewards) {
      Object.entries(quest.stat_rewards).forEach(([stat, amount]) => updateStat(stat as any, amount));
    }
    await supabase.from("quests").update({ is_completed: true, completed_at: new Date().toISOString() }).eq("id", quest.id);
    setSelectedQuest(null);
  };

  const handleStartQuest = async (quest: Quest) => {
    updateQuest(quest.id, { current_value: 1 });
    await supabase.from("quests").update({ current_value: 1 }).eq("id", quest.id);
  };

  const handleCreateQuest = async () => {
    if (!newTitle.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newQuest: any = {
      workspace_id: activeWorkspaceId || "personal-1",
      assignee_id: user.id,
      title: newTitle,
      description: newDesc,
      type: "daily",
      difficulty: newDifficulty,
      priority: newPriority,
      xp_reward: newXp,
      coin_reward: newGold,
      stat_rewards: {},
      target_value: 1,
      current_value: 0,
      is_completed: false,
    };

    const { data, error } = await supabase.from("quests").insert(newQuest).select().single();
    if (data && !error) {
      addQuest(data);
      setShowCreateModal(false);
      setNewTitle(""); setNewDesc(""); setNewDifficulty("medium"); setNewPriority("medium"); setNewXp(50); setNewGold(25);
    }
  };

  const difficultyColors: Record<string, string> = {
    easy: "text-emerald-400 bg-emerald-500/10",
    medium: "text-blue-400 bg-blue-500/10",
    hard: "text-orange-400 bg-orange-500/10",
    epic: "text-purple-400 bg-purple-500/10",
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
        <p className="text-sm font-semibold uppercase tracking-widest">Memuat Quest Board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{quests.length} Quest Total · {quests.filter(q => q.is_completed).length} Selesai</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/20"
        >
          <Plus size={16} /> Quest Baru
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colQuests = getColumnQuests(col.id);
          return (
            <div key={col.id} className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center gap-2.5 px-1">
                <col.icon size={16} className={col.color} />
                <span className="text-sm font-semibold text-white">{col.label}</span>
                <span className="text-[10px] font-semibold text-slate-500 bg-[var(--bg-sidebar)] px-2 py-0.5 rounded-md">{colQuests.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-3 min-h-[200px]">
                {colQuests.length === 0 && (
                  <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center">
                    <p className="text-xs text-slate-500 font-semibold">Kosong</p>
                  </div>
                )}
                {colQuests.map((quest, idx) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedQuest(quest)}
                    className={`p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] cursor-pointer hover:border-[var(--primary)]/30 transition-all group ${quest.is_completed ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${difficultyColors[quest.difficulty] || "text-slate-400 bg-slate-500/10"}`}>
                        {quest.difficulty}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">{quest.priority}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">{quest.title}</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Zap size={10} className="text-indigo-400" />
                        <span className="text-[10px] font-semibold text-indigo-400">+{quest.xp_reward} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins size={10} className="text-yellow-500" />
                        <span className="text-[10px] font-semibold text-yellow-500">+{quest.coin_reward} G</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== Detail Modal ===== */}
      <AnimatePresence>
        {selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedQuest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-light)] rounded-3xl p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${difficultyColors[selectedQuest.difficulty]}`}>{selectedQuest.difficulty}</span>
                  <h3 className="text-xl font-semibold text-white mt-2">{selectedQuest.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedQuest.description || "Tidak ada deskripsi."}</p>
                </div>
                <button onClick={() => setSelectedQuest(null)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Hadiah XP</p>
                  <p className="text-lg font-semibold text-indigo-400">+{selectedQuest.xp_reward}</p>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Hadiah Gold</p>
                  <p className="text-lg font-semibold text-yellow-500">+{selectedQuest.coin_reward}</p>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Prioritas</p>
                  <p className="text-sm font-semibold text-white capitalize">{selectedQuest.priority}</p>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Tipe</p>
                  <p className="text-sm font-semibold text-white capitalize">{selectedQuest.type}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {!selectedQuest.is_completed && selectedQuest.current_value === 0 && (
                  <button onClick={() => { handleStartQuest(selectedQuest); setSelectedQuest({ ...selectedQuest, current_value: 1 }); }} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-colors">
                    Mulai Kerjakan
                  </button>
                )}
                {!selectedQuest.is_completed && (
                  <button onClick={() => handleComplete(selectedQuest)} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-colors">
                    Selesaikan Quest
                  </button>
                )}
                {selectedQuest.is_completed && (
                  <div className="flex-1 py-3 rounded-xl bg-[var(--bg-sidebar)] text-center text-sm font-semibold text-emerald-400">
                    ✅ Quest Sudah Selesai
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Create Quest Modal ===== */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-light)] rounded-3xl p-8 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2"><Sparkles size={20} className="text-[var(--primary)]" /> Quest Baru</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Judul Quest</label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Belajar React Hooks"
                    className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all placeholder:text-slate-600 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Deskripsi</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Opsional: jelaskan detail quest..."
                    rows={2}
                    className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all placeholder:text-slate-600 text-sm font-medium resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Kesulitan</label>
                    <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value as any)} className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm">
                      <option value="easy">Mudah</option>
                      <option value="medium">Sedang</option>
                      <option value="hard">Sulit</option>
                      <option value="epic">Epik</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Prioritas</label>
                    <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as any)} className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm">
                      <option value="low">Rendah</option>
                      <option value="medium">Sedang</option>
                      <option value="high">Tinggi</option>
                      <option value="urgent">Mendesak</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Hadiah XP</label>
                    <input type="number" value={newXp} onChange={(e) => setNewXp(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Hadiah Gold</label>
                    <input type="number" value={newGold} onChange={(e) => setNewGold(Number(e.target.value))} className="w-full bg-black/30 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateQuest}
                disabled={!newTitle.trim()}
                className="w-full py-3.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[var(--primary)]/20"
              >
                Buat Quest
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
