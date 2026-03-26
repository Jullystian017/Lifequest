"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bug as BugIcon, Zap, Coins, Sword, Crosshair } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { fetchWorkspaceBugs, bugMonstersQueryKey } from "@/lib/queries";
import { damageBugMonster } from "@/lib/mutations";
import { createClient } from "@/lib/supabase/client";

export default function BugRadarWidget() {
    const { activeWorkspaceId } = useWorkspaceStore();
    const queryClient = useQueryClient();
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
    }, []);

    const { data: bugs = [], isLoading } = useQuery({
        queryKey: bugMonstersQueryKey(activeWorkspaceId || ""),
        queryFn: () => fetchWorkspaceBugs(activeWorkspaceId as string),
        enabled: !!activeWorkspaceId,
    });

    // Realtime Subscriptions
    useEffect(() => {
        if (!activeWorkspaceId) return;

        const channel = supabase
            .channel(`workspace-bugs-${activeWorkspaceId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'bug_monsters',
                    filter: `workspace_id=eq.${activeWorkspaceId}`
                },
                (payload) => {
                    const updatedBug = payload.new;
                    queryClient.setQueryData(bugMonstersQueryKey(activeWorkspaceId), (old: any) => {
                        if (!old) return old;
                        // If it became squashed, removing it
                        if (updatedBug.status === 'squashed') {
                            return old.filter((b: any) => b.id !== updatedBug.id);
                        }
                        return old.map((b: any) => b.id === updatedBug.id ? { ...b, ...updatedBug } : b);
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bug_monsters',
                    filter: `workspace_id=eq.${activeWorkspaceId}`
                },
                (payload) => {
                    const newBug = payload.new;
                    queryClient.setQueryData(bugMonstersQueryKey(activeWorkspaceId), (old: any) => {
                        if (!old) return [newBug];
                        if (old.some((b: any) => b.id === newBug.id)) return old;
                        return [newBug, ...old];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeWorkspaceId, queryClient, supabase]);

    const attackMutation = useMutation({
        mutationFn: async ({ bugId, damage }: { bugId: string, damage: number }) => {
            if (!userId) throw new Error("Not logged in");
            return damageBugMonster(bugId, damage, userId);
        },
        onSuccess: (result, variables) => {
            if (result && result.squashed) {
                // Remove from local list immediately
                queryClient.setQueryData(bugMonstersQueryKey(activeWorkspaceId!), (old: any) => {
                    if (!old) return old;
                    return old.filter((b: any) => b.id !== variables.bugId);
                });
            } else if (result) {
                // Update HP immediately
                queryClient.setQueryData(bugMonstersQueryKey(activeWorkspaceId!), (old: any) => {
                    if (!old) return old;
                    return old.map((b: any) => b.id === variables.bugId ? { ...b, hp: result.newHp } : b);
                });
            }
        }
    });

    const [clickVisuals, setClickVisuals] = useState<{id: number, x: number, y: number}[]>([]);
    const [clickCount, setClickCount] = useState(0);

    const handleAttack = (e: React.MouseEvent, bugId: string) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newClick = { id: Date.now(), x, y };
        setClickVisuals(prev => [...prev, newClick]);
        setClickCount(prev => prev + 1);

        setTimeout(() => {
            setClickVisuals(prev => prev.filter(c => c.id !== newClick.id));
        }, 500);

        attackMutation.mutate({ bugId, damage: 1 });
    };

    if (!activeWorkspaceId) return null;

    if (isLoading) {
        return (
            <div className="bg-[#11141c] rounded-[32px] border border-[var(--border-light)] p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-white/5 rounded w-1/3"></div>
                <div className="h-24 bg-white/5 rounded-2xl w-full"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#11141c] rounded-[32px] border border-[var(--border-light)] overflow-hidden relative">
            <div className="p-6 border-b border-[var(--border-light)] bg-gradient-to-r from-red-500/5 to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500/10 p-2 rounded-xl text-red-400 border border-red-500/20">
                            <Crosshair size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white font-[family-name:var(--font-heading)]">Bug Radar</h2>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Team Objectives</p>
                        </div>
                    </div>
                    {bugs.length > 0 && (
                        <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse">
                            {bugs.length} Detected
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 space-y-4">
                {bugs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-ping"></div>
                            <div className="bg-emerald-500/10 p-4 rounded-full text-emerald-400 border border-emerald-500/20 relative z-10">
                                <BugIcon size={32} />
                            </div>
                        </div>
                        <p className="text-emerald-400 font-bold">Radar Clear</p>
                        <p className="text-slate-500 text-xs">No active bugs detected in this workspace.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {bugs.map((bug: any) => {
                                const hpPct = Math.max(0, Math.min(100, (bug.hp / bug.max_hp) * 100));
                                return (
                                    <motion.div 
                                        key={bug.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, position: "absolute" }}
                                        onClick={(e) => handleAttack(e, bug.id)}
                                        className="relative bg-[#0d1017] border border-red-500/20 rounded-2xl p-4 overflow-hidden group cursor-crosshair select-none hover:border-red-500/40 transition-colors"
                                    >   
                                        {/* Click VFX */}
                                        {clickVisuals.map(click => (
                                            <motion.div
                                                key={click.id}
                                                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                                                animate={{ opacity: 0, y: -20, scale: 1.2 }}
                                                className="absolute text-red-400 font-black text-xl pointer-events-none z-20"
                                                style={{ left: click.x, top: click.y }}
                                            >
                                                -1
                                            </motion.div>
                                        ))}

                                        <div className="flex items-start justify-between mb-4 relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                                                    <BugIcon size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-red-100">{bug.name}</p>
                                                    <p className="text-[10px] text-red-400 font-mono uppercase opacity-70">{bug.type}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-red-400">{bug.hp} / {bug.max_hp} HP</p>
                                            </div>
                                        </div>

                                        {/* HP Bar */}
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-4 relative z-10">
                                            <motion.div 
                                                className="h-full bg-red-500" 
                                                animate={{ width: `${hpPct}%` }}
                                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-red-500/10 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded">
                                                    <Zap size={10} /> {bug.xp_reward} XP
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded">
                                                    <Coins size={10} /> {bug.coin_reward}G
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-red-500 opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                <Sword size={10} /> Squash
                                            </span>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
