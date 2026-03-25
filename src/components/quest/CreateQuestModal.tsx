"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Zap, Coins, Sword, Target, Clock, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { QuestPriority, QuestType, QuestDifficulty } from "@/types/quest";
import { StatKey } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuest } from "@/lib/mutations";
import { questsQueryKey } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";

interface CreateQuestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateQuestModal({ isOpen, onClose }: CreateQuestModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<QuestPriority>("medium");
    const [difficulty, setDifficulty] = useState<QuestDifficulty>("medium");
    const [selectedStat, setSelectedStat] = useState<StatKey>("discipline");

    const queryClient = useQueryClient();
    const supabase = createClient();

    const mutation = useMutation({
        mutationFn: async (questData: any) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not logged in");
            return createQuest(user.id, questData);
        },
        onSuccess: async () => {
             const { data: { user } } = await supabase.auth.getUser();
             if (user) {
                 queryClient.invalidateQueries({ queryKey: questsQueryKey(user.id) });
             }
             setTitle("");
             setDescription("");
             onClose();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        const baseRewards = {
            easy: { xp: 100, coin: 20, stat: 2 },
            medium: { xp: 250, coin: 50, stat: 5 },
            hard: { xp: 500, coin: 100, stat: 10 },
            extreme: { xp: 1000, coin: 250, stat: 25 },
        };

        const rewards = baseRewards[difficulty];
        const priorityMultiplier = priority === "urgent" ? 1.5 : priority === "high" ? 1.2 : 1.0;

        const newQuest = {
            title,
            description,
            priority,
            difficulty,
            type: "daily" as QuestType,
            xp_reward: Math.round(rewards.xp * priorityMultiplier),
            coin_reward: Math.round(rewards.coin * priorityMultiplier),
            stat_rewards: { [selectedStat]: rewards.stat }
        };

        mutation.mutate(newQuest);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-lg bg-[#1b1c28] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                                    <Sword size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">New Quest</h2>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Initialize Objective</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quest Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Master React Hooks"
                                        className="w-full bg-[#13141f] border border-white/5 focus:border-[var(--primary)]/50 rounded-2xl px-5 py-3.5 text-white placeholder-slate-600 outline-none transition-all shadow-inner"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Description Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description (Optional)</label>
                                    <textarea
                                        placeholder="Briefly describe your objective..."
                                        className="w-full bg-[#13141f] border border-white/5 focus:border-[var(--primary)]/50 rounded-2xl px-5 py-3.5 text-white placeholder-slate-600 outline-none transition-all resize-none h-24 shadow-inner"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                {/* Grid: Priority, Difficulty & Stat Reward */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Priority</label>
                                        <select
                                            className="w-full bg-[#13141f] border border-white/5 focus:border-[var(--primary)]/50 rounded-2xl px-5 py-3.5 text-white outline-none transition-all appearance-none cursor-pointer"
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value as QuestPriority)}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Difficulty</label>
                                        <select
                                            className="w-full bg-[#13141f] border border-white/5 focus:border-[var(--primary)]/50 rounded-2xl px-5 py-3.5 text-white outline-none transition-all appearance-none cursor-pointer"
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
                                        >
                                            <option value="easy">Easy (⭐)</option>
                                            <option value="medium">Medium (⭐⭐)</option>
                                            <option value="hard">Hard (⭐⭐⭐)</option>
                                            <option value="extreme">Extreme (🔥🔥🔥)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Focus Stat</label>
                                        <select
                                            className="w-full bg-[#13141f] border border-white/5 focus:border-[var(--primary)]/50 rounded-2xl px-5 py-3.5 text-white outline-none transition-all appearance-none cursor-pointer"
                                            value={selectedStat}
                                            onChange={(e) => setSelectedStat(e.target.value as StatKey)}
                                        >
                                            <option value="discipline">Discipline</option>
                                            <option value="knowledge">Knowledge</option>
                                            <option value="health">Vitality</option>
                                            <option value="creativity">Creativity</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="w-full rounded-2xl py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(99,102,241,0.2)] disabled:opacity-50"
                                >
                                    {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                    Accept Quest
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
