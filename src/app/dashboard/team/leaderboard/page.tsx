"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { workspacesQueryKey, fetchUserWorkspaces, workspaceLeaderboardQueryKey, fetchWorkspaceLeaderboard } from "@/lib/queries";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Trophy, Crown, Medal, Loader2, Zap, Flame, Code2, Shield, Swords, Star } from "lucide-react";

const CLASS_COLORS: Record<string, string> = { frontend: "text-cyan-400", backend: "text-purple-400", devops: "text-orange-400", fullstack: "text-emerald-400" };
const CLASS_ICONS: Record<string, any> = { frontend: Code2, backend: Shield, devops: Zap, fullstack: Swords };
const CLASS_BG: Record<string, string> = { frontend: "from-cyan-500/20 to-blue-500/10", backend: "from-purple-500/20 to-indigo-500/10", devops: "from-orange-500/20 to-amber-500/10", fullstack: "from-emerald-500/20 to-teal-500/10" };

const RANK_STYLES = [
  { border: "border-yellow-500/40", bg: "bg-yellow-500/5", glow: "shadow-yellow-500/20", badge: "from-yellow-500 to-amber-500", icon: <Crown size={16} className="text-yellow-400" /> },
  { border: "border-slate-400/30", bg: "bg-slate-500/5", glow: "shadow-slate-400/10", badge: "from-slate-400 to-slate-500", icon: <Medal size={16} className="text-slate-300" /> },
  { border: "border-amber-700/40", bg: "bg-amber-700/5", glow: "shadow-amber-700/10", badge: "from-amber-600 to-amber-700", icon: <Medal size={16} className="text-amber-600" /> },
];

export default function TeamLeaderboardPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const { activeWorkspaceId } = useWorkspaceStore();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, []);

  const { data: workspaces = [] } = useQuery({
    queryKey: workspacesQueryKey(userId!),
    queryFn: () => fetchUserWorkspaces(userId!),
    enabled: !!userId,
  });
  const activeWorkspace = activeWorkspaceId ? (workspaces as any[]).find(w => w.id === activeWorkspaceId) : null;

  const { data: leaders = [], isLoading } = useQuery({
    queryKey: workspaceLeaderboardQueryKey(activeWorkspace?.id ?? ""),
    queryFn: () => fetchWorkspaceLeaderboard(activeWorkspace?.id ?? ""),
    enabled: !!activeWorkspace?.id,
  });

  const maxXp = Math.max(1, ...(leaders as any[]).map((l: any) => l.total_xp ?? 0));

  if (!activeWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <Trophy size={48} className="text-slate-600" />
        <h2 className="text-xl font-bold text-white">Belum ada Workspace</h2>
        <p className="text-slate-400 text-sm">Pilih workspace di sidebar untuk melihat leaderboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <Trophy size={24} className="text-yellow-400" /> Team Leaderboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">Ranking anggota tim {activeWorkspace.name}</p>
      </div>

      {isLoading && <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>}

      {/* Top 3 Podium */}
      {!isLoading && (leaders as any[]).length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-2 pt-6">
            <PodiumCard leader={(leaders as any[])[1]} rank={2} isMe={(leaders as any[])[1]?.id === userId} />
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center gap-2">
            <PodiumCard leader={(leaders as any[])[0]} rank={1} isMe={(leaders as any[])[0]?.id === userId} />
          </div>
          {/* 3rd */}
          <div className="flex flex-col items-center gap-2 pt-12">
            <PodiumCard leader={(leaders as any[])[2]} rank={3} isMe={(leaders as any[])[2]?.id === userId} />
          </div>
        </div>
      )}

      {/* Full ranking list */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Semua Anggota</h2>
        {(leaders as any[]).map((leader: any, index: number) => {
          const rank = index + 1;
          const rankStyle = RANK_STYLES[index] ?? null;
          const classKey = leader.class ?? "fullstack";
          const ClassIcon = CLASS_ICONS[classKey] ?? Swords;
          const isMe = leader.id === userId;
          const xpPct = maxXp > 0 ? Math.round((leader.total_xp / maxXp) * 100) : 0;

          return (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${rankStyle ? `${rankStyle.border} ${rankStyle.bg} shadow-lg ${rankStyle.glow}` : "border-white/5 bg-white/[0.02]"} ${isMe ? "ring-1 ring-[var(--primary)]/40" : ""}`}>
              {/* Rank */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${rankStyle ? `bg-gradient-to-br ${rankStyle.badge} text-white` : "bg-white/5 text-slate-400"}`}>
                {rank <= 3 ? rankStyle?.icon : rank}
              </div>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CLASS_BG[classKey] ?? "from-indigo-500/20 to-purple-500/10"} flex items-center justify-center font-black text-white text-sm border border-white/10 shrink-0`}>
                {leader.username?.[0]?.toUpperCase() ?? "?"}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-white truncate">{leader.username}</p>
                  {isMe && <span className="text-[9px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">Kamu</span>}
                  <span className={`flex items-center gap-1 text-[9px] font-bold ${CLASS_COLORS[classKey]} `}>
                    <ClassIcon size={9} /> {classKey}
                  </span>
                </div>
                {/* XP bar */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 0.8, delay: index * 0.05 }}
                      className={`h-full rounded-full ${rank === 1 ? "bg-gradient-to-r from-yellow-500 to-amber-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`} />
                  </div>
                  <span className="text-[10px] text-indigo-400 font-bold whitespace-nowrap">{(leader.total_xp ?? 0).toLocaleString()} XP</span>
                </div>
              </div>
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-right shrink-0">
                <div>
                  <p className="text-[10px] text-slate-500">Level</p>
                  <p className="text-base font-black text-white">{leader.level ?? 1}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Streak</p>
                  <p className="text-base font-black text-orange-400 flex items-center gap-1"><Flame size={12} />{leader.streak ?? 0}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
        {!isLoading && (leaders as any[]).length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Trophy size={40} className="mx-auto mb-3 text-slate-700" />
            <p>Belum ada data leaderboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PodiumCard({ leader, rank, isMe }: { leader: any; rank: number; isMe: boolean }) {
  const heights = ["h-28", "h-20", "h-16"];
  const podiumColors = ["from-yellow-500 to-amber-400", "from-slate-300 to-slate-400", "from-amber-700 to-amber-800"];
  const icons = [<Crown size={20} className="text-yellow-300" />, <Medal size={16} className="text-slate-200" />, <Medal size={14} className="text-amber-500" />];
  const classKey = leader?.class ?? "fullstack";

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {rank === 1 && <Star size={20} className="text-yellow-400 animate-pulse" />}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CLASS_BG[classKey] ?? "from-indigo-500/20 to-purple-500/10"} flex items-center justify-center font-black text-white text-xl border-2 ${rank === 1 ? "border-yellow-500/50" : "border-white/10"} ${isMe ? "ring-2 ring-[var(--primary)]" : ""}`}>
        {leader?.username?.[0]?.toUpperCase() ?? "?"}
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-white truncate max-w-[80px]">{leader?.username}</p>
        <p className="text-[10px] text-indigo-400">{(leader?.total_xp ?? 0).toLocaleString()} XP</p>
      </div>
      <div className={`w-full ${heights[rank - 1]} bg-gradient-to-b ${podiumColors[rank - 1]} rounded-t-xl flex items-center justify-center opacity-80`}>
        {icons[rank - 1]}
      </div>
    </div>
  );
}
