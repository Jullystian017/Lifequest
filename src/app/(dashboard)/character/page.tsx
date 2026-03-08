"use client";

import { useUserStatsStore } from "@/store/userStatsStore";
import { useShopStore, ShopItem } from "@/store/shopStore";
import { 
    User, 
    Shield, 
    Zap, 
    Trophy, 
    Star, 
    Heart, 
    BookOpen, 
    Dumbbell, 
    PiggyBank, 
    Palette,
    Package,
    ArrowUpRight
} from "lucide-react";
import CharacterAvatar from "@/components/dashboard/CharacterAvatar";
import AttributeRadarChart from "@/components/dashboard/AttributeRadarChart";
import { motion } from "framer-motion";

export default function CharacterPage() {
    const { level, xp, xpToNextLevel, stats, equippedItems, equipItem } = useUserStatsStore();
    const { items, inventory } = useShopStore();

    // Owned items that are cosmetics
    const ownedCosmetics = items.filter(i => i.category === 'cosmetic' && inventory.includes(i.id));

    const xpPercentage = (xp / xpToNextLevel) * 100;

    const statsIcons: Record<string, React.ReactNode> = {
        health: <Heart size={16} />,
        knowledge: <BookOpen size={16} />,
        discipline: <Dumbbell size={16} />,
        finance: <PiggyBank size={16} />,
        creativity: <Palette size={16} />,
    };

    const statsColors: Record<string, string> = {
        health: "var(--health)",
        knowledge: "var(--knowledge)",
        discipline: "var(--discipline)",
        finance: "var(--finance)",
        creativity: "var(--creativity)",
    };

    return (
        <div className="flex flex-col gap-10 pb-20 animate-fade-in w-full">
            
            {/* 1. Profile Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-[1px] shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                            <div className="w-full h-full rounded-[23px] bg-[var(--bg-card)] flex items-center justify-center overflow-hidden">
                                <img src="/characters/base.png" alt="Avatar" className="w-full h-full object-cover p-2" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-[var(--primary)] text-white text-[10px] font-bold px-3 py-1.5 rounded-full border-2 border-[var(--bg-card)]">
                            LVL {level}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight font-[family-name:var(--font-heading)]">Alex Miller</h2>
                        <div className="flex items-center gap-3 mt-2">
                             <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20">
                                <Shield size={12} />
                                Master Adventurer
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-[var(--primary)] font-bold uppercase tracking-widest bg-[var(--primary)]/10 px-2 py-1 rounded-md border border-[var(--primary)]/20">
                                <Star size={12} />
                                Top 1% This Week
                            </div>
                        </div>
                    </div>
                </div>

                {/* XP Progress Bar */}
                <div className="flex-grow max-w-md w-full space-y-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--text-muted)] font-bold uppercase tracking-widest">Experience Points</span>
                        <span className="text-white font-bold">{xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
                    </div>
                    <div className="h-3 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${xpPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* 2. Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left: Avatar View */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="relative p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] overflow-hidden">
                        <div className="absolute top-4 left-4 z-20">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                                Character View
                            </span>
                        </div>
                        <CharacterAvatar />
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Quests</p>
                                <p className="text-xl font-bold text-white">124</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                                <Zap size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Streaks</p>
                                <p className="text-xl font-bold text-white">42 Days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Attributes & Inventory */}
                <div className="lg:col-span-7 space-y-10">
                    
                    {/* Attributes Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[var(--bg-card)] border border-[var(--border-light)] p-8 rounded-3xl">
                        <div className="order-2 md:order-1 space-y-6">
                            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] uppercase tracking-tight">Attributes</h3>
                            <div className="space-y-4">
                                {Object.entries(stats).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 rounded bg-[var(--bg-main)]" style={{ color: statsColors[key] }}>
                                                    {statsIcons[key]}
                                                </div>
                                                <span className="capitalize text-slate-400 font-semibold">{key}</span>
                                            </div>
                                            <span className="text-white font-bold">{value}%</span>
                                        </div>
                                        <div className="h-2 bg-[var(--bg-main)] rounded-full overflow-hidden border border-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${value}%` }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: statsColors[key] }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <AttributeRadarChart />
                        </div>
                    </div>

                    {/* Inventory/Equipment Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Package size={20} className="text-[var(--primary)]" />
                            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] uppercase tracking-tight">Equipment Inventory</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {ownedCosmetics.length > 0 ? (
                                ownedCosmetics.map(item => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => equipItem(item.category, item.id)}
                                        className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                                            equippedItems[item.category] === item.id 
                                            ? "bg-[var(--primary)]/10 border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
                                            : "bg-[var(--bg-card)] border-[var(--border-light)] hover:border-[var(--border-active)] hover:-translate-y-1"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-2 rounded-lg bg-[var(--bg-main)] ${equippedItems[item.category] === item.id ? "text-[var(--primary)] shadow-glow" : "text-slate-400"}`}>
                                                <Star size={16} />
                                            </div>
                                            {equippedItems[item.category] === item.id && (
                                                <span className="text-[8px] font-bold uppercase tracking-widest py-0.5 px-2 bg-[var(--primary)] text-white rounded-full">Equipped</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-white truncate">{item.name}</p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-1">Cosmetic Set</p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center bg-[var(--bg-card)] border border-dashed border-[var(--border-light)] rounded-3xl">
                                    <Package size={48} className="text-slate-700 mb-4" />
                                    <p className="text-slate-500 font-medium">Your inventory is empty</p>
                                    <button className="mt-4 flex items-center gap-2 text-[var(--primary)] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                                        Go to Shop <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
