"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  workspacesQueryKey, fetchUserWorkspaces,
  workspaceMembersQueryKey, fetchWorkspaceMembers,
  teamStatsQueryKey, fetchTeamStats,
  sprintsQueryKey, fetchWorkspaceSprints,
  memberProfileQueryKey, fetchMemberProfile,
  memberRecentQuestsQueryKey, fetchMemberRecentQuests,
} from "@/lib/queries";
import {
  joinWorkspaceByCode, createWorkspace,
  updateWorkspaceSettings, regenerateInviteCode,
  updateMemberRole, kickMember, leaveWorkspace, deleteWorkspace,
  sendTeamNotification, logActivityFeedEvent,
} from "@/lib/mutations";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users, Plus, LogIn, Copy, Check, Swords, Zap, Shield, Code2, Crown,
  ChevronRight, Loader2, Globe, BarChart3, Settings, Trophy, Target,
  RefreshCw, Trash2, UserMinus, Star, Activity, X, ChevronDown,
  ShieldCheck, UserCheck, Flame, BookOpen, TrendingUp, Calendar,
} from "lucide-react";

const CLASS_ICONS: Record<string, any> = { frontend: Code2, backend: Shield, devops: Zap, fullstack: Swords };
const CLASS_COLORS: Record<string, string> = { frontend: "text-cyan-400", backend: "text-purple-400", devops: "text-orange-400", fullstack: "text-emerald-400" };
const CLASS_BG: Record<string, string> = { frontend: "bg-cyan-500/10 border-cyan-500/20", backend: "bg-purple-500/10 border-purple-500/20", devops: "bg-orange-500/10 border-orange-500/20", fullstack: "bg-emerald-500/10 border-emerald-500/20" };
const STAT_COLORS: Record<string, string> = { vitality: "from-rose-500 to-pink-500", knowledge: "from-blue-500 to-cyan-500", creativity: "from-violet-500 to-purple-500", discipline: "from-amber-500 to-yellow-500" };
const STAT_LABELS: Record<string, string> = { vitality: "Vitality", knowledge: "Knowledge", creativity: "Creativity", discipline: "Discipline" };

// ─── Member Profile Card Modal ───────────────────────────────────────────────
function MemberProfileModal({ member, workspaceId, onClose }: { member: any; workspaceId: string; onClose: () => void }) {
  const userId = member.users?.id ?? member.id;
  const { data: profile } = useQuery({ queryKey: memberProfileQueryKey(userId), queryFn: () => fetchMemberProfile(userId), enabled: !!userId });
  const { data: recentQuests = [] } = useQuery({ queryKey: memberRecentQuestsQueryKey(userId, workspaceId), queryFn: () => fetchMemberRecentQuests(userId, workspaceId), enabled: !!userId });

  const u = profile ?? member.users ?? member;
  const classKey = u?.class ?? "fullstack";
  const ClassIcon = CLASS_ICONS[classKey] ?? Swords;
  const xpPct = u?.xp_to_next_level > 0 ? Math.round(((u?.xp ?? 0) / u.xp_to_next_level) * 100) : 0;
  const stats = u?.stats ?? {};

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-[#11141c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10">
        {/* Header gradient */}
        <div className={`h-24 bg-gradient-to-br ${classKey === "frontend" ? "from-cyan-600/30 to-blue-600/20" : classKey === "backend" ? "from-purple-600/30 to-indigo-600/20" : classKey === "devops" ? "from-orange-600/30 to-amber-600/20" : "from-emerald-600/30 to-teal-600/20"} relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl bg-black/20 text-white/60 hover:text-white transition-colors"><X size={16} /></button>
        </div>
        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end gap-4">
            <div className={`w-20 h-20 rounded-2xl border-4 border-[#11141c] ${CLASS_BG[classKey] ?? "bg-indigo-500/10 border-indigo-500/20"} flex items-center justify-center text-3xl font-black text-white shadow-2xl`}>
              {u?.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" /> : (u?.username?.[0]?.toUpperCase() ?? "?")}
            </div>
            <div className="mb-2 flex-1">
              <p className="text-lg font-black text-white">{u?.username ?? "—"}</p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${CLASS_BG[classKey]}`}>
                <ClassIcon size={10} className={CLASS_COLORS[classKey]} /><span className={CLASS_COLORS[classKey] + " capitalize"}>{classKey}</span>
              </span>
            </div>
            <div className="mb-2 text-right">
              <p className="text-xs text-slate-500">Level</p>
              <p className="text-2xl font-black text-white">{u?.level ?? 1}</p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-5">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>XP Progress</span><span>{u?.xp ?? 0} / {u?.xp_to_next_level ?? 100}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            </div>
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-indigo-400 font-bold">Total XP: {(u?.total_xp ?? 0).toLocaleString()}</span>
              <span className="text-orange-400 flex items-center gap-1"><Flame size={9} /> {u?.streak ?? 0} hari streak</span>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2 mb-5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Character Stats</p>
            {Object.entries(STAT_LABELS).map(([key, label]) => {
              const val = stats[key] ?? 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-[10px] mb-1"><span className="text-slate-400">{label}</span><span className="text-white font-bold">{val}</span></div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.6, delay: 0.1 }} className={`h-full rounded-full bg-gradient-to-r ${STAT_COLORS[key]}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Quests in workspace */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Recent Quests di Tim</p>
            {(recentQuests as any[]).length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-3">Belum ada quest di tim ini</p>
            ) : (
              <div className="space-y-1.5">
                {(recentQuests as any[]).map((q: any) => (
                  <div key={q.id} className="flex items-center gap-2 p-2 rounded-xl bg-white/3">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${q.is_completed ? "bg-emerald-400" : "bg-slate-600"}`} />
                    <p className="text-xs text-slate-300 flex-1 truncate">{q.title}</p>
                    <span className="text-[9px] text-indigo-400 font-bold">{q.xp_reward} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Workspace Settings Modal ────────────────────────────────────────────────
function WorkspaceSettingsModal({ workspace, userId, onClose }: { workspace: any; userId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { setActiveWorkspaceId } = useWorkspaceStore();
  const router = useRouter();
  const [name, setName] = useState(workspace?.name ?? "");
  const [desc, setDesc] = useState(workspace?.description ?? "");
  const [copiedCode, setCopiedCode] = useState(false);

  const updateMutation = useMutation({
    mutationFn: () => updateWorkspaceSettings(workspace.id, { name, description: desc }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey(userId) });
      onClose();
    },
  });

  const regenMutation = useMutation({
    mutationFn: () => regenerateInviteCode(workspace.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workspacesQueryKey(userId) }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWorkspace(workspace.id),
    onSuccess: () => {
      setActiveWorkspaceId(null);
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey(userId) });
      router.push("/dashboard");
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !updateMutation.isPending && onClose()} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-[#11141c] border border-white/10 rounded-3xl p-7 shadow-2xl z-10 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2"><Settings size={18} className="text-[var(--primary)]" /> Pengaturan Workspace</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"><X size={14} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Workspace</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm transition-all" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Deskripsi</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm transition-all resize-none" />
          </div>
          {/* Invite code */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Kode Undangan</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#0D1017] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white">{workspace?.invite_code}</div>
              <button onClick={() => { navigator.clipboard.writeText(workspace?.invite_code ?? ""); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all">
                {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
              <button onClick={() => regenMutation.mutate()} disabled={regenMutation.isPending}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all disabled:opacity-50">
                <RefreshCw size={14} className={regenMutation.isPending ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
        <button onClick={() => updateMutation.mutate()} disabled={!name.trim() || updateMutation.isPending}
          className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Simpan Perubahan
        </button>
        {/* Danger zone */}
        {workspace?.myRole === "owner" && (
          <div className="border border-red-500/20 rounded-2xl p-4 space-y-2">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Danger Zone</p>
            <button onClick={() => { if (confirm("Yakin mau hapus workspace ini? Semua data akan hilang!")) deleteMutation.mutate(); }}
              disabled={deleteMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
              {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Hapus Workspace
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Main Team Page ──────────────────────────────────────────────────────────
export default function TeamPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [wsName, setWsName] = useState("");
  const [wsDesc, setWsDesc] = useState("");
  const [inviteInput, setInviteInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, []);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "create") setShowCreateModal(true);
    if (action === "join") setShowJoinModal(true);
  }, [searchParams]);

  const { data: workspaces = [] } = useQuery({
    queryKey: workspacesQueryKey(userId!),
    queryFn: () => fetchUserWorkspaces(userId!),
    enabled: !!userId,
  });

  const activeWorkspace = activeWorkspaceId ? workspaces.find((w: any) => w.id === activeWorkspaceId) : null;

  const { data: members = [] } = useQuery({
    queryKey: workspaceMembersQueryKey(activeWorkspace?.id),
    queryFn: () => fetchWorkspaceMembers(activeWorkspace?.id),
    enabled: !!activeWorkspace?.id,
  });

  const { data: teamStats } = useQuery({
    queryKey: teamStatsQueryKey(activeWorkspace?.id!),
    queryFn: () => fetchTeamStats(activeWorkspace?.id!),
    enabled: !!activeWorkspace?.id,
  });

  const { data: sprints = [] } = useQuery({
    queryKey: sprintsQueryKey(activeWorkspace?.id!),
    queryFn: () => fetchWorkspaceSprints(activeWorkspace?.id!),
    enabled: !!activeWorkspace?.id,
  });

  const myRole = (members as any[]).find(m => m.user_id === userId)?.role ?? "member";
  const isOwnerOrAdmin = myRole === "owner" || myRole === "admin";

  // Active sprints
  const activeSprints = (sprints as any[]).filter(s => s.status === "active");

  const createMutation = useMutation({
    mutationFn: () => createWorkspace(userId!, wsName, wsDesc),
    onSuccess: async (ws) => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey(userId!) });
      setActiveWorkspaceId(ws.id);
      setShowCreateModal(false);
      setWsName(""); setWsDesc("");
    },
  });

  const joinMutation = useMutation({
    mutationFn: () => joinWorkspaceByCode(userId!, inviteInput),
    onSuccess: async (ws) => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey(userId!) });
      setActiveWorkspaceId(ws.id);
      setShowJoinModal(false);
      setInviteInput("");
      await sendTeamNotification(ws.id, "Anggota Baru Bergabung! 🎉", `Selamat datang anggota baru di workspace!`);
    },
  });

  const kickMutation = useMutation({
    mutationFn: ({ wId, uId }: { wId: string; uId: string }) => kickMember(wId, uId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workspaceMembersQueryKey(activeWorkspace?.id) }),
  });

  const roleMutation = useMutation({
    mutationFn: ({ uId, role }: { uId: string; role: "admin" | "member" }) => updateMemberRole(activeWorkspace!.id, uId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workspaceMembersQueryKey(activeWorkspace?.id) }),
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveWorkspace(activeWorkspace!.id, userId!),
    onSuccess: () => {
      setActiveWorkspaceId(null);
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey(userId!) });
      router.push("/dashboard");
    },
  });

  const copyInviteCode = () => {
    if (activeWorkspace?.invite_code) {
      navigator.clipboard.writeText(activeWorkspace.invite_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (workspaces.length === 0 && userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-in">
        <div className="p-6 rounded-3xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
          <Users size={52} className="text-[var(--primary)]" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-2">Belum ada Workspace</h2>
          <p className="text-slate-400 text-sm max-w-sm">Buat workspace tim baru atau join ke tim yang sudah ada dengan kode undangan.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/20">
            <Plus size={16} /> Buat Workspace
          </button>
          <button onClick={() => setShowJoinModal(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
            <LogIn size={16} /> Masukkan Kode
          </button>
        </div>
        {renderModals()}
      </div>
    );
  }

  function renderModals() {
    return (
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !createMutation.isPending && setShowCreateModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#11141c] border border-white/10 rounded-3xl p-8 space-y-5 shadow-2xl relative z-10">
              <h3 className="text-xl font-black text-white">Buat Workspace Baru</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Workspace</label>
                  <input value={wsName} onChange={e => setWsName(e.target.value)} placeholder="Contoh: Tim Backend Alpha"
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Deskripsi (Opsional)</label>
                  <textarea value={wsDesc} onChange={e => setWsDesc(e.target.value)} rows={2} placeholder="Deskripsi tim atau proyek..."
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all text-sm resize-none" />
                </div>
              </div>
              <button onClick={() => createMutation.mutate()} disabled={!wsName.trim() || createMutation.isPending}
                className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Buat Workspace
              </button>
              {createMutation.isError && <p className="text-red-400 text-xs text-center">{(createMutation.error as Error)?.message}</p>}
            </motion.div>
          </div>
        )}
        {showJoinModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !joinMutation.isPending && setShowJoinModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#11141c] border border-white/10 rounded-3xl p-8 space-y-5 shadow-2xl relative z-10">
              <h3 className="text-xl font-black text-white">Bergabung ke Workspace</h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Kode Undangan</label>
                <input value={inviteInput} onChange={e => setInviteInput(e.target.value)} placeholder="Contoh: AB1C2D"
                  className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all text-sm font-mono uppercase" />
              </div>
              <button onClick={() => joinMutation.mutate()} disabled={!inviteInput.trim() || joinMutation.isPending}
                className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {joinMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />} Bergabung
              </button>
              {joinMutation.isError && <p className="text-red-400 text-xs text-center">{(joinMutation.error as Error)?.message}</p>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{activeWorkspace?.name ?? "Team Dashboard"}</h1>
          <p className="text-slate-400 text-sm mt-1">{activeWorkspace?.description ?? "Workspace tim kamu"}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {activeWorkspace?.invite_code && (
            <button onClick={copyInviteCode} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-sm hover:bg-white/10 transition-all">
              {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />} {activeWorkspace.invite_code}
            </button>
          )}
          {isOwnerOrAdmin && (
            <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all">
              <Settings size={14} /> Settings
            </button>
          )}
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 font-bold text-sm hover:bg-[var(--primary)] hover:text-white transition-all">
            <Plus size={14} /> Workspace Baru
          </button>
        </div>
      </div>

      {/* Workspace Tabs (multiple workspaces) */}
      {workspaces.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {(workspaces as any[]).map((ws: any) => (
            <button key={ws.id} onClick={() => setActiveWorkspaceId(ws.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeWorkspace?.id === ws.id ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"}`}>
              {ws.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Team Stats Overview ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Quest Minggu Ini", value: teamStats?.weekQuestsCount ?? 0, icon: Target, color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20", textColor: "text-emerald-400" },
          { label: "XP Tim Minggu Ini", value: `+${(teamStats?.weekXpGained ?? 0).toLocaleString()}`, icon: Zap, color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/20", textColor: "text-indigo-400" },
          { label: "Streak Tertinggi", value: `${teamStats?.highestStreak ?? 0} hari`, icon: Flame, color: "from-orange-500/20 to-amber-500/10 border-orange-500/20", textColor: "text-orange-400" },
          { label: "Total Member Aktif", value: `${teamStats?.activeMembers ?? 0}/${teamStats?.totalMembers ?? 0}`, icon: Users, color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20", textColor: "text-blue-400" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} border space-y-2`}>
            <stat.icon size={16} className={stat.textColor} />
            <p className={`text-xl font-black ${stat.textColor}`}>{stat.value}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Most Active Member */}
      {teamStats?.mostActiveUser && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/20">
          <Star size={18} className="text-yellow-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-yellow-400">MVP Minggu Ini 🏆</p>
            <p className="text-sm font-black text-white">{teamStats.mostActiveUser.username} <span className="text-slate-400 font-normal">— {teamStats.mostActiveUserQuestCount} quest selesai minggu ini</span></p>
          </div>
        </div>
      )}

      {/* ── Active Sprint Progress ───────────────────────────────────────── */}
      {activeSprints.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={15} className="text-blue-400" />
            <h2 className="text-sm font-bold text-white">Sprint Aktif</h2>
          </div>
          {activeSprints.map((sprint: any) => (
            <SprintProgressBar key={sprint.id} sprint={sprint} workspaceId={activeWorkspace?.id} />
          ))}
        </div>
      )}


      {/* ── Members ─────────────────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-[var(--primary)]" /> Anggota Tim ({(members as any[]).length})
          </h2>
          <button onClick={() => setShowJoinModal(true)} className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline">
            <LogIn size={12} /> Undang
          </button>
        </div>
        <div className="space-y-2">
          {(members as any[]).map((m: any) => {
            const member = m.users ?? m;
            const classKey = member.class ?? "fullstack";
            const ClassIcon = CLASS_ICONS[classKey] ?? Swords;
            const isMe = m.user_id === userId;
            return (
              <motion.div key={m.workspace_id + member.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all group">
                <button onClick={() => setSelectedMember(m)} className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20 flex items-center justify-center font-black text-white text-sm border border-white/10 hover:border-white/30 transition-all shrink-0">
                  {member.avatar_url ? <img src={member.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" /> : member.username?.[0]?.toUpperCase() ?? "?"}
                </button>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedMember(m)}>
                  <p className="text-sm font-bold text-white truncate">{member.username} {isMe && <span className="text-[10px] text-slate-500">(Kamu)</span>}</p>
                  <div className="flex items-center gap-1.5">
                    <ClassIcon size={10} className={CLASS_COLORS[classKey]} />
                    <span className="text-[10px] text-slate-500 capitalize">{classKey}</span>
                    <span className="text-[10px] text-slate-600">· Lv.{member.level ?? 1}</span>
                  </div>
                </div>
                {/* Role badge */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {m.role === "owner" && <span className="flex items-center gap-1 text-[9px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20"><Crown size={9} /> Owner</span>}
                  {m.role === "admin" && <span className="flex items-center gap-1 text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20"><ShieldCheck size={9} /> Admin</span>}
                  {/* Owner actions */}
                  {isOwnerOrAdmin && !isMe && m.role !== "owner" && (
                    <div className="hidden group-hover:flex items-center gap-1">
                      {m.role === "member" ? (
                        <button onClick={() => roleMutation.mutate({ uId: m.user_id, role: "admin" })} title="Promote ke Admin"
                          className="p-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-[9px] font-bold px-2">
                          +Admin
                        </button>
                      ) : (
                        <button onClick={() => roleMutation.mutate({ uId: m.user_id, role: "member" })} title="Turunkan ke Member"
                          className="p-1 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-[9px] font-bold px-2">
                          -Admin
                        </button>
                      )}
                      <button onClick={() => { if (confirm(`Kick ${member.username}?`)) kickMutation.mutate({ wId: activeWorkspace!.id, uId: m.user_id }); }} title="Kick"
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                        <UserMinus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          {/* Leave workspace button (non-owner) */}
          {myRole !== "owner" && userId && (
            <button onClick={() => { if (confirm("Yakin mau keluar dari workspace ini?")) leaveMutation.mutate(); }}
              disabled={leaveMutation.isPending}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/5 text-red-400 border border-red-500/10 text-xs font-bold hover:bg-red-500/10 transition-all disabled:opacity-50">
              {leaveMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <UserMinus size={12} />} Keluar dari Workspace
            </button>
          )}
        </div>
      </div>

      {renderModals()}

      {/* Member Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberProfileModal member={selectedMember} workspaceId={activeWorkspace?.id ?? ""} onClose={() => setSelectedMember(null)} />
        )}
      </AnimatePresence>

      {/* Workspace Settings Modal */}
      <AnimatePresence>
        {showSettings && activeWorkspace && userId && (
          <WorkspaceSettingsModal workspace={activeWorkspace} userId={userId} onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sprint Progress Bar Component ───────────────────────────────────────────
function SprintProgressBar({ sprint, workspaceId }: { sprint: any; workspaceId: string }) {
  const supabase = createClient();
  const [stats, setStats] = useState<{ done: number; total: number } | null>(null);

  useEffect(() => {
    if (!sprint?.id || !workspaceId) return;
    supabase
      .from("quests")
      .select("id, is_completed")
      .eq("sprint_id", sprint.id)
      .eq("workspace_id", workspaceId)
      .then(({ data }) => {
        const total = (data ?? []).length;
        const done = (data ?? []).filter(q => q.is_completed).length;
        setStats({ done, total });
      });
  }, [sprint?.id, workspaceId]);

  const pct = stats && stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const endDate = sprint.end_date ? new Date(sprint.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white">{sprint.name}</span>
        <div className="flex items-center gap-3">
          <span className="text-slate-500">Deadline: {endDate}</span>
          <span className="font-bold text-blue-400">{stats?.done ?? 0}/{stats?.total ?? 0} quest</span>
        </div>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
          className={`h-full rounded-full ${pct >= 100 ? "bg-emerald-500" : pct >= 60 ? "bg-blue-500" : pct >= 30 ? "bg-yellow-500" : "bg-red-500"}`} />
      </div>
      <p className="text-[10px] text-slate-500 text-right">{pct}% selesai</p>
    </div>
  );
}
