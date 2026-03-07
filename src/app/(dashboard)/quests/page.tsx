"use client";

import { useQuestStore } from "@/store/questStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import { Plus, Trash2, CheckCircle2, Zap, Coins, Sword, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Button from "@/components/ui/Button";
import CreateQuestModal from "@/components/quest/CreateQuestModal";

export default function QuestsPage() {
    const { quests, addQuest, deleteQuest, completeQuest } = useQuestStore();
    const { addXp, addCoins, updateStat } = useUserStatsStore();
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredQuests = quests.filter((q) => {
        if (filter === "active") return !q.is_completed;
        if (filter === "completed") return q.is_completed;
        return true;
    });

    const handleComplete = (quest: any) => {
        if (quest.is_completed) return;
        completeQuest(quest.id);
        addXp(quest.xp_reward);
        addCoins(quest.coin_reward);
        if (quest.stat_rewards) {
            Object.entries(quest.stat_rewards).forEach(([stat, amount]) => {
                updateStat(stat as any, amount as number);
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4 pt-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Sword className="text-[var(--primary)]" size={24} />
                        <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-heading)]">Quest Journal</h1>
                    </div>
                    <p className="text-slate-400">Manage your path to greatness</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Filter Chips */}
                    <div className="flex p-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] rounded-2xl">
                        {(["all", "active", "completed"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === f
                                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                    : "text-slate-500 hover:text-white"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <Button
                        className="rounded-2xl flex items-center gap-2"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus size={18} /> New Quest
                    </Button>
                </div>
            </div>

            <CreateQuestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Quest Grid/List */}
            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredQuests.length > 0 ? (
                        filteredQuests.map((quest) => (
                            <motion.div
                                key={quest.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-1 rounded-3xl bg-gradient-to-r ${quest.is_completed ? "from-slate-800 to-slate-900" : "from-[var(--border-light)] to-transparent"
                                    } group`}
                            >
                                <div className="bg-[#1b1c28] rounded-[22px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 group-hover:border-[var(--primary)]/20 transition-all">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        {/* Status Icon */}
                                        <div
                                            onClick={() => handleComplete(quest)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${quest.is_completed
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                : "bg-slate-800 border border-white/10 text-slate-500 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                                }`}
                                        >
                                            <CheckCircle2 size={24} />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`text-lg font-bold ${quest.is_completed ? "text-slate-500 line-through" : "text-white"}`}>
                                                    {quest.title}
                                                </h3>
                                                {quest.priority && (
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${quest.priority === "high" || quest.priority === "urgent"
                                                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                                        }`}>
                                                        {quest.priority}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400 line-clamp-1">{quest.description}</p>
                                        </div>
                                    </div>

                                    {/* Rewards & Meta */}
                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5 text-indigo-400">
                                                    <Zap size={14} />
                                                    <span className="text-sm font-black italic">+{quest.xp_reward}</span>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-600 uppercase">Experience</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5 text-yellow-500">
                                                    <Coins size={14} />
                                                    <span className="text-sm font-black italic">+{quest.coin_reward}</span>
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-600 uppercase">Gold</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => deleteQuest(quest.id)}
                                            className="p-3 rounded-xl hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <Book size={64} />
                            <div>
                                <p className="text-xl font-bold text-white">No quests found</p>
                                <p className="text-sm">Time to write a new chapter of your legend</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
