"use client";

import { Target, ChevronRight, Compass } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchGoals, goalsQueryKey } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function GoalPlannerWidget() {
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setUserId(session.user.id);
        });
    }, []);

    const { data: goals, isLoading } = useQuery({
        queryKey: goalsQueryKey(userId!),
        queryFn: () => fetchGoals(userId!),
        enabled: !!userId,
    });

    if (isLoading || !userId) return <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] h-48 animate-pulse" />;

    return (
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all">
            <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-emerald-400">
                        <Target size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">
                            Objektif Utama
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Fokus pada tujuan jangka panjangmu</p>
                    </div>
                </div>
                <Link href="/dashboard/quests" className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-colors">
                    Lihat Semua
                </Link>
            </div>

            {!goals || goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mb-4">
                        <Compass size={32} className="text-emerald-500/40" />
                    </div>
                    <p className="text-sm font-semibold text-slate-400 mb-1">Belum ada objektif yang ditetapkan</p>
                    <p className="text-xs text-slate-500">Tentukan tujuan besarmu dan mulailah petualanganmu!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals?.map((goal: any) => {
                        const completed = goal.milestones?.filter((m: any) => m.is_completed).length || 0;
                        const total = goal.milestones?.length || 1;
                        const progress = Math.round((completed / total) * 100);

                        return (
                            <motion.div
                                key={goal.id}
                            whileHover={{ y: -4 }}
                            className="p-5 rounded-2xl bg-[var(--bg-sidebar)] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group/goal"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-semibold uppercase text-emerald-500 tracking-wider bg-emerald-500/10 px-2 py-1 rounded-md">
                                    {goal.category}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                    <span>{progress}% tercapai</span>
                                </div>
                            </div>

                            <h4 className="text-sm font-semibold text-white mb-2 group-hover/goal:text-emerald-400 transition-colors">
                                {goal.title}
                            </h4>

                            <div className="h-1.5 w-full bg-[var(--bg-main)] rounded-full overflow-hidden mb-4 border border-white/5">
                                <motion.div
                                    className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-semibold text-indigo-400" title="Hadiah XP">
                                        XP
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-[10px] font-semibold text-yellow-500" title="Bonus Stat">
                                        ST
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-slate-600 group-hover/goal:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
