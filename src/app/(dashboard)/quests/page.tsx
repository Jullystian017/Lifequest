"use client";

import { useQuestStore } from "@/store/questStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import {
    Plus,
    Trash2,
    CheckCircle2,
    Zap,
    Coins,
    Sword,
    Calendar,
    ChevronRight,
    X,
    Target,
    Trophy,
    History,
    Book,
    BookOpen,
    Sparkles,
    Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import CreateQuestModal from "@/components/quest/CreateQuestModal";
import { Quest } from "@/types/quest";

export default function QuestsPage() {
    const { quests, deleteQuest, completeQuest, toggleTask } = useQuestStore();
    const { addXp, addCoins, updateStat } = useUserStatsStore();
    const [filter, setFilter] = useState<"Today" | "Upcoming" | "Completed" | "All">("Today");
    const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter Logic
    const filteredQuests = useMemo(() => {
        return quests.filter((q) => {
            if (filter === "Completed") return q.is_completed;
            if (filter === "Today") return !q.is_completed; // Simplified for now
            if (filter === "Upcoming") return !q.is_completed && q.type === 'weekly';
            return true;
        });
    }, [quests, filter]);

    const selectedQuest = useMemo(() =>
        quests.find(q => q.id === selectedQuestId) || null,
        [quests, selectedQuestId]);

    const completedToday = quests.filter(q => q.is_completed).length;
    const totalToday = quests.length;
    const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

    const handleCompleteQuest = (quest: Quest) => {
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
        <div className="flex h-[calc(100vh-140px)] -mt-2 -mx-6 -mb-6 overflow-hidden bg-[#0a0b14]">
            {/* 1. Center Column: Quest List */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-white/5">
                <div className="p-8 pb-20 overflow-y-auto scrollbar-hide space-y-8 pt-6">
                    {/* Actions Bar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sword className="text-[var(--primary)]" size={20} />
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Mission Log</h2>
                        </div>
                        <Button
                            className="rounded-xl flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-[var(--primary)]/20"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus size={18} /> New Quest
                        </Button>
                    </div>

                    {/* Daily Progress Widget */}
                    <div className="bg-[#151921] rounded-2xl p-6 border border-white/5 space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Daily Progress</h3>
                            <span className="text-xs font-black text-[var(--primary)]">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                className="h-full bg-gradient-to-r from-[var(--primary)] to-indigo-400 rounded-full"
                            />
                        </div>
                        <p className="text-[10px] font-medium text-slate-500">{completedToday} / {totalToday} quests completed today</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-8 border-b border-white/5 pb-2">
                        {(["Today", "Upcoming", "Completed", "All"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`relative pb-2 text-sm font-bold transition-colors ${filter === t ? "text-white" : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                {t}
                                {filter === t && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* List Items */}
                    <div className="space-y-3 pb-10">
                        <AnimatePresence mode="popLayout">
                            {filteredQuests.map((quest) => (
                                <motion.div
                                    key={quest.id}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    onClick={() => setSelectedQuestId(quest.id)}
                                    className={`group relative bg-[#151921] rounded-xl p-4 border transition-all cursor-pointer ${selectedQuestId === quest.id
                                        ? "border-[var(--primary)] bg-[#1b1e2a] shadow-lg shadow-[var(--primary)]/5"
                                        : "border-white/5 hover:border-white/10"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${quest.is_completed
                                            ? "bg-emerald-500 border-emerald-500"
                                            : "border-slate-700 group-hover:border-[var(--primary)]"
                                            }`}>
                                            {quest.is_completed && <CheckCircle2 size={12} className="text-white" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className={`text-sm font-bold truncate ${quest.is_completed ? "text-slate-500 line-through font-medium" : "text-white"}`}>
                                                    {quest.title}
                                                </h4>
                                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${quest.difficulty === 'hard' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    quest.difficulty === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {quest.difficulty}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                                <span className="flex items-center gap-1"><Zap size={10} className="text-[var(--primary)]" /> {quest.xp_reward} XP</span>
                                                <span className="flex items-center gap-1"><Book size={10} className="text-blue-400" /> +{Object.values(quest.stat_rewards)[0]} {Object.keys(quest.stat_rewards)[0]}</span>
                                                <span className="flex items-center gap-1"><Calendar size={10} /> Today</span>
                                            </div>
                                        </div>

                                        <ChevronRight size={16} className={`text-slate-700 transition-transform ${selectedQuestId === quest.id ? "rotate-90 text-[var(--primary)]" : "group-hover:translate-x-1"}`} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredQuests.length === 0 && (
                            <div className="py-20 text-center opacity-30">
                                <History size={48} className="mx-auto mb-4" />
                                <p className="text-sm font-bold text-white">No quests found here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Right Column: Quest Inspector */}
            <aside className="w-[400px] flex flex-col bg-[#0d0e1a] border-l border-white/5 relative">
                <AnimatePresence mode="wait">
                    {selectedQuest ? (
                        <motion.div
                            key={selectedQuest.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex-1 flex flex-col p-8 overflow-y-auto scrollbar-hide"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-white">Quest Details</h3>
                                <button
                                    onClick={() => setSelectedQuestId(null)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <span className={`inline-block w-fit text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-3 border ${selectedQuest.difficulty === 'hard' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                selectedQuest.difficulty === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                {selectedQuest.difficulty} Difficulty
                            </span>

                            <h2 className="text-2xl font-bold text-white mb-4 leading-tight font-[family-name:var(--font-heading)]">
                                {selectedQuest.title}
                            </h2>

                            <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                {selectedQuest.description}
                            </p>

                            <div className="space-y-8">
                                {/* Completion Rewards */}
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-4">Completion Rewards</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#151921] p-4 rounded-xl border border-white/5 text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-[var(--primary)] mb-1">
                                                <Target size={16} className="fill-[var(--primary)]/20" />
                                                <span className="text-base font-black italic">+{selectedQuest.xp_reward} XP</span>
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-600 uppercase">Experience points</span>
                                        </div>
                                        <div className="bg-[#151921] p-4 rounded-xl border border-white/5 text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-blue-400 mb-1">
                                                <BookOpen size={16} />
                                                <span className="text-base font-black italic">+{Object.values(selectedQuest.stat_rewards)[0]} {Object.keys(selectedQuest.stat_rewards)[0]}</span>
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-600 uppercase">Stat Boost</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checklist */}
                                {selectedQuest.tasks && selectedQuest.tasks.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Quest Tasks ({selectedQuest.tasks.filter(t => t.is_completed).length}/{selectedQuest.tasks.length})</h4>
                                            <button className="text-[10px] font-bold text-[var(--primary)] hover:underline">+ Add Task</button>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedQuest.tasks.map((task) => (
                                                <div
                                                    key={task.id}
                                                    onClick={() => toggleTask(selectedQuest.id, task.id)}
                                                    className="group flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all cursor-pointer"
                                                >
                                                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${task.is_completed ? "bg-[var(--primary)] border-[var(--primary)]" : "border-slate-700"
                                                        }`}>
                                                        {task.is_completed && <CheckCircle2 size={10} className="text-white" />}
                                                    </div>
                                                    <span className={`text-xs font-medium ${task.is_completed ? "text-slate-500 line-through" : "text-slate-200"}`}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-auto pt-8 flex items-center gap-4">
                                <Button
                                    className="flex-1 py-4 text-sm font-black rounded-2xl shadow-xl shadow-[var(--primary)]/20"
                                    disabled={selectedQuest.is_completed}
                                    onClick={() => handleCompleteQuest(selectedQuest)}
                                >
                                    {selectedQuest.is_completed ? "Quest Completed" : "Complete Quest"}
                                </Button>
                                <button
                                    onClick={() => deleteQuest(selectedQuest.id)}
                                    className="p-4 bg-white/5 hover:bg-red-500/10 text-slate-600 hover:text-red-500 rounded-2xl border border-white/5 transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-20">
                            <Trophy size={64} className="mb-6" />
                            <h3 className="text-base font-bold text-white mb-2">Quest Inspector</h3>
                            <p className="text-xs">Select a quest from your log to view details, rewards, and objectives.</p>
                        </div>
                    )}
                </AnimatePresence>
            </aside>

            <CreateQuestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
