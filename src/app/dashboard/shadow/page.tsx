"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShadowStore, ShadowEnemy } from "@/store/shadowStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import {
    Swords,
    Clock,
    Smartphone,
    Flame,
    Skull,
    Shield,
    Crosshair,
    Zap,
    Trophy,
    HeartPulse,
    ArrowLeft
} from "lucide-react";

const ICON_MAP: Record<string, any> = { Clock, Smartphone, Flame, Skull };

const DIFF_COLORS: Record<string, string> = {
    Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Medium: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    Hard: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    Boss: "text-red-500 bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
};

export default function ShadowSystemPage() {
    const { enemies, activeBattleId, startBattle, dealDamage, fleeBattle } = useShadowStore();
    const { addXp, level } = useUserStatsStore();
    const [attackEffect, setAttackEffect] = useState(false);

    const activeEnemy = enemies.find(e => e.id === activeBattleId);

    const handleAttack = () => {
        if (!activeEnemy || activeEnemy.hp <= 0) return;
        
        // Base damage based on user level
        const damage = Math.floor(Math.random() * 20) + (level * 5);
        dealDamage(damage);
        
        // Vfx trigger
        setAttackEffect(true);
        setTimeout(() => setAttackEffect(false), 200);

        // Check if defeated
        if (activeEnemy.hp - damage <= 0) {
            setTimeout(() => {
                addXp(activeEnemy.xpReward);
                // Also give coins here if connected to shopStore
                alert(`Kemenangan! Kamu mendapatkan ${activeEnemy.xpReward} XP dan ${activeEnemy.coinReward} Gold.`);
                fleeBattle(); // End battle
            }, 600);
        }
    };

    if (activeEnemy) {
        const IconComp = ICON_MAP[activeEnemy.icon] || Skull;
        const hpPercent = (activeEnemy.hp / activeEnemy.maxHp) * 100;
        const isDefeated = activeEnemy.hp <= 0;

        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] w-full">
                <button 
                    onClick={fleeBattle}
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Kabur
                </button>

                <div className="w-full max-w-2xl text-center space-y-12">
                    {/* Enemy Display */}
                    <AnimatePresence>
                        {!isDefeated && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: attackEffect ? [0, -10, 10, -10, 10, 0] : 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: -100, rotate: 10 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className={`w-40 h-40 rounded-full flex items-center justify-center bg-black/40 border-4 border-white/5 ${activeEnemy.difficulty === 'Boss' ? 'shadow-[0_0_50px_rgba(239,68,68,0.3)]' : ''}`}>
                                    <IconComp size={80} className={`${activeEnemy.color} ${attackEffect ? 'opacity-50' : 'opacity-100'}`} />
                                </div>
                                
                                <div>
                                    <h2 className={`text-4xl font-bold font-[family-name:var(--font-heading)] ${activeEnemy.color}`}>
                                        {activeEnemy.name}
                                    </h2>
                                    <p className="text-slate-400 mt-2 max-w-md mx-auto">{activeEnemy.description}</p>
                                </div>

                                {/* HP Bar */}
                                <div className="w-full max-w-md pt-4">
                                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                                        <span className={activeEnemy.color}>HP {activeEnemy.hp}</span>
                                        <span className="text-slate-500">MAX {activeEnemy.maxHp}</span>
                                    </div>
                                    <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/10 p-0.5">
                                        <motion.div 
                                            initial={{ width: '100%' }}
                                            animate={{ width: `${hpPercent}%` }}
                                            className={`h-full rounded-full transition-all duration-300 ${
                                                hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={handleAttack}
                            disabled={isDefeated}
                            className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-bold text-lg transition-all ${
                                isDefeated 
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "bg-[var(--primary)] text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] active:scale-95"
                            }`}
                        >
                            <Swords size={24} /> Serang!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                            <Swords size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight font-[family-name:var(--font-heading)]">
                            Shadow System
                        </h1>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        Lawan perwujudan kebiasaan burukmu. Kalahkan mereka untuk mendapatkan pengalaman ekstra (XP) dan Gold.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-3">
                        <Trophy size={16} className="text-yellow-500" />
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Menang</p>
                            <p className="text-sm font-bold text-white">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {enemies.map((enemy) => {
                    const IconComp = ICON_MAP[enemy.icon] || Skull;
                    const isBoss = enemy.difficulty === "Boss";
                    
                    return (
                        <div 
                            key={enemy.id}
                            className={`group relative p-6 rounded-3xl bg-[var(--bg-card)] border transition-all ${
                                isBoss 
                                ? "xl:col-span-2 border-red-500/30 hover:border-red-500/50 shadow-[inset_0_0_50px_rgba(239,68,68,0.05)]" 
                                : "border-[var(--border-light)] hover:border-white/20"
                            }`}
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className={`p-4 rounded-2xl bg-black/30 border border-white/5 ${enemy.color}`}>
                                    <IconComp size={isBoss ? 40 : 28} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border ${DIFF_COLORS[enemy.difficulty]}`}>
                                    {enemy.difficulty}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className={`font-bold font-[family-name:var(--font-heading)] ${isBoss ? 'text-2xl text-red-400' : 'text-lg text-white'}`}>
                                        {enemy.name}
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                                        {enemy.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-bold font-mono bg-black/20 p-3 rounded-xl">
                                    <span className="flex items-center gap-1.5 text-emerald-400">
                                        <HeartPulse size={14} /> {enemy.hp} HP
                                    </span>
                                    <span className="flex items-center gap-1.5 text-indigo-400">
                                        <Zap size={14} /> +{enemy.xpReward} XP
                                    </span>
                                </div>

                                <button 
                                    onClick={() => startBattle(enemy.id)}
                                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                        isBoss
                                        ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                                        : "bg-white/5 text-white hover:bg-[var(--primary)] border border-white/10"
                                    }`}
                                >
                                    <Swords size={16} /> Mulai Pertarungan
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
