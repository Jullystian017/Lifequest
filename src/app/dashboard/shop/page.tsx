"use client";

import { useUserStatsStore } from "@/store/userStatsStore";
import { useShopStore, ShopItem } from "@/store/shopStore";
import { Coins, Snowflake, FlaskConical, Zap, Shield, Sparkles, Tv, Pizza, Plus, Check, ShoppingBag, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
    Snowflake: <Snowflake size={24} />,
    FlaskConical: <FlaskConical size={24} />,
    Zap: <Zap size={24} />,
    Shield: <Shield size={24} />,
    Sparkles: <Sparkles size={24} />,
    Tv: <Tv size={24} />,
    Pizza: <Pizza size={24} />
};

export default function ShopPage() {
    const { coins, addCoins } = useUserStatsStore();
    const { items, buyItem } = useShopStore();
    const [buyNotif, setBuyNotif] = useState<string | null>(null);

    const consumables = items.filter(i => i.category === 'consumable');
    const cosmetics = items.filter(i => i.category === 'cosmetic');
    const customRewards = items.filter(i => i.category === 'custom');

    const handleBuy = (id: string, name: string, price: number) => {
        if (coins < price) return;
        const success = buyItem(id);
        if (success) {
            addCoins(-price);
            setBuyNotif(name);
            setTimeout(() => setBuyNotif(null), 2000);
        }
    };

    const renderItemCard = (item: ShopItem) => {
        const affordable = coins >= item.price;
        const owned = item.isOwned;

        return (
            <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="group relative bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-6 overflow-hidden transition-all hover:border-[var(--border-active)] hover:shadow-2xl"
            >
                <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: item.color }}
                />

                <div className="flex flex-col h-full relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div 
                            className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] shadow-inner"
                            style={{ color: item.color }}
                        >
                            {iconMap[item.icon] || <Zap size={24} />}
                        </div>
                        <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg">
                            <Coins size={14} className="text-yellow-500" />
                            <span className="text-sm font-bold text-yellow-500">{item.price} G</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-6 flex-grow">{item.description}</p>

                    <button
                        onClick={() => handleBuy(item.id, item.name, item.price)}
                        disabled={!affordable || owned}
                        className={`w-full py-3 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
                            owned 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                            : affordable 
                                ? "bg-[var(--bg-main)] text-white border border-[var(--border-light)] hover:bg-yellow-500 hover:text-black hover:border-yellow-500" 
                                : "bg-[var(--bg-main)] text-slate-600 border border-[var(--border-light)] cursor-not-allowed"
                        }`}
                    >
                        {owned ? (
                            <>
                                <Check size={16} /> <span>Sudah Dimiliki</span>
                            </>
                        ) : affordable ? (
                            <>
                                <ShoppingBag size={16} /> <span>Beli Item</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={16} /> <span>Gold Tidak Cukup</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col gap-12 pb-20 animate-fade-in w-full">
            
            {/* Notifikasi Beli */}
            <AnimatePresence>
                {buyNotif && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-28 right-10 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-500/30"
                    >
                        <Check size={18} />
                        <span className="font-bold text-sm">Berhasil membeli {buyNotif}!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                            <Coins size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                            Pasar
                        </span>
                    </div>
                    <h2 className="text-3xl font-semibold text-white tracking-tight font-[family-name:var(--font-heading)]">Toko Item</h2>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Tukarkan gold hasil kerja kerasmu dengan boost, kosmetik, dan hadiah nyata.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl px-6 py-4 shadow-lg">
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Kekayaanmu</span>
                        <div className="flex items-center gap-2 mt-1">
                            <Coins size={20} className="text-yellow-500" />
                            <span className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">{coins.toLocaleString()}</span>
                            <span className="text-sm text-yellow-500 font-bold ml-1">G</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Kategori Toko */}
            <div className="space-y-12">
                
                {/* Konsumabel */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">Konsumabel</h3>
                        <div className="h-px bg-[var(--border-light)] flex-grow mt-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {consumables.map(renderItemCard)}
                    </div>
                </section>

                {/* Kosmetik */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">Kosmetik Profil</h3>
                        <div className="h-px bg-[var(--border-light)] flex-grow mt-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cosmetics.map(renderItemCard)}
                    </div>
                </section>

                {/* Hadiah Kustom */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">Hadiah Dunia Nyata</h3>
                            <div className="h-px w-12 bg-[var(--border-light)] mt-1 hidden md:block" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {customRewards.map(renderItemCard)}
                    </div>
                </section>
            </div>
        </div>
    );
}
