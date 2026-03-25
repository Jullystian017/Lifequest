"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { workspacesQueryKey, fetchUserWorkspaces } from "@/lib/queries";
import { Globe, Loader2, Users, CheckCircle2, Circle, Zap, Coins } from "lucide-react";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [sharedQuests, setSharedQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, []);

  const { data: workspaces = [] } = useQuery({
    queryKey: workspacesQueryKey(userId!),
    queryFn: () => fetchUserWorkspaces(userId!),
    enabled: !!userId,
  });

  const activeWorkspace = workspaces[0];

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    supabase
      .from("quests")
      .select("*, users(username, class)")
      .eq("workspace_id", activeWorkspace.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setSharedQuests(data ?? []); setLoading(false); });
  }, [activeWorkspace?.id]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Globe size={24} className="text-blue-400" /> Sprint Board
          </h1>
          <p className="text-slate-400 text-sm mt-1">Shared quests for {activeWorkspace.name}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users size={14} />
          <span>{sharedQuests.length} shared quests</span>
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
          Belum ada shared quest. Quest dengan workspace_id akan muncul di sini.
        </div>
      )}
    </div>
  );
}
