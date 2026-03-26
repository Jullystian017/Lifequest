"use client";

import { Bell, Flame, LogOut, Settings, User, MoreHorizontal, CheckCircle2, Clock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchQuests, fetchHabits, userQueryKey, questsQueryKey, habitsQueryKey } from "@/lib/queries";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine dynamic title based on the active route
  const getPageInfo = () => {
    const hour = new Date().getHours();
    let greeting = "";

    if (hour >= 5 && hour < 12) {
      greeting = "Semangat pagi! Mulai quest pertamamu untuk meningkatkan Disiplin.";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Pertahankan momentumnya! Kamu membuat kemajuan hebat hari ini.";
    } else {
      greeting = "Kerja bagus hari ini. Cek ringkasan harianmu sebelum istirahat.";
    }

    switch (pathname) {
      case "/dashboard":
        return { title: "Pusat Komando", subtitle: greeting };
      case "/dashboard/quests":
        return { title: "Quest Board", subtitle: "Kelola dan taklukkan semua misimu" };
      case "/dashboard/quest-master":
        return { title: "Quest Master", subtitle: "Biarkan AI merancang petualanganmu" };
      case "/dashboard/character":
        return { title: "Karakter", subtitle: "Lihat profil dan statistik karaktermu" };
      case "/dashboard/shop":
        return { title: "Toko", subtitle: "Belanja item keren dengan gold-mu" };
      case "/dashboard/analytics":
        return { title: "Analitik", subtitle: "Pantau perkembangan dan performa" };
      case "/dashboard/ai":
        return { title: "Asisten AI", subtitle: "Game Master pribadimu" };
      case "/dashboard/ai/insights":
        return { title: "AI Self-Reflection", subtitle: "Weekly retrospective & burnout detection" };
      case "/dashboard/notes":
        return { title: "Catatan", subtitle: "Basis pengetahuan dan ide-idemu" };
      case "/dashboard/achievements":
        return { title: "Pencapaian", subtitle: "Badge dan milestone pencapaianmu" };
      case "/dashboard/leaderboard":
        return { title: "Papan Peringkat", subtitle: "Kompetisi dan ranking" };
      case "/dashboard/notifications":
        return { title: "Notifikasi", subtitle: "Semua pemberitahuanmu" };
      case "/dashboard/settings":
        return { title: "Pengaturan", subtitle: "Konfigurasi akunmu" };
      default:
        return { title: "LifeQuest", subtitle: "Selamat datang kembali, Petualang" };
    }
  };

  const { title, subtitle } = getPageInfo();

  const { data: user } = useQuery({ queryKey: userQueryKey(userId!), queryFn: () => fetchUser(userId!), enabled: !!userId });
  const { data: quests = [] } = useQuery({ queryKey: questsQueryKey(userId!), queryFn: () => fetchQuests(userId!), enabled: !!userId });
  const { data: habits = [] } = useQuery({ queryKey: habitsQueryKey(userId!), queryFn: () => fetchHabits(userId!), enabled: !!userId });

  const coins = user?.gold ?? 0;
  const level = user?.level ?? 1;
  const xp = user?.xp ?? 0;
  const xpToNextLevel = user?.xp_to_next_level ?? 100;
  const username = user?.username ?? "Petualang";
  const avatar_url = user?.avatar_url ?? "/lifequest.png";

  const totalCompletedQuests = useMemo(() => quests.filter((q: any) => q.is_completed).length, [quests]);
  const maxStreak = useMemo(() => habits.length > 0 ? Math.max(...habits.map((h: any) => h.current_streak ?? 0), 0) : 0, [habits]);

  return (
    <header className="h-24 flex items-center justify-between px-10 bg-[var(--bg-main)] sticky top-0 z-30 w-full border-b border-white/[0.02]">

      {/* 1. Left Side: Page Title */}
      <div className="flex flex-col gap-1.5 w-1/3">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-white tracking-tight leading-none">
          {title}
        </h1>
        <p className="text-xs font-medium text-slate-500 tracking-wide">
          {subtitle}
        </p>
      </div>

      {/* 2. Center: Empty per user request */}
      <div className="flex-1 flex justify-center items-center">
      </div>

      {/* 3. Right Side: Resources & Identity (The Essentials) */}
      <div className="flex items-center justify-end gap-3 w-1/3">

        {/* Currency (Gold) */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 p-2.5 bg-[#1b1c28] border border-white/[0.05] rounded-xl flex items-center justify-center hover:bg-white/[0.05] transition-all relative shadow-sm cursor-pointer group shrink-0">
            <span className="text-base leading-none group-hover:scale-110 transition-transform duration-300">🪙</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"></div>
          </button>
          <div className="flex flex-col items-start leading-none group cursor-pointer mr-2">
            <span className="text-[9px] font-bold text-orange-400/80 uppercase tracking-widest hidden sm:block">Kekayaan</span>
            <span className="text-sm font-black text-white group-hover:text-white transition-colors mt-[1px] whitespace-nowrap">{coins.toLocaleString()} <span className="text-amber-500/80 text-xs font-bold">G</span></span>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative mr-1" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`p-2.5 bg-[#1b1c28] border rounded-xl text-slate-400 hover:text-white transition-all relative shadow-sm ${isNotifOpen ? 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.2)]' : 'border-white/[0.05]'}`}
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#1b1c28]" />
          </button>

          {/* Notification Dropdown Modal */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="absolute right-0 top-full mt-4 w-80 bg-[#1b1c28] border border-white/[0.05] rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col"
              >
                {/* Header */}
                <div className="p-4 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
                  <h4 className="text-white font-bold text-sm">Notifikasi</h4>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">2 BARU</span>
                </div>

                {/* Notification List */}
                <div className="max-h-[300px] overflow-y-auto flex flex-col">
                  {/* Item 1 */}
                  <div className="p-4 border-b border-white/[0.02] flex items-start gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer relative overflow-hidden group">
                    <div className="w-1 absolute left-0 top-0 bottom-0 bg-indigo-500"></div>
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white leading-tight">Quest Selesai</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">Kamu baru saja menyelesaikan quest. +50 XP dan 100 G didapatkan.</p>
                      <span className="text-[9px] font-semibold text-slate-500 mt-2 block flex items-center gap-1">
                        <Clock size={10} /> 2 menit lalu
                      </span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 border-b border-white/[0.02] flex items-start gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer relative overflow-hidden group">
                    <div className="w-1 absolute left-0 top-0 bottom-0 bg-orange-500"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Flame size={16} className="text-orange-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white leading-tight">Peringatan Streak</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">Jangan putuskan momentum 42 harimu! Selesaikan kebiasaan harian segera.</p>
                      <span className="text-[9px] font-semibold text-slate-500 mt-2 block flex items-center gap-1">
                        <Clock size={10} /> 1 jam lalu
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <button className="p-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.02] transition-colors text-center w-full">
                  Tandai semua sudah dibaca
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-3 cursor-pointer group bg-[#1b1c28] border border-white/[0.05] p-1.5 pr-4 rounded-2xl hover:bg-white/[0.05] transition-all shadow-sm relative"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className={`w-10 h-10 rounded-xl overflow-hidden border transition-all shadow-sm shrink-0 ${isProfileOpen ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/[0.05] group-hover:border-indigo-500 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]'}`}>
              <img src={avatar_url || "/lifequest.png"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start hidden md:flex min-w-[100px]">
              <span className="text-sm font-bold text-white group-hover:text-white transition-colors truncate">{username}</span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase truncate">LVL {level} Petualang</span>
            </div>
            <div className="hidden md:flex pl-1">
              <MoreHorizontal size={16} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* Profile Dropdown Modal */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "tween", duration: 0.2 }}
                className="absolute right-0 top-full mt-4 w-72 bg-[#1b1c28] border border-white/[0.05] rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col"
              >
                {/* Header / XP Info */}
                <div className="p-5 border-b border-white/[0.05] bg-white/[0.01]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-indigo-500/50 object-cover">
                      <img src={avatar_url || "/lifequest.png"} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base leading-tight">{username}</h4>
                      <p className="text-indigo-400 font-semibold text-xs tracking-wide">LVL {level} PETUALANG</p>
                    </div>
                  </div>

                  {/* XP Bar inside modal */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pengalaman</span>
                      <span className="text-[10px] font-bold text-white">{xp} / {xpToNextLevel} XP</span>
                    </div>
                    <div className="h-2 w-full bg-[#2a2b3d] rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(xp / xpToNextLevel) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 text-center mt-1">{xpToNextLevel - xp} XP menuju level berikutnya</p>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-px bg-white/[0.05]">
                  <div className="bg-[#1b1c28] p-3 flex flex-col items-center justify-center gap-1 hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <span className="text-orange-500 font-bold text-lg leading-none">{maxStreak}</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold text-center">Hari Streak</span>
                  </div>
                  <div className="bg-[#1b1c28] p-3 flex flex-col items-center justify-center gap-1 hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <span className="text-emerald-400 font-bold text-lg leading-none">{totalCompletedQuests}</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold text-center">Quest Selesai</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2 flex flex-col gap-1">
                  <Link 
                    href="/dashboard/character" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors text-sm font-semibold"
                  >
                    <User size={16} className="text-slate-400" />
                    Lihat Profil Lengkap
                  </Link>
                  <Link 
                    href="/dashboard/settings" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors text-sm font-semibold"
                  >
                    <Settings size={16} className="text-slate-400" />
                    Pengaturan Akun
                  </Link>
                  <div className="h-px bg-white/[0.05] my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
