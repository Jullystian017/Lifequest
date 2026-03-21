"use client";

import { useBossStore } from "@/store/bossStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import { Skull, Swords, Trophy, History, Zap, Shield, Plus, ChevronRight, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BossBattlesPage() {
    const { bosses, dealDamage, setBosses } = useBossStore();
    const { activeWorkspaceId, workspaces = [], activeRole } = useWorkspaceStore();
    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
    const { addXp, addCoins } = useUserStatsStore();

    // Filter bosses by active workspace
    const workspaceBosses = bosses.filter(b => b.workspaceId === activeWorkspaceId);
    
    // Separate by status
    const activeBosses = workspaceBosses.filter(b => b.status === "active");
    const upcomingBosses = workspaceBosses.filter(b => b.status === "upcoming");
    const defeatedBosses = workspaceBosses.filter(b => b.status === "defeated");

    // Default to the first active boss if any exist
    const primaryBoss = activeBosses[0];

    const supabase = createClient();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBosses() {
            setLoading(true);
            const { data } = await supabase
                .from('bosses')
                .select('*, tasks:boss_tasks(*)')
                .eq('workspace_id', activeWorkspaceId || 'personal-1')
                .order('created_at', { ascending: false });
            
            if (data) {
                setBosses(data);
            }
            setLoading(false);
        }
        if (activeWorkspaceId) {
            fetchBosses();
        }
    }, [activeWorkspaceId, setBosses, supabase]);

    const handleDealDamage = async (bossId: string, taskId: string, damage: number) => {
        dealDamage(bossId, taskId); // Optimistic UI update
        addXp(Math.floor(damage * 1.5));
        addCoins(Math.floor(damage * 0.1));

        // Persist to backend
        await supabase.from('boss_tasks').update({ is_completed: true }).eq('id', taskId);
        
        const currentBoss = bosses.find(b => b.id === bossId);
        if (currentBoss) {
            const newHp = Math.max(0, currentBoss.current_hp - damage);
            const isDefeated = newHp === 0;
            await supabase.from('bosses').update({
                current_hp: newHp,
                status: isDefeated ? 'defeated' : currentBoss.status
            }).eq('id', bossId);
        }
    };

    const canSummonBoss = activeRole !== 'member';

    return (
        <div className="flex flex-col gap-12 pb-20 animate-fade-in w-full">
            
            {/* 1. Header & Context */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                            <Skull size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                            {activeWorkspace?.name || "Workspace"}
                        </span>
                    </div>
                    <h2 className="text-3xl font-semibold text-white tracking-tight font-[family-name:var(--font-heading)]">Boss Battles</h2>
                    <p className="text-sm text-slate-500 font-medium">Turn massive projects into epic encounters. Deal damage by completing tasks.</p>
                </div>
                
                {canSummonBoss && (
                    <Button className="rounded-xl flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white border-0 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                        <Plus size={16} /> <span className="text-[11px] font-semibold uppercase tracking-widest">Summon Boss</span>
                    </Button>
                )}
            </header>

            {loading ? (
                <div className="w-full h-64 flex flex-col items-center justify-center text-slate-500 gap-4">
                    <Loader2 className="animate-spin text-red-500" size={40} />
                    <p className="text-sm font-semibold uppercase tracking-widest">Memindai Area Boss...</p>
                </div>
            ) : (
                <>
                    {/* 2. Active Boss Arena (The Main Event) */}
            {primaryBoss ? (
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Swords className="text-red-500" size={18} />
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Active Encounter</h3>
                    </div>

                    <div className="bg-[#11131a] border border-red-900/30 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/10 relative group">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3 group-hover:bg-red-500/10 transition-colors duration-1000" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none" />

                        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5 relative z-10">
                            
                            {/* Left: Boss Presentation */}
                            <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                            primaryBoss.difficulty === 'epic' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            primaryBoss.difficulty === 'hard' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                        }`}>
                                            {primaryBoss.difficulty} Target
                                        </span>
                                        {primaryBoss.deadline && (
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/10 px-2.5 py-1 rounded-md">
                                                Due: {new Date(primaryBoss.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h2 className="text-4xl md:text-5xl font-black text-white font-[family-name:var(--font-heading)] leading-tight mb-4 tracking-tight drop-shadow-lg">
                                        {primaryBoss.name}
                                    </h2>
                                    <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-xl">
                                        {primaryBoss.description}
                                    </p>
                                </div>

                                <div className="mt-12">
                                    <div className="flex items-end justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Shield className="text-slate-500" size={16} />
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Boss HP</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-white">{primaryBoss.current_hp}</span>
                                            <span className="text-sm font-bold text-slate-500"> / {primaryBoss.max_hp}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Epic HP Bar */}
                                    <div className="h-6 w-full bg-[#0a0b10] rounded-full p-1 border border-white/10 shadow-inner relative overflow-hidden">
                                        {/* Sub-bar for recent damage effect (optional polish later) */}
                                        <div className="absolute inset-y-1 left-1 right-1 rounded-full bg-red-900/30" />
                                        
                                        <motion.div 
                                            initial={{ width: "100%" }}
                                            animate={{ width: `${(primaryBoss.current_hp / primaryBoss.max_hp) * 100}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] relative z-10"
                                        >
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                            {/* Shimmer */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Damage Tasks & Drops */}
                            <div className="w-full lg:w-[450px] bg-black/20 flex flex-col">
                                {/* Tasks List */}
                                <div className="flex-1 p-8 overflow-y-auto min-h-[300px]">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-4 flex items-center gap-2">
                                        <Swords size={12} className="text-red-500" /> Attack Vectors (Tasks)
                                    </h4>
                                    <div className="space-y-3">
                                        {primaryBoss.tasks.map((task) => (
                                            <button
                                                key={task.id}
                                                disabled={task.is_completed}
                                                onClick={() => handleDealDamage(primaryBoss.id, task.id, task.damage)}
                                                className={`w-full text-left group flex items-start gap-4 p-4 rounded-xl border transition-all ${
                                                    task.is_completed 
                                                    ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60 cursor-not-allowed' 
                                                    : 'bg-[#151921] border-white/5 hover:border-red-500/30 hover:bg-white/[0.02] hover:shadow-[0_0_15px_rgba(220,38,38,0.05)]'
                                                }`}
                                            >
                                                <div className={`mt-0.5 shrink-0 ${task.is_completed ? 'text-emerald-500' : 'text-slate-600 group-hover:text-red-400 transition-colors'}`}>
                                                    <Swords size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className={`block text-sm font-semibold mb-1.5 truncate ${task.is_completed ? 'text-slate-500 line-through' : 'text-slate-200 group-hover:text-white transition-colors'}`}>
                                                        {task.title}
                                                    </span>
                                                    <div className="flex items-center justify-between">
                                                        <span className="inline-block text-[10px] font-black uppercase text-red-500/80 bg-red-500/10 px-1.5 py-0.5 rounded">
                                                            {task.damage} DMG
                                                        </span>
                                                        {task.assigneeAvatar && (
                                                            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full border border-white/10" title={`Assigned to ${task.assigneeName}`}>
                                                                <span className="text-xs">{task.assigneeAvatar}</span>
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{task.assigneeName?.split(' ')[0]}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Drops Section */}
                                <div className="p-8 border-t border-white/5 bg-black/40">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-4">Potential Drops</h4>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2 bg-[#151921] border border-white/5 rounded-lg px-3 py-2">
                                            <Zap size={14} className="text-[var(--primary)]" />
                                            <span className="text-xs font-bold text-white">{primaryBoss.rewards.xp} XP</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-[#151921] border border-white/5 rounded-lg px-3 py-2">
                                            <span className="text-amber-500 text-sm leading-none">🪙</span>
                                            <span className="text-xs font-bold text-white">{primaryBoss.rewards.coins} G</span>
                                        </div>
                                        {primaryBoss.rewards.badge && (
                                            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
                                                <Trophy size={14} className="text-indigo-400" />
                                                <span className="text-xs font-bold text-indigo-300">{primaryBoss.rewards.badge}</span>
                                            </div>
                                        )}
                                        {primaryBoss.rewards.item && (
                                            <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-lg px-3 py-2">
                                                <Sparkles size={14} className="text-pink-400" />
                                                <span className="text-xs font-bold text-pink-300">{primaryBoss.rewards.item}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 px-6 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                    <div className="p-4 bg-white/5 rounded-2xl mb-4">
                        <Skull size={32} className="text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">The Arena is Clear</h3>
                    <p className="text-sm text-slate-500 text-center max-w-sm">
                        You have no active boss battles in this workspace. Summon a new boss to start a major project.
                    </p>
                </div>
            )}

            {/* 3. Grid: Upcoming or Defeated Bosses */}
            {(upcomingBosses.length > 0 || defeatedBosses.length > 0) && (
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Defeated Bosses (Trophies) */}
                    {defeatedBosses.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="text-yellow-500" size={16} />
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Defeated (Trophies)</h3>
                            </div>
                            <div className="space-y-3">
                                {defeatedBosses.map(boss => (
                                    <div key={boss.id} className="bg-[#151921] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/10 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl grayscale opacity-50">
                                                {boss.avatar_url}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-300 line-through decoration-slate-600 block mb-0.5">{boss.name}</h4>
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                    <CheckCircle2 size={10} className="text-emerald-500" /> Cleared
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Bosses */}
                    {upcomingBosses.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <History className="text-blue-500" size={16} />
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lurking in Shadows</h3>
                            </div>
                            <div className="space-y-3">
                                {upcomingBosses.map(boss => (
                                    <div key={boss.id} className="bg-[#151921] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                                                {boss.avatar_url}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white block mb-0.5">{boss.name}</h4>
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                    HP: {boss.max_hp}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}
            </>
            )}

        </div>
    );
}
