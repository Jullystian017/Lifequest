"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { workspacesQueryKey, fetchUserWorkspaces, sprintsQueryKey, fetchWorkspaceSprints } from "@/lib/queries";
import { createSprint } from "@/lib/mutations";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Globe, Loader2, Users, CheckCircle2, Circle, Zap, Coins, Calendar, Plus, ChevronDown } from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  hard: "text-red-400 bg-red-500/10 border-red-500/20",
  extreme: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const COLUMNS = [
  { id: "todo", label: "Todo", color: "text-slate-400", border: "border-slate-500/20", bg: "bg-slate-500/5" },
  { id: "in_progress", label: "In Progress", color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
  { id: "done", label: "Done", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
];

export default function TeamBoardPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [sharedQuests, setSharedQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sprint Manager State
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [sprintForm, setSprintForm] = useState({ name: "", startDate: "", endDate: "" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, []);

  const { activeWorkspaceId } = useWorkspaceStore();

  const { data: workspaces = [] } = useQuery({
    queryKey: workspacesQueryKey(userId!),
    queryFn: () => fetchUserWorkspaces(userId!),
    enabled: !!userId,
  });

  const activeWorkspace = activeWorkspaceId ? workspaces.find((w: any) => w.id === activeWorkspaceId) : null;

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    let query = supabase
      .from("quests")
      .select("*, users(username, class)")
      .eq("workspace_id", activeWorkspace.id);
      
    if (selectedSprintId) {
        query = query.eq("sprint_id", selectedSprintId);
    }
      
    query.order("created_at", { ascending: false })
      .then(({ data }) => { setSharedQuests(data ?? []); setLoading(false); });
  }, [activeWorkspace?.id, selectedSprintId]);

  const { data: sprints = [] } = useQuery({
    queryKey: sprintsQueryKey(activeWorkspace?.id),
    queryFn: () => fetchWorkspaceSprints(activeWorkspace?.id),
    enabled: !!activeWorkspace?.id,
  });

  const sprintMutation = useMutation({
    mutationFn: () => createSprint(activeWorkspace!.id, sprintForm.name, sprintForm.startDate, sprintForm.endDate),
    onSuccess: (newSprint: any) => {
        queryClient.invalidateQueries({ queryKey: sprintsQueryKey(activeWorkspace!.id) });
        setSelectedSprintId(newSprint.id);
        setShowSprintModal(false);
        setSprintForm({ name: "", startDate: "", endDate: "" });
    }
  });

  const columnsMap = COLUMNS.reduce((acc, col) => {
    acc[col.id] = sharedQuests.filter(q => {
      if (col.id === "done") return q.is_completed || q.status === "done";
      if (col.id === "in_progress") return !q.is_completed && (q.status === "in_progress" || q.status === "in_review");
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
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Globe size={24} className="text-blue-400" /> Sprint Board
          </h1>
          <p className="text-slate-400 text-sm mt-1">Shared quests for {activeWorkspace.name}</p>
        </div>
        
        {/* Sprint Selector */}
        <div className="flex items-center gap-2">
            <div className="relative group">
                <select 
                    value={selectedSprintId || ""} 
                    onChange={(e) => setSelectedSprintId(e.target.value || null)}
                    className="appearance-none bg-[var(--bg-card)] border border-[var(--border-light)] text-white text-sm font-bold rounded-xl pl-4 pr-10 py-2 outline-none focus:border-[var(--primary)] hover:border-white/20 transition-all cursor-pointer min-w-[160px]"
                >
                    <option value="">All Sprints (Backlog)</option>
                    {sprints.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <button 
                onClick={() => setShowSprintModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 font-bold text-sm hover:bg-[var(--primary)] hover:text-white transition-all"
            >
                <Calendar size={14} /> Buat Sprint
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLUMNS.map((col) => {
            const colQuests = columnsMap[col.id] ?? [];
            return (
              <div key={col.id} className={`rounded-2xl border ${col.border} ${col.bg} p-4 space-y-3 min-h-[200px]`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black uppercase tracking-widest ${col.color}`}>{col.label}</span>
                  <span className="text-xs text-slate-600 font-bold">{colQuests.length}</span>
                </div>
                {colQuests.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 opacity-40">
                    <Circle size={20} className="text-slate-600" />
                    <p className="text-xs text-slate-600">Kosong</p>
                  </div>
                )}
                {colQuests.map((quest: any, i: number) => (
                  <motion.div key={quest.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-[var(--bg-card)] border border-white/5 space-y-2 hover:border-white/10 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-white leading-tight">{quest.title}</p>
                      {quest.is_completed && <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {quest.difficulty && (
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${DIFFICULTY_COLORS[quest.difficulty]}`}>
                          {quest.difficulty}
                        </span>
                      )}
                      {quest.users?.username && (
                        <span className="text-[9px] text-slate-500 flex items-center gap-1">
                          <Users size={8} /> {quest.users.username}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-indigo-400 flex items-center gap-1"><Zap size={9} /> {quest.xp_reward} XP</span>
                      <span className="text-[10px] text-yellow-500 flex items-center gap-1"><Coins size={9} /> {quest.coin_reward}G</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {!loading && sharedQuests.length === 0 && (
        <div className="text-center py-10 text-slate-500 text-sm">
          {selectedSprintId ? "Belum ada quest di sprint ini." : "Belum ada shared quest. Quest dengan workspace_id akan muncul di sini."}
        </div>
      )}

      {/* Create Sprint Modal */}
      {showSprintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSprintModal(false)} />
              <div className="w-full max-w-md bg-[#11141c] border border-white/10 rounded-3xl p-6 shadow-2xl relative z-10 space-y-5 animate-in fade-in zoom-in duration-200">
                  <h3 className="text-xl font-black text-white">Buat Sprint Baru</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Sprint</label>
                          <input 
                              value={sprintForm.name} 
                              onChange={(e) => setSprintForm(prev => ({...prev, name: e.target.value}))} 
                              placeholder="Contoh: Sprint 1 - MVP"
                              className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none" 
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                              <input 
                                  type="date"
                                  value={sprintForm.startDate} 
                                  onChange={(e) => setSprintForm(prev => ({...prev, startDate: e.target.value}))} 
                                  className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none [color-scheme:dark]" 
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">End Date</label>
                              <input 
                                  type="date"
                                  value={sprintForm.endDate} 
                                  onChange={(e) => setSprintForm(prev => ({...prev, endDate: e.target.value}))} 
                                  className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none [color-scheme:dark]" 
                              />
                          </div>
                      </div>
                  </div>
                  <button 
                      onClick={() => sprintMutation.mutate()}
                      disabled={!sprintForm.name || !sprintForm.startDate || !sprintForm.endDate || sprintMutation.isPending}
                      className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                      {sprintMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      Simpan Sprint
                  </button>
              </div>
          </div>
      )}
    </div>
  );
}
