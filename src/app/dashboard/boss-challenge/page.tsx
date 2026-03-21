"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBossStore } from "@/store/bossStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import { Sword, Shield, Coins, Sparkles, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function BossChallengePage() {
    const { bosses, dealDamage } = useBossStore();
    const [attackingTask, setAttackingTask] = useState<string | null>(null);

    const activeBosses = bosses.filter(b => b.status === 'active');
    const defeatedBosses = bosses.filter(b => b.status === 'defeated');

    const handleAttack = async (bossId: string, taskId: string) => {
        setAttackingTask(taskId);
        
        // Simulate attack animation delay
        setTimeout(() => {
            dealDamage(bossId, taskId);
            setAttackingTask(null);
            
            // Note: BossStore handles giving XP/Coins automatically if defeated
        }, 800);
    };

    const renderBossCard = (boss: any, isActive: boolean) => {
        const hpPercentage = Math.max(0, (boss.current_hp / boss.max_hp) * 100);
        
        return (
            <div key={boss.id} className={`relative bg-[#151921] border ${isActive ? 'border-red-500/30' : 'border-emerald-500/20'} rounded-3xl p-6 lg:p-8 overflow-hidden transition-all shadow-xl`}>
                
                {/* Background Blood / Success Glow */}
                <div 
                    className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20`}
                    style={{ backgroundColor: isActive ? '#EF4444' : '#10B981' }}
                />

                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                    {/* Left side: Avatar & HP */}
                    <div className="flex flex-col items-center flex-shrink-0 w-full lg:w-48 text-center space-y-4">
                        <div className="relative">
                            <div className={`w-32 h-32 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center text-6xl shadow-inner ${isActive && hpPercentage < 30 ? 'animate-pulse' : ''}`}>
                                {boss.avatar_url}
                            </div>
                            
                            {isActive && hpPercentage < 30 && (
                                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 animate-bounce">
                                    <AlertTriangle size={12} /> Critical
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] leading-tight">{boss.name}</h3>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                    boss.difficulty === 'epic' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                    boss.difficulty === 'hard' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {boss.difficulty}
                                </span>
                            </div>
                        </div>

                        {/* HP Bar */}
                        <div className="w-full mt-2">
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                <span>HP</span>
                                <span className={hpPercentage < 30 ? 'text-red-400' : 'text-slate-300'}>{boss.current_hp} / {boss.max_hp}</span>
                            </div>
                            <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                                <motion.div 
                                    className={`absolute top-0 left-0 h-full rounded-full ${isActive ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-emerald-500'}`}
                                    initial={{ width: "100%" }}
                                    animate={{ width: `${hpPercentage}%` }}
                                    transition={{ duration: 1, type: "spring" }}
                                />
                            </div>
                        </div>
                        
                        {/* Loot Box */}
                        <div className="bg-black/20 w-full rounded-xl p-3 border border-white/5 mt-auto">
                            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest block mb-2">Loot Drops</span>
                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="flex items-center gap-1.5"><Sparkles size={14} className="text-emerald-400"/><span className="text-sm font-bold">{boss.rewards.xp} XP</span></div>
                                <div className="flex items-center gap-1.5"><Coins size={14} className="text-yellow-500"/><span className="text-sm font-bold">{boss.rewards.coins} G</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Tasks (Attacks) */}
                    <div className="flex-grow flex flex-col">
                        <p className="text-sm text-slate-400 leading-relaxed mb-6 bg-black/20 p-4 rounded-xl border border-white/5 italic">
                            "{boss.description}"
                        </p>

                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Sword size={16} className="text-red-400" /> Action Required
                            </h4>
                            {isActive && boss.deadline && (
                                <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                                    <Clock size={14} className="text-orange-400" />
                                    Due: {new Date(boss.deadline).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 flex-grow max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                            {boss.tasks.map((task: any) => {
                                const isStriking = attackingTask === task.id;
                                return (
                                    <div 
                                        key={task.id} 
                                        className={`group relative overflow-hidden bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl p-4 flex items-center justify-between transition-all ${task.is_completed ? 'opacity-60' : 'hover:border-red-500/50'}`}
                                    >
                                        {/* Strike flash animation */}
                                        <AnimatePresence>
                                            {isStriking && (
                                                <motion.div 
                                                    initial={{ opacity: 1, x: "-100%" }}
                                                    animate={{ opacity: 0, x: "100%" }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 z-0"
                                                />
                                            )}
                                        </AnimatePresence>

                                        <div className="flex items-center gap-4 relative z-10 w-full">
                                            <button
                                                onClick={() => !task.is_completed && isActive && handleAttack(boss.id, task.id)}
                                                disabled={task.is_completed || !isActive || isStriking}
                                                className={`flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                                                    task.is_completed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' :
                                                    isActive ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/20 text-transparent hover:text-red-400 cursor-pointer' :
                                                    'border-[var(--border-light)] bg-black/20 text-transparent cursor-not-allowed'
                                                }`}
                                            >
                                                {isStriking ? <Sword size={14} className="animate-spin text-white" /> : <CheckCircle2 size={16} className={task.is_completed ? 'opacity-100' : 'opacity-0'} />}
                                            </button>
                                            
                                            <div className="flex-grow">
                                                <span className={`text-sm font-medium ${task.is_completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                                    {task.title}
                                                </span>
                                            </div>
                                            
                                            <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded bg-opacity-20 border border-red-400/20">
                                                <Sword size={12} /> {task.damage} DMG
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 pb-20 animate-fade-in w-full">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                            <Shield size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                            Boss Arena
                        </span>
                    </div>
                    <h2 className="text-3xl font-semibold text-white tracking-tight font-[family-name:var(--font-heading)]">Epic Encounters</h2>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Overcome your massive hurdles by striking them down piece by piece.</p>
                </div>
            </header>

            {/* Active Bosses */}
            {activeBosses.length > 0 && (
                <section className="space-y-8">
                    {activeBosses.map(boss => renderBossCard(boss, true))}
                </section>
            )}

            {activeBosses.length === 0 && (
                <div className="p-12 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Shield className="text-slate-600 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-300">The Realm is Safe... For Now</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm">You have defeated all active bosses! A new challenger will approach next week.</p>
                </div>
            )}

            {/* Defeated Bosses */}
            {defeatedBosses.length > 0 && (
                <section className="mt-8">
                    <div className="flex items-center gap-3 mb-6 opacity-60">
                        <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">Trophies of Victory</h3>
                        <div className="h-px bg-[var(--border-light)] flex-grow mt-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
                        {defeatedBosses.map(boss => renderBossCard(boss, false))}
                    </div>
                </section>
            )}

        </div>
    );
}
