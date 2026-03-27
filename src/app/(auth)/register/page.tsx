"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, ArrowRight, Eye, EyeOff, Github } from "lucide-react";
import AuthHero from "../_components/AuthHero";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
        }
      }
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Selamat datang! Cek emailmu untuk verifikasi identitas.");
      setTimeout(() => {
        router.push("/dashboard/onboarding");
      }, 2500);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* ================= LEFT SIDE (AUTH FORM) ================= */}
      <div className="w-full md:w-[45%] flex flex-col p-8 md:p-12 lg:p-16 relative overflow-hidden h-screen justify-center order-2 md:order-1">
        {/* LOGO */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center p-1">
             <img src="/logo.png" alt="LifeQuest" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">LifeQuest</span>
        </div>

        <div className="max-w-sm mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Create Account</h1>
            <p className="text-slate-500 text-sm mb-6">
              Forge your legend and start your productivity adventure.
            </p>

            {(errorMsg || successMsg) && (
              <div className={`border text-xs p-3.5 rounded-xl mb-6 font-medium ${
                errorMsg ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              }`}>
                {errorMsg || successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="HeroName"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-11 pr-4 py-3 
                    focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm placeholder:text-slate-700 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input
                    type="email"
                    placeholder="hero@lifequest.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-11 pr-4 py-3 
                    focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm placeholder:text-slate-700 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-11 pr-12 py-3 
                    focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm placeholder:text-slate-700 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl 
                shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 uppercase text-xs tracking-widest"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
              </button>
            </form>

            {/* SEPARATOR */}
            <div className="relative my-6 flex items-center">
              <div className="flex-1 h-px bg-white/5" />
              <span className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Or Continue With</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* SOCIAL LOGIN */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group scale-100 active:scale-[0.98] shadow-lg shadow-black/20"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
                <span className="text-sm font-black text-slate-300 group-hover:text-white uppercase tracking-widest">Sign up via Google</span>
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already Have An Account?{" "}
              <Link href="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Log In.</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (VISUAL HERO) ================= */}
      <div className="hidden md:flex flex-1 bg-indigo-600 lg:p-16 flex-col justify-center items-center relative overflow-hidden order-1 md:order-2 h-screen">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-800" />
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-2xl text-center md:text-left flex flex-col items-center md:items-start p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 w-full"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter">
               Join the quest <br className="hidden lg:block" /> for productivity.
            </h2>
            <p className="text-white/60 text-lg lg:text-xl max-w-md font-medium">
               A developer RPG that turns your daily tasks into experience points.
            </p>

            {/* MOCKUP COMPONENT */}
            <div className="mt-8 w-full">
              <AuthHero />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}