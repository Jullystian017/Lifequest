"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { workspacesQueryKey, fetchUserWorkspaces, fetchWorkspaceBosses, bossesQueryKey } from "@/lib/queries";
import { createBoss, damageBoss } from "@/lib/mutations";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Swords, Plus, Loader2, Skull, Trophy, Shield, Zap, ChevronDown, ChevronUp } from "lucide-react";

function HPBar({ current, max, color = "from-red-500 to-orange-500" }: { current: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.max(0, (current / max) * 100) : 0;
  return (
    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
  );
}

export default function BossRaidsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [bossName, setBossName] = useState("");
  const [bossDesc, setBossDesc] = useState("");
  const [bossMaxHp, setBossMaxHp] = useState(1000);
  const [expandedBoss, setExpandedBoss] = useState<string | null>(null);
  const [damageInput, setDamageInput] = useState<Record<string, number>>({});

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

  const { data: bosses = [], isLoading } = useQuery({
    queryKey: bossesQueryKey(activeWorkspace?.id),
    queryFn: () => fetchWorkspaceBosses(activeWorkspace?.id),
    enabled: !!activeWorkspace?.id,
  });

  const createMutation = useMutation({
    mutationFn: () => createBoss(activeWorkspace.id, userId!, { name: bossName, description: bossDesc, max_hp: bossMaxHp }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bossesQueryKey(activeWorkspace.id) });
      setShowCreateModal(false); setBossName(""); setBossDesc(""); setBossMaxHp(1000);
    },
  });

  const damageMutation = useMutation({
    mutationFn: ({ bossId, dmg }: { bossId: string; dmg: number }) => damageBoss(bossId, dmg),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bossesQueryKey(activeWorkspace.id) }),
  });

  const activeBosses = (bosses as any[]).filter((b: any) => !b.is_defeated);
  const defeatedBosses = (bosses as any[]).filter((b: any) => b.is_defeated);

  if (!activeWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <Swords size={48} className="text-slate-600" />
        <h2 className="text-xl font-bold text-white">Belum ada Workspace</h2>
        <p className="text-slate-400 text-sm">Buat atau bergabung ke workspace dulu di halaman Team.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Skull size={24} className="text-red-400" /> Boss Raids
          </h1>
          <p className="text-slate-400 text-sm mt-1">Big projects as epic boss fights. Defeat them together.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
          <Plus size={16} /> Spawn Boss
        </button>
      </div>

      {isLoading && <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>}

      {/* Active bosses */}
      {activeBosses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2"><Skull size={12} /> Aktif ({activeBosses.length})</h2>
          {activeBosses.map((boss: any) => {
            const pct = boss.max_hp > 0 ? Math.round((boss.current_hp / boss.max_hp) * 100) : 0;
            const hpColor = pct > 60 ? "from-red-500 to-orange-500" : pct > 30 ? "from-orange-500 to-yellow-500" : "from-emerald-500 to-teal-500";
            const isExpanded = expandedBoss === boss.id;
            return (
              <motion.div key={boss.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--bg-card)] border border-red-500/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Skull size={16} className="text-red-400" />
                      <h3 className="text-sm font-black text-white">{boss.name}</h3>
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">{pct}% HP</span>
                    </div>
                    {boss.description && <p className="text-xs text-slate-500">{boss.description}</p>}
                  </div>
                  <button onClick={() => setExpandedBoss(isExpanded ? null : boss.id)}
                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors shrink-0">
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>HP: {boss.current_hp.toLocaleString()} / {boss.max_hp.toLocaleString()}</span>
                    <span>{pct}%</span>
                  </div>
                  <HPBar current={boss.current_hp} max={boss.max_hp} color={hpColor} />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/5 pt-4 space-y-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Serang Boss</p>
                      <div className="flex gap-2">
                        <input type="number" min={1} value={damageInput[boss.id] ?? 50}
                          onChange={e => setDamageInput(p => ({ ...p, [boss.id]: Number(e.target.value) }))}
                          className="flex-1 bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 transition-all" />
                        <button
                          onClick={() => damageMutation.mutate({ bossId: boss.id, dmg: damageInput[boss.id] ?? 50 })}
                          disabled={damageMutation.isPending}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50">
                          <Swords size={14} /> Serang
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Defeated bosses */}
      {defeatedBosses.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Trophy size={12} /> Dikalahkan ({defeatedBosses.length})</h2>
          {defeatedBosses.map((boss: any) => (
            <div key={boss.id} className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 opacity-60">
              <Trophy size={16} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">{boss.name}</p>
                <p className="text-[10px] text-slate-500">Dikalahkan · {new Date(boss.defeated_at ?? boss.created_at).toLocaleDateString("id")}</p>
              </div>
              <Shield size={14} className="ml-auto text-emerald-400" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && activeBosses.length === 0 && defeatedBosses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Skull size={40} className="text-slate-700" />
          <p className="text-slate-500 text-sm">Belum ada boss. Spawn boss pertamamu sekarang!</p>
        </div>
      )}

      {/* Create Boss Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !createMutation.isPending && setShowCreateModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#11141c] border border-red-500/20 rounded-3xl p-8 space-y-5 shadow-2xl relative z-10">
              <h3 className="text-xl font-black text-white flex items-center gap-2"><Skull size={20} className="text-red-400" /> Spawn Boss Baru</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Boss / Proyek</label>
                  <input value={bossName} onChange={e => setBossName(e.target.value)} placeholder="Contoh: Migrasi Database v2.0"
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Deskripsi</label>
                  <textarea value={bossDesc} onChange={e => setBossDesc(e.target.value)} rows={2}
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Max HP (Kompleksitas Proyek)</label>
                  <input type="number" min={100} max={10000} step={100} value={bossMaxHp} onChange={e => setBossMaxHp(Number(e.target.value))}
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all text-sm" />
                  <p className="text-[10px] text-slate-600 mt-1">Semakin besar HP, semakin besar proyeknya.</p>
                </div>
              </div>
              <button onClick={() => createMutation.mutate()} disabled={!bossName.trim() || createMutation.isPending}
                className="w-full py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} Spawn!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
