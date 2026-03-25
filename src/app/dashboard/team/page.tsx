"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { workspacesQueryKey, fetchUserWorkspaces, workspaceMembersQueryKey, fetchWorkspaceMembers } from "@/lib/queries";
import { joinWorkspace, createWorkspace } from "@/lib/mutations";
import { useWorkspaceStore } from "@/store/workspaceStore";
import {
  Users,
  Plus,
  LogIn,
  Copy,
  Check,
  Swords,
  Zap,
  Shield,
  Code2,
  Crown,
  ChevronRight,
  Loader2,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CLASS_ICONS: Record<string, any> = {
  frontend: Code2,
  backend: Shield,
  devops: Zap,
  fullstack: Swords,
};
const CLASS_COLORS: Record<string, string> = {
  frontend: "text-cyan-400",
  backend: "text-purple-400",
  devops: "text-orange-400",
  fullstack: "text-emerald-400",
};

export default function TeamPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [wsName, setWsName] = useState("");
  const [wsDesc, setWsDesc] = useState("");
  const [inviteInput, setInviteInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "create") setShowCreateModal(true);
    if (action === "join") setShowJoinModal(true);
  }, [searchParams]);

  const { data: workspaces = [], refetch: refetchWorkspaces } = useQuery({
    queryKey: workspacesQueryKey(userId!),
    queryFn: () => fetchUserWorkspaces(userId!),
    enabled: !!userId,
  });

  const activeWorkspace = activeWorkspaceId ? workspaces.find((w: any) => w.id === activeWorkspaceId) : null;

  // Auto-set workspace id if newly fetched and none selected
  useEffect(() => {
     if (!activeWorkspaceId && workspaces.length > 0) {
         setActiveWorkspaceId(workspaces[0].id);
     }
  }, [workspaces, activeWorkspaceId, setActiveWorkspaceId]);

  const { data: members = [] } = useQuery({
    queryKey: workspaceMembersQueryKey(activeWorkspace?.id),
    queryFn: () => fetchWorkspaceMembers(activeWorkspace?.id),
    enabled: !!activeWorkspace?.id,
  });

  const createMutation = useMutation({
    mutationFn: () => createWorkspace(userId!, wsName, wsDesc),
    onSuccess: (ws) => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey(userId!) });
      setActiveWorkspaceId(ws.id);
      setShowCreateModal(false);
      setWsName(""); setWsDesc("");
    },
  });

  const joinMutation = useMutation({
    mutationFn: () => joinWorkspaceByCode(userId!, inviteInput),
    onSuccess: (ws) => {
      queryClient.invalidateQueries({ queryKey: workspacesQueryKey(userId!) });
      setActiveWorkspaceId(ws.id);
      setShowJoinModal(false);
      setInviteInput("");
    },
  });

  const copyInviteCode = () => {
    if (activeWorkspace?.invite_code) {
      navigator.clipboard.writeText(activeWorkspace.invite_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // No workspace state
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
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/20"
          >
            <Plus size={16} /> Buat Workspace
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
          >
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
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{activeWorkspace?.name ?? "Team Dashboard"}</h1>
          <p className="text-slate-400 text-sm mt-1">{activeWorkspace?.description ?? "Workspace tim kamu"}</p>
        </div>
        <div className="flex gap-2">
          {/* Invite code button */}
          {activeWorkspace?.invite_code && (
            <button onClick={copyInviteCode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-sm hover:bg-white/10 transition-all">
              {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {activeWorkspace.invite_code}
            </button>
          )}
          <button onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 font-bold text-sm hover:bg-[var(--primary)] hover:text-white transition-all">
            <Plus size={14} /> Workspace Baru
          </button>
        </div>
      </div>

      {/* Workspace Selector (if multiple) */}
      {workspaces.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {workspaces.map((ws: any) => (
            <button key={ws.id} onClick={() => setActiveWorkspaceId(ws.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeWorkspace?.id === ws.id ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"}`}>
              {ws.name}
            </button>
          ))}
        </div>
      )}

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Sprint Board", href: "/dashboard/team/board", icon: Globe, desc: "Shared Kanban tim", color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20" },
          { label: "Boss Raids", href: "/dashboard/team/boss", icon: Swords, desc: "Big projects & HP bar", color: "from-red-500/20 to-orange-500/10 border-red-500/20" },
          { label: "Activity Feed", href: "/dashboard/team/feed", icon: Zap, desc: "Real-time team events", color: "from-yellow-500/20 to-amber-500/10 border-yellow-500/20" },
        ].map(nav => (
          <Link key={nav.href} href={nav.href}
            className={`p-5 rounded-2xl bg-gradient-to-br ${nav.color} border flex flex-col gap-2 hover:opacity-90 transition-all group`}>
            <nav.icon size={22} className="text-white" />
            <div>
              <p className="text-sm font-bold text-white">{nav.label}</p>
              <p className="text-xs text-slate-400">{nav.desc}</p>
            </div>
            <ChevronRight size={14} className="text-slate-500 ml-auto group-hover:text-white transition-colors" />
          </Link>
        ))}
      </div>

      {/* Members */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-[var(--primary)]" /> Anggota Tim ({members.length})
          </h2>
          <button onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline">
            <LogIn size={12} /> Undang
          </button>
        </div>
        <div className="space-y-3">
          {members.map((m: any) => {
            const member = m.users ?? m;
            const classKey = member.class ?? "fullstack";
            const ClassIcon = CLASS_ICONS[classKey] ?? Swords;
            return (
              <motion.div key={m.workspace_id + member.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20 flex items-center justify-center font-black text-white text-sm border border-white/10">
                  {member.username?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{member.username}</p>
                  <div className="flex items-center gap-1.5">
                    <ClassIcon size={10} className={CLASS_COLORS[classKey]} />
                    <span className="text-[10px] text-slate-500 capitalize">{classKey}</span>
                    <span className="text-[10px] text-slate-600">· Lv.{member.level ?? 1}</span>
                  </div>
                </div>
                {m.role === "owner" && <Crown size={14} className="text-yellow-400 shrink-0" />}
              </motion.div>
            );
          })}
          {members.length === 0 && (
            <p className="text-xs text-slate-600 text-center py-4">Belum ada anggota lain. Bagikan kode undangan!</p>
          )}
        </div>
      </div>

      {renderModals()}
    </div>
  );
}
