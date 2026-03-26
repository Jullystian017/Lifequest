"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  workspacesQueryKey, fetchUserWorkspaces,
  workspaceMembersQueryKey, fetchWorkspaceMembers,
  sprintsQueryKey, fetchWorkspaceSprints,
  boardQuestsQueryKey, fetchWorkspaceBoardQuests
} from "@/lib/queries";
import { createSprint, createTeamQuest, updateQuestStatus } from "@/lib/mutations";
import { useWorkspaceStore } from "@/store/workspaceStore";
import {
  Globe, Loader2, Users, CheckCircle2, Circle, Zap, Coins,
  Calendar, Plus, ChevronDown, Code2, Shield, Swords, UserCheck,
  GripVertical, X, Flame,
} from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  hard: "text-red-400 bg-red-500/10 border-red-500/20",
  extreme: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};
const CLASS_ICONS: Record<string, any> = { frontend: Code2, backend: Shield, devops: Zap, fullstack: Swords };
const CLASS_COLORS: Record<string, string> = { frontend: "text-cyan-400", backend: "text-purple-400", devops: "text-orange-400", fullstack: "text-emerald-400" };

const COLUMNS = [
  { id: "todo", label: "Todo", color: "text-slate-400", border: "border-slate-500/20", bg: "bg-slate-500/5", headerBg: "bg-slate-500/10" },
  { id: "in_progress", label: "In Progress", color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5", headerBg: "bg-blue-500/10" },
  { id: "in_review", label: "In Review", color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/5", headerBg: "bg-yellow-500/10" },
  { id: "done", label: "Done", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", headerBg: "bg-emerald-500/10" },
];

export default function TeamBoardPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [sprintForm, setSprintForm] = useState({ name: "", startDate: "", endDate: "" });
  const [questForm, setQuestForm] = useState({ title: "", description: "", difficulty: "medium", xp_reward: 100, coin_reward: 50, category: "feature", assignee_id: "" });
  // Drag & drop
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, []);

  const { activeWorkspaceId } = useWorkspaceStore();

  const { data: workspaces = [] } = useQuery({
    queryKey: workspacesQueryKey(userId!),
    queryFn: () => fetchUserWorkspaces(userId!),
    enabled: !!userId,
  });

  const activeWorkspace = activeWorkspaceId ? (workspaces as any[]).find((w: any) => w.id === activeWorkspaceId) : null;

  const { data: members = [] } = useQuery({
    queryKey: workspaceMembersQueryKey(activeWorkspace?.id),
    queryFn: () => fetchWorkspaceMembers(activeWorkspace?.id),
    enabled: !!activeWorkspace?.id,
  });

  const { data: sprints = [] } = useQuery({
    queryKey: sprintsQueryKey(activeWorkspace?.id),
    queryFn: () => fetchWorkspaceSprints(activeWorkspace?.id),
    enabled: !!activeWorkspace?.id,
  });

  const { data: sharedQuests = [], isLoading: loading } = useQuery({
    queryKey: boardQuestsQueryKey(activeWorkspace?.id, selectedSprintId),
    queryFn: () => fetchWorkspaceBoardQuests(activeWorkspace!.id, selectedSprintId),
    enabled: !!activeWorkspace?.id,
  });

  // Sprint progress
  const totalQuests = sharedQuests.length;
  const doneQuests = sharedQuests.filter(q => q.is_completed || q.status === "done").length;
  const sprintPct = totalQuests > 0 ? Math.round((doneQuests / totalQuests) * 100) : 0;

  const sprintMutation = useMutation({
    mutationFn: () => createSprint(activeWorkspace!.id, sprintForm.name, sprintForm.startDate, sprintForm.endDate),
    onSuccess: (newSprint: any) => {
      queryClient.invalidateQueries({ queryKey: sprintsQueryKey(activeWorkspace!.id) });
      setSelectedSprintId(newSprint.id);
      setShowSprintModal(false);
      setSprintForm({ name: "", startDate: "", endDate: "" });
    },
  });

  const createQuestMutation = useMutation({
    mutationFn: () => createTeamQuest(userId!, activeWorkspace!.id, selectedSprintId, {
      ...questForm,
      assignee_id: questForm.assignee_id || null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardQuestsQueryKey(activeWorkspace!.id, selectedSprintId) });
      setShowQuestModal(false);
      setQuestForm({ title: "", description: "", difficulty: "medium", xp_reward: 100, coin_reward: 50, category: "feature", assignee_id: "" });
    },
  });

  // Drag & drop handlers
  const handleDragStart = (questId: string) => setDraggingId(questId);
  const handleDragOver = (e: React.DragEvent, colId: string) => { e.preventDefault(); setDragOverCol(colId); };
  const handleDragEnd = () => { setDraggingId(null); setDragOverCol(null); };

  const handleDrop = async (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    if (!draggingId || !colId) return;
    const quest = sharedQuests.find(q => q.id === draggingId);
    if (!quest) return;

    let newStatus = colId;
    const isCompleted = colId === "done";

    // Update in DB
    await supabase.from("quests").update({
      status: colId,
      is_completed: colId === "done",
      completed_at: colId === "done" ? new Date().toISOString() : null,
    }).eq("id", draggingId);

    queryClient.invalidateQueries({ queryKey: boardQuestsQueryKey(activeWorkspace!.id, selectedSprintId) });

    setDraggingId(null);
    setDragOverCol(null);
  };

  const columnsMap = COLUMNS.reduce((acc, col) => {
    acc[col.id] = sharedQuests.filter(q => {
      if (col.id === "done") return q.is_completed || q.status === "done";
      if (col.id === "in_review") return !q.is_completed && q.status === "in_review";
      if (col.id === "in_progress") return !q.is_completed && q.status === "in_progress";
      return !q.is_completed && (!q.status || q.status === "todo");
    });
    return acc;
  }, {} as Record<string, any[]>);

  if (!activeWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <Globe size={48} className="text-slate-600" />
        <h2 className="text-xl font-bold text-white">Belum ada Workspace</h2>
        <p className="text-slate-400 text-sm">Buat atau bergabung ke workspace dulu di halaman Team.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Globe size={24} className="text-blue-400" /> Sprint Board
          </h1>
          <p className="text-slate-400 text-sm mt-1">Shared quests for {activeWorkspace.name}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select value={selectedSprintId || ""} onChange={(e) => setSelectedSprintId(e.target.value || null)}
              className="appearance-none bg-[var(--bg-card)] border border-[var(--border-light)] text-white text-sm font-bold rounded-xl pl-4 pr-10 py-2 outline-none focus:border-[var(--primary)] hover:border-white/20 transition-all cursor-pointer min-w-[160px]">
              <option value="">All Quests (Backlog)</option>
              {(sprints as any[]).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button onClick={() => setShowSprintModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all">
            <Calendar size={14} /> Buat Sprint
          </button>
          <button onClick={() => setShowQuestModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 font-bold text-sm hover:bg-[var(--primary)] hover:text-white transition-all">
            <Plus size={14} /> Tambah Quest
          </button>
        </div>
      </div>

      {/* Sprint Progress Bar */}
      {selectedSprintId && totalQuests > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400 font-bold">Progress Sprint</span>
            <span className="text-blue-400 font-bold">{doneQuests}/{totalQuests} quest ({sprintPct}%)</span>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${sprintPct}%` }} transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${sprintPct >= 100 ? "bg-emerald-500" : sprintPct >= 60 ? "bg-blue-500" : sprintPct >= 30 ? "bg-yellow-500" : "bg-red-500"}`} />
          </div>
        </div>
      )}

      {/* Board */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const colQuests = columnsMap[col.id] ?? [];
            const isDragTarget = dragOverCol === col.id;
            return (
              <div key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                onDragLeave={() => setDragOverCol(null)}
                className={`rounded-2xl border ${col.border} ${col.bg} p-3 space-y-2.5 min-h-[300px] transition-all ${isDragTarget ? "ring-2 ring-[var(--primary)]/40 scale-[1.01]" : ""}`}>
                <div className={`flex items-center justify-between mb-1 p-2 rounded-xl ${col.headerBg}`}>
                  <span className={`text-xs font-black uppercase tracking-widest ${col.color}`}>{col.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.headerBg} ${col.color}`}>{colQuests.length}</span>
                </div>
                {colQuests.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 opacity-40">
                    <Circle size={20} className="text-slate-600" />
                    <p className="text-xs text-slate-600">Drop quest di sini</p>
                  </div>
                )}
                {colQuests.map((quest: any, i: number) => (
                  <QuestCard key={quest.id} quest={quest} index={i}
                    onDragStart={() => handleDragStart(quest.id)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggingId === quest.id} />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Sprint Modal */}
      <AnimatePresence>
        {showSprintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSprintModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#11141c] border border-white/10 rounded-3xl p-6 shadow-2xl relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">Buat Sprint Baru</h3>
                <button onClick={() => setShowSprintModal(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"><X size={14} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Sprint</label>
                  <input value={sprintForm.name} onChange={(e) => setSprintForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Contoh: Sprint 1 - MVP"
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                    <input type="date" value={sprintForm.startDate} onChange={(e) => setSprintForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">End Date</label>
                    <input type="date" value={sprintForm.endDate} onChange={(e) => setSprintForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none [color-scheme:dark]" />
                  </div>
                </div>
              </div>
              <button onClick={() => sprintMutation.mutate()} disabled={!sprintForm.name || !sprintForm.startDate || !sprintForm.endDate || sprintMutation.isPending}
                className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {sprintMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Simpan Sprint
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Quest Modal */}
      <AnimatePresence>
        {showQuestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !createQuestMutation.isPending && setShowQuestModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#11141c] border border-white/10 rounded-3xl p-7 shadow-2xl relative z-10 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between sticky top-0 bg-[#11141c] pb-2">
                <h3 className="text-xl font-black text-white flex items-center gap-2"><Plus size={18} className="text-[var(--primary)]" /> Tambah Quest ke Tim</h3>
                <button onClick={() => setShowQuestModal(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"><X size={14} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Judul Quest</label>
                  <input value={questForm.title} onChange={e => setQuestForm(p => ({ ...p, title: e.target.value }))} placeholder="Contoh: Implement auth system"
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Deskripsi (Opsional)</label>
                  <textarea value={questForm.description} onChange={e => setQuestForm(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Detail quest..."
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Difficulty</label>
                    <select value={questForm.difficulty} onChange={e => setQuestForm(p => ({ ...p, difficulty: e.target.value }))}
                      className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="extreme">Extreme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kategori</label>
                    <select value={questForm.category} onChange={e => setQuestForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none">
                      {["feature","bugfix","refactor","devops","documentation","review","testing","planning"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">XP Reward</label>
                    <input type="number" min={10} value={questForm.xp_reward} onChange={e => setQuestForm(p => ({ ...p, xp_reward: Number(e.target.value) }))}
                      className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Coin Reward</label>
                    <input type="number" min={0} value={questForm.coin_reward} onChange={e => setQuestForm(p => ({ ...p, coin_reward: Number(e.target.value) }))}
                      className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Assign ke Member (Opsional)</label>
                  <select value={questForm.assignee_id} onChange={e => setQuestForm(p => ({ ...p, assignee_id: e.target.value }))}
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none">
                    <option value="">Tidak di-assign</option>
                    {(members as any[]).map((m: any) => {
                      const u = m.users ?? m;
                      return <option key={m.user_id ?? u.id} value={m.user_id ?? u.id}>{u.username}</option>;
                    })}
                  </select>
                </div>
              </div>
              <button onClick={() => createQuestMutation.mutate()} disabled={!questForm.title.trim() || createQuestMutation.isPending}
                className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {createQuestMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Tambahkan ke Board
              </button>
              {createQuestMutation.isError && <p className="text-red-400 text-xs text-center">{(createQuestMutation.error as Error)?.message}</p>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Quest Card with Drag Support ────────────────────────────────────────────
function QuestCard({ quest, index, onDragStart, onDragEnd, isDragging }: {
  quest: any; index: number; onDragStart: () => void; onDragEnd: () => void; isDragging: boolean;
}) {
  const assignee = quest.assignee;
  const creator = quest.creator;
  const classKey = assignee?.class ?? "fullstack";
  const ClassIcon = CLASS_ICONS[classKey] ?? Swords;

  return (
    <motion.div
      key={quest.id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 5 }} animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`p-3.5 rounded-xl bg-[var(--bg-card)] border border-white/5 space-y-2.5 cursor-grab active:cursor-grabbing hover:border-white/15 transition-all select-none ${isDragging ? "opacity-40 scale-95" : ""}`}>
      <div className="flex items-start gap-2">
        <GripVertical size={14} className="text-slate-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">{quest.title}</p>
          {quest.description && <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{quest.description}</p>}
        </div>
        {quest.is_completed && <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {quest.difficulty && (
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${DIFFICULTY_COLORS[quest.difficulty] ?? DIFFICULTY_COLORS.medium}`}>
            {quest.difficulty}
          </span>
        )}
        {quest.category && quest.category !== "general" && (
          <span className="text-[9px] font-bold text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{quest.category}</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-bold"><Zap size={9} /> {quest.xp_reward} XP</span>
          <span className="text-[10px] text-yellow-500 flex items-center gap-1"><Coins size={9} /> {quest.coin_reward}G</span>
        </div>
        <div className="flex -space-x-1.5 overflow-hidden">
          {creator && (
            <div className={`w-5 h-5 rounded-lg bg-slate-800 flex items-center justify-center text-[7px] font-bold text-slate-400 border border-white/10 relative z-10`} title={`Creator: ${creator.username}`}>
              {creator.avatar_url ? <img src={creator.avatar_url} alt="" className="w-full h-full object-cover rounded" /> : creator.username?.[0]?.toUpperCase()}
            </div>
          )}
          {assignee && (
            <div className={`w-5 h-5 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center text-[7px] font-bold text-white border border-white/20 relative z-20 -ml-1`} title={`Assignee: ${assignee.username}`}>
              {assignee.avatar_url ? <img src={assignee.avatar_url} alt="" className="w-full h-full object-cover rounded" /> : assignee.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
