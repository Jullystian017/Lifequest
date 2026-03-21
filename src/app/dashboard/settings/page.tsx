"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStatsStore } from "@/store/userStatsStore";
import {
    Settings,
    User,
    Bot,
    Palette,
    Bell,
    Shield,
    LogOut,
    Check,
    Smartphone,
    Monitor,
    Moon,
    Volume2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type SettingsTab = 'account' | 'ai' | 'appearance' | 'notifications';

export default function SettingsPage() {
    const { username } = useUserStatsStore();
    const router = useRouter();
    const supabase = createClient();
    
    const [activeTab, setActiveTab] = useState<SettingsTab>('ai');
    
    // Form States
    const [theme, setTheme] = useState<'dark' | 'system'>('dark');
    const [aiPersonality, setAiPersonality] = useState<'mentor' | 'drill_sergeant' | 'cheerleader'>('mentor');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/auth");
    };

    const TABS = [
        { id: 'account', label: 'Akun', icon: User },
        { id: 'ai', label: 'AI Assistant', icon: Bot },
        { id: 'appearance', label: 'Tampilan', icon: Palette },
        { id: 'notifications', label: 'Notifikasi', icon: Bell },
    ] as const;

    const saveSettings = () => {
        // Dummy save action
        alert("Pengaturan berhasil disimpan!");
    };

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Menus */}
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                                    isActive 
                                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" 
                                    : "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <span className="flex items-center gap-3 text-sm font-bold">
                                    <Icon size={18} /> {tab.label}
                                </span>
                            </button>
                        );
                    })}

                    <div className="pt-8 mt-8 border-t border-white/5">
                        <button 
                            onClick={handleLogout}
                            disabled={loading}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all font-bold text-sm"
                        >
                            <LogOut size={18} /> {loading ? "Keluar..." : "Keluar Akun"}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* AI SETTINGS */}
                            {activeTab === 'ai' && (
                                <>
                                    <div>
                                        <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] flex items-center gap-2 mb-2">
                                            <Bot size={20} className="text-[var(--primary)]" /> Kepribadian AI
                                        </h2>
                                        <p className="text-slate-400 text-sm">Pilih gaya komunikasi AI Assistant saat memberikan misi atau motivasi.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { id: 'mentor', title: 'Mentor Bijak', desc: 'Tenang, suportif, dan fokus pada pertumbuhan jangka panjang.', icon: Shield, color: 'text-indigo-400' },
                                            { id: 'drill_sergeant', title: 'Komandan Keras', desc: 'Disiplin tinggi, tegas, dan tidak menerima alasan prokrastinasi.', icon: User, color: 'text-red-400' },
                                            { id: 'cheerleader', title: 'Penyemangat', desc: 'Penuh energi, optimis, dan selalu merayakan kemenangan kecilmu.', icon: Bell, color: 'text-yellow-400' },
                                        ].map((p) => {
                                            const AccIcon = p.icon;
                                            return (
                                                <div 
                                                    key={p.id}
                                                    onClick={() => setAiPersonality(p.id as any)}
                                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                                                        aiPersonality === p.id 
                                                        ? "bg-[var(--primary)]/10 border-[var(--primary)] shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
                                                        : "bg-black/20 border-white/5 hover:border-white/20"
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className={`p-2 rounded-lg bg-black/40 ${p.color}`}><AccIcon size={20} /></div>
                                                        {aiPersonality === p.id && <div className="p-1 rounded-full bg-[var(--primary)] text-white"><Check size={12} /></div>}
                                                    </div>
                                                    <h3 className="font-bold text-white mb-1">{p.title}</h3>
                                                    <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* APPEARANCE SETTINGS */}
                            {activeTab === 'appearance' && (
                                <>
                                    <div>
                                        <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] flex items-center gap-2 mb-2">
                                            <Palette size={20} className="text-[var(--primary)]" /> Tampilan & Suara
                                        </h2>
                                        <p className="text-slate-400 text-sm">Kustomisasi interface dan efek suara aplikasi.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-white mb-4">Tema Antarmuka</h3>
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={() => setTheme('dark')}
                                                    className={`flex-1 p-4 flex flex-col items-center gap-3 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'bg-[var(--primary)]/10 border-[var(--primary)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                                >
                                                    <Moon size={24} className={theme === 'dark' ? 'text-[var(--primary)]' : 'text-slate-400'} />
                                                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-400'}`}>Dark Mode (Bawaan)</span>
                                                </button>
                                                <button 
                                                    onClick={() => setTheme('system')}
                                                    className={`flex-1 p-4 flex flex-col items-center gap-3 rounded-2xl border-2 transition-all ${theme === 'system' ? 'bg-[var(--primary)]/10 border-[var(--primary)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                                >
                                                    <Monitor size={24} className={theme === 'system' ? 'text-[var(--primary)]' : 'text-slate-400'} />
                                                    <span className={`text-sm font-bold ${theme === 'system' ? 'text-white' : 'text-slate-400'}`}>Ikuti Sistem</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><Volume2 size={20} /></div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-white">Efek Suara (SFX)</h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">Putar suara saat quest selesai atau naik level</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setSoundEnabled(!soundEnabled)}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${soundEnabled ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ACCOUNT SETTINGS */}
                            {activeTab === 'account' && (
                                <>
                                    <div>
                                        <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] flex items-center gap-2 mb-2">
                                            <User size={20} className="text-[var(--primary)]" /> Profil Akun
                                        </h2>
                                        <p className="text-slate-400 text-sm">Kelola informasi pemain utamamu.</p>
                                    </div>

                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Username (In-game Name)</label>
                                            <input 
                                                type="text" 
                                                defaultValue={username}
                                                className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                                            <input 
                                                type="email" 
                                                disabled
                                                defaultValue="user@example.com"
                                                className="w-full bg-black/40 border border-white/5 text-slate-500 rounded-xl px-4 py-3 outline-none cursor-not-allowed font-mono text-sm"
                                            />
                                            <p className="text-xs text-slate-500 mt-2">Email tidak dapat diubah saat ini.</p>
                                        </div>
                                        <button className="text-sm text-red-400 hover:text-red-300 font-bold mt-4 pt-4 border-t border-white/5 w-full text-left">
                                            Hapus Akun Permanen
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* NOTIFICATION SETTINGS */}
                            {activeTab === 'notifications' && (
                                <>
                                    <div>
                                        <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] flex items-center gap-2 mb-2">
                                            <Bell size={20} className="text-[var(--primary)]" /> Preferensi Notifikasi
                                        </h2>
                                        <p className="text-slate-400 text-sm">Pilih sistem pengingat yang cocok untukmu.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Smartphone size={20} /></div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-white">Push Notifications</h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">Peringatan browser saat quest harian tertunda</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setPushEnabled(!pushEnabled)}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${pushEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${pushEnabled ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Global Save Button for the forms */}
                    <div className="mt-12 pt-6 border-t border-white/5 flex justify-end">
                        <button 
                            onClick={saveSettings}
                            className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity hover:-translate-y-0.5"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
