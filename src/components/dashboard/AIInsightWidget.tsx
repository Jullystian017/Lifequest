"use client";

import { useEffect, useState } from "react";
import { Sparkles, AlertTriangle, Lightbulb, ArrowRight, Loader2, BrainCircuit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchQuests, fetchHabits, userQueryKey, questsQueryKey, habitsQueryKey } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface InsightData {
    warning: string;
    suggestion: string;
    prediction: string;
    action_label?: string;
    action_link?: string;
}

export default function AIInsightWidget() {
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserId(data.user.id);
        });
    }, []);

    const { data: user, isLoading: loadingUser } = useQuery({ queryKey: userQueryKey(userId!), queryFn: () => fetchUser(userId!), enabled: !!userId });
    const { data: quests = [], isLoading: loadingQuests } = useQuery({ queryKey: questsQueryKey(userId!), queryFn: () => fetchQuests(userId!), enabled: !!userId });
    const { data: habits = [], isLoading: loadingHabits } = useQuery({ queryKey: habitsQueryKey(userId!), queryFn: () => fetchHabits(userId!), enabled: !!userId });

    const level = user?.level || 1;
    const username = user?.username || "Pemain";
    const stats = user?.stats || {};
    
    const [insight, setInsight] = useState<InsightData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loadingUser || loadingQuests || loadingHabits) return;

        async function fetchInsight() {
            try {
                const res = await fetch("/api/ai/life-engine", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quests, habits, stats, level, username }),
                });
                const data = await res.json();
                if (!data.error) setInsight(data);
            } catch (error) {
                console.error("Life Engine error:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (quests.length > 0 || habits.length > 0) {
            fetchInsight();
        } else {
            setIsLoading(false);
        }
    }, [quests.length, habits.length, loadingUser, loadingQuests, loadingHabits]);

    if (isLoading) {
        return (
            <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <div className="relative">
                    <BrainCircuit size={40} className="text-[var(--primary)] animate-pulse" />
                    <Loader2 size={24} className="absolute -top-1 -right-1 text-indigo-400 animate-spin" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Menghubungkan ke Life Engine...</p>
            </div>
        );
    }

    if (!insight) {
        return (
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-white/5 text-center space-y-3">
                <Sparkles size={24} className="text-slate-600 mx-auto" />
                <p className="text-sm text-slate-500 italic">"Belum ada data cukup untuk Life Engine memberikan wawasan inti. Selesaikan lebih banyak quest!"</p>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--bg-card)] to-[#1a1b2e] border border-[var(--border-light)] relative overflow-hidden group shadow-2xl transition-all hover:border-indigo-500/30">
            {/* Background Glow */}
            <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-700"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <BrainCircuit size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            Life Engine
                            <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30 uppercase tracking-wider">Neural Core</span>
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Wawasan & Prediksi</p>
                    </div>
                </div>
                <Sparkles size={16} className="text-yellow-500/40 animate-pulse" />
            </div>

            <div className="relative z-10 space-y-4">
                {/* 1. Warning */}
                <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 p-3.5 rounded-2xl bg-orange-500/5 border border-orange-500/10 group/item hover:border-orange-500/30 transition-all"
                >
                    <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                    <div>
                        <span className="text-[10px] font-bold text-orange-500/70 uppercase tracking-widest block mb-0.5">Alert</span>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">{insight.warning}</p>
                    </div>
                </motion.div>

                {/* 2. Suggestion */}
                <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-3 p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/10 group/item hover:border-blue-500/30 transition-all"
                >
                    <Lightbulb size={18} className="text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <span className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest block mb-0.5">Saran</span>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">{insight.suggestion}</p>
                    </div>
                </motion.div>

                {/* 3. Prediction */}
                <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-3 p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/10 group/item hover:border-purple-500/30 transition-all"
                >
                    <Sparkles size={18} className="text-purple-400 shrink-0 mt-0.5" />
                    <div>
                        <span className="text-[10px] font-bold text-purple-400/70 uppercase tracking-widest block mb-0.5">Prediksi</span>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">{insight.prediction}</p>
                    </div>
                </motion.div>

                {/* Action Button */}
                {insight.action_label && insight.action_link && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="pt-2"
                    >
                        <Link 
                            href={insight.action_link}
                            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all shadow-[0_4px_15px_rgba(79,70,229,0.3)] group/btn"
                        >
                            <span className="flex items-center gap-2">
                                <ArrowRight size={16} className="bg-white/20 p-0.5 rounded" />
                                {insight.action_label}
                            </span>
                            <Sparkles size={14} className="opacity-50 group-hover/btn:rotate-12 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </div>
            
            {/* Visual Flair */}
            <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 border-2 border-indigo-500/5 rounded-full"></div>
        </div>
    );
}
