"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser, fetchQuests, fetchHabits, userQueryKey, questsQueryKey, habitsQueryKey } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
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
    ArrowUpRight,
    History,
    Flame,
    Swords,
    TreePine,
} from "lucide-react";
import AvatarRenderer from "@/components/character/AvatarRenderer";
import AttributeRadarChart from "@/components/dashboard/AttributeRadarChart";
import { motion } from "framer-motion";
import Link from "next/link";

type Tab = "stats" | "history" | "equipment";

export default function CharacterPage() {
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("stats");

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserId(data.user.id);
        });
    }, []);

    const { data: user } = useQuery({
        queryKey: userQueryKey(userId!),
        queryFn: () => fetchUser(userId!),
        enabled: !!userId,
    });

    const { data: quests = [] } = useQuery({
        queryKey: questsQueryKey(userId!),
        queryFn: () => fetchQuests(userId!),
        enabled: !!userId,
    });

    const { data: habits = [] } = useQuery({
        queryKey: habitsQueryKey(userId!),
        queryFn: () => fetchHabits(userId!),
        enabled: !!userId,
    });

    const level = user?.level || 1;
    const xp = user?.total_xp || 0;
    const xpToNextLevel = user?.xp_to_next_level || 100;
    const stats: Record<string, number> = user?.stats || { health: 0, knowledge: 0, discipline: 0, finance: 0, creativity: 0 };
    const coins = user?.coins || 0;
    const username = user?.username || "Petualang";
    const inventory = user?.inventory || [];
    const equippedItems = user?.equipped_items || {};

    // Temporary static items structure since we haven't synced shopItems to DB yet
    const items = [
        { id: "avatar_frame_gold", name: "Golden Frame", description: "Exclusive golden avatar frame", price: 500, category: "cosmetic", slot: "border" }
    ];

    const ownedCosmetics = items.filter(i => i.category === 'cosmetic' && inventory.includes(i.id));
    const xpPercentage = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;
    const completedQuests = quests.filter((q: any) => q.is_completed);
    const streakCount = habits.filter((h: any) => h.completed_today).length;
    const totalXpEarned = completedQuests.reduce((sum: number, q: any) => sum + (q.xp_reward || 0), 0);

    const equipItem = async (slot: string, itemId: string) => {
        // We will mock this or handle with mutation later if needed
    };

    const statsLabels: Record<string, string> = {
        health: "Vitalitas",
        knowledge: "Kecerdasan",
        discipline: "Disiplin",
        finance: "Keuangan",
        creativity: "Kreativitas",
    };

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

    const tabs = [
        { id: "stats" as Tab, label: "Statistik", icon: Zap },
        { id: "history" as Tab, label: "Riwayat", icon: History },
        { id: "equipment" as Tab, label: "Perlengkapan", icon: Package },
    ];

    return (
        <div className="flex flex-col gap-10 pb-20 animate-fade-in w-full">

            {/* Profile Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-[1px] shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                            <div className="w-full h-full rounded-[23px] bg-[var(--bg-card)] flex items-center justify-center overflow-hidden">
                                <AvatarRenderer className="w-full h-full p-2" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-[var(--primary)] text-white text-[10px] font-semibold px-3 py-1.5 rounded-full border-2 border-[var(--bg-card)]">
                            LVL {level}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-semibold text-white tracking-tight font-[family-name:var(--font-heading)]">{username}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-semibold uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20">
                                <Shield size={12} />
                                Level {level} Petualang
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                                <Star size={12} />
                                {coins.toLocaleString()} Gold
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-grow max-w-md w-full space-y-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--text-muted)] font-semibold uppercase tracking-widest">Poin Pengalaman</span>
                        <span className="text-white font-semibold">{xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
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

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Trophy size={20} /></div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Quest Selesai</p>
                        <p className="text-xl font-semibold text-white">{completedQuests.length}</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl"><Flame size={20} /></div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Streak Aktif</p>
                        <p className="text-xl font-semibold text-white">{streakCount} Hari</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl"><Zap size={20} /></div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total XP</p>
                        <p className="text-xl font-semibold text-white">{totalXpEarned.toLocaleString()}</p>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><Swords size={20} /></div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Quest Aktif</p>
                        <p className="text-xl font-semibold text-white">{quests.filter(q => !q.is_completed).length}</p>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "bg-[var(--bg-card)] border border-[var(--border-light)] text-slate-400 hover:text-white"}`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "stats" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-5">
                        <div className="relative p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] overflow-hidden">
                            <span className="absolute top-4 left-4 z-20 text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">Tampilan Karakter</span>
                            <div className="w-full aspect-square flex items-center justify-center">
                                <AvatarRenderer className="w-full h-full p-2" />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[var(--bg-card)] border border-[var(--border-light)] p-8 rounded-3xl">
                            <div className="order-2 md:order-1 space-y-6">
                                <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-heading)] uppercase tracking-tight">Atribut</h3>
                                <div className="space-y-4">
                                    {Object.entries(stats).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 rounded bg-[var(--bg-main)]" style={{ color: statsColors[key] }}>{statsIcons[key]}</div>
                                                    <span className="text-slate-400 font-semibold">{statsLabels[key] || key}</span>
                                                </div>
                                                <span className="text-white font-semibold">{value}%</span>
                                            </div>
                                            <div className="h-2 bg-[var(--bg-main)] rounded-full overflow-hidden border border-white/5">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full rounded-full" style={{ backgroundColor: statsColors[key] }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <AttributeRadarChart />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "history" && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Riwayat Quest Selesai</h3>
                    {completedQuests.length === 0 ? (
                        <div className="p-12 rounded-3xl bg-[var(--bg-card)] border border-dashed border-white/10 text-center">
                            <Trophy size={40} className="text-slate-700 mx-auto mb-4" />
                            <p className="text-sm font-semibold text-slate-400">Belum ada quest yang diselesaikan</p>
                            <p className="text-xs text-slate-500 mt-1">Selesaikan quest pertamamu dan riwayatmu akan muncul di sini!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {completedQuests.slice(0, 20).map((quest, idx) => (
                                <motion.div
                                    key={quest.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <Trophy size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{quest.title}</p>
                                            <p className="text-[10px] text-slate-500 font-semibold">
                                                {quest.completed_at ? new Date(quest.completed_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Baru saja"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">+{quest.xp_reward} XP</span>
                                        <span className="text-[10px] font-semibold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">+{quest.coin_reward} G</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "equipment" && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Package size={20} className="text-[var(--primary)]" />
                        <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-heading)] uppercase tracking-tight">Inventaris Perlengkapan</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {ownedCosmetics.length > 0 ? (
                            ownedCosmetics.map(item => {
                                const slot = item.slot || 'none';
                                const isEquipped = equippedItems[slot] === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => equipItem(slot, item.id)}
                                        className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${isEquipped
                                            ? "bg-[var(--primary)]/10 border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                                            : "bg-[var(--bg-card)] border-[var(--border-light)] hover:border-[var(--border-active)] hover:-translate-y-1"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-2 rounded-lg bg-[var(--bg-main)] ${isEquipped ? "text-[var(--primary)]" : "text-slate-400"}`}>
                                                <Star size={16} />
                                            </div>
                                            {isEquipped && (
                                                <span className="text-[8px] font-semibold uppercase tracking-widest py-0.5 px-2 bg-[var(--primary)] text-white rounded-full">Dipakai</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-1 capitalize">{slot === 'none' ? 'Kosmetik' : slot}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-[var(--bg-card)] border border-dashed border-[var(--border-light)] rounded-3xl">
                                <Package size={48} className="text-slate-700 mb-4" />
                                <p className="text-slate-500 font-medium">Inventaris kosong</p>
                                <Link href="/dashboard/shop" className="mt-4 flex items-center gap-2 text-[var(--primary)] text-xs font-semibold uppercase tracking-widest hover:text-white transition-colors">
                                    Kunjungi Toko <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
