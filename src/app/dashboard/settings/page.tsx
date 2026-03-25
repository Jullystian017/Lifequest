"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser, userQueryKey } from "@/lib/queries";
import {
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
    Volume2,
    Save,
    Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type SettingsTab = 'account' | 'ai' | 'appearance' | 'notifications';

const STORAGE_KEY = "lifequest_settings";

interface AppSettings {
    theme: 'dark' | 'system';
    aiPersonality: 'mentor' | 'drill_sergeant' | 'cheerleader';
    soundEnabled: boolean;
    pushEnabled: boolean;
    displayName: string;
}

const DEFAULT_SETTINGS: AppSettings = {
    theme: 'dark',
    aiPersonality: 'mentor',
    soundEnabled: true,
    pushEnabled: true,
    displayName: '',
};

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const supabase = createClient();

    const [userId, setUserId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<SettingsTab>('ai');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchUserSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                if (user.email) setEmail(user.email);
            }
        };
        fetchUserSession();
    }, []);

    const { data: user } = useQuery({
        queryKey: userQueryKey(userId!),
        queryFn: () => fetchUser(userId!),
        enabled: !!userId,
    });

    const username = user?.username || "";

    // Load settings from localStorage
    const [settings, setSettings] = useState<AppSettings>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
        return { ...DEFAULT_SETTINGS, displayName: "" };
    });

    useEffect(() => {
        if (!settings.displayName && username) {
            setSettings(prev => ({ ...prev, displayName: username }));
        }
    }, [username]);

    const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/auth");
    };

    const saveSettings = async () => {
        setSaving(true);
        // Persist to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

        // Update username in Supabase
        if (settings.displayName !== username && userId) {
            await supabase.from("profiles").upsert({
                id: userId,
                username: settings.displayName,
                updated_at: new Date().toISOString(),
            }, { onConflict: "id" });
            
            queryClient.invalidateQueries({ queryKey: userQueryKey(userId) });
        }

        // Small delay for UX
        await new Promise(r => setTimeout(r, 500));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const TABS = [
        { id: 'account' as const, label: 'Akun', icon: User },
        { id: 'ai' as const, label: 'Asisten AI', icon: Bot },
        { id: 'appearance' as const, label: 'Tampilan', icon: Palette },
        { id: 'notifications' as const, label: 'Notifikasi', icon: Bell },
    ];

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Menu */}
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
                                        <p className="text-slate-400 text-sm">Pilih gaya komunikasi Asisten AI saat memberikan misi atau motivasi.</p>
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
                                                    onClick={() => updateSetting('aiPersonality', p.id as any)}
                                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                                                        settings.aiPersonality === p.id
                                                        ? "bg-[var(--primary)]/10 border-[var(--primary)] shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                                                        : "bg-black/20 border-white/5 hover:border-white/20"
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className={`p-2 rounded-lg bg-black/40 ${p.color}`}><AccIcon size={20} /></div>
                                                        {settings.aiPersonality === p.id && <div className="p-1 rounded-full bg-[var(--primary)] text-white"><Check size={12} /></div>}
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
                                        <p className="text-slate-400 text-sm">Kustomisasi antarmuka dan efek suara aplikasi.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-white mb-4">Tema Antarmuka</h3>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => updateSetting('theme', 'dark')}
                                                    className={`flex-1 p-4 flex flex-col items-center gap-3 rounded-2xl border-2 transition-all ${settings.theme === 'dark' ? 'bg-[var(--primary)]/10 border-[var(--primary)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                                >
                                                    <Moon size={24} className={settings.theme === 'dark' ? 'text-[var(--primary)]' : 'text-slate-400'} />
                                                    <span className={`text-sm font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-slate-400'}`}>Mode Gelap (Bawaan)</span>
                                                </button>
                                                <button
                                                    onClick={() => updateSetting('theme', 'system')}
                                                    className={`flex-1 p-4 flex flex-col items-center gap-3 rounded-2xl border-2 transition-all ${settings.theme === 'system' ? 'bg-[var(--primary)]/10 border-[var(--primary)]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                                >
                                                    <Monitor size={24} className={settings.theme === 'system' ? 'text-[var(--primary)]' : 'text-slate-400'} />
                                                    <span className={`text-sm font-bold ${settings.theme === 'system' ? 'text-white' : 'text-slate-400'}`}>Ikuti Sistem</span>
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
                                                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.soundEnabled ? 'left-7' : 'left-1'}`} />
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
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Nama Pengguna</label>
                                            <input
                                                type="text"
                                                value={settings.displayName}
                                                onChange={(e) => updateSetting('displayName', e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                                            <input
                                                type="email"
                                                disabled
                                                value={email || "memuat..."}
                                                className="w-full bg-black/40 border border-white/5 text-slate-500 rounded-xl px-4 py-3 outline-none cursor-not-allowed font-mono text-sm"
                                            />
                                            <p className="text-xs text-slate-500 mt-2">Email tidak dapat diubah saat ini.</p>
                                        </div>
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
                                                    <h3 className="text-sm font-bold text-white">Notifikasi Push</h3>
                                                    <p className="text-xs text-slate-400 mt-0.5">Peringatan browser saat quest harian tertunda</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => updateSetting('pushEnabled', !settings.pushEnabled)}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.pushEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.pushEnabled ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Save Button */}
                    <div className="mt-12 pt-6 border-t border-white/5 flex justify-end">
                        <button
                            onClick={saveSettings}
                            disabled={saving}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 ${
                                saved
                                ? "bg-emerald-600 text-white"
                                : "bg-[var(--primary)] text-white hover:opacity-90"
                            }`}
                        >
                            {saving ? (
                                <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
                            ) : saved ? (
                                <><Check size={16} /> Tersimpan!</>
                            ) : (
                                <><Save size={16} /> Simpan Perubahan</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
