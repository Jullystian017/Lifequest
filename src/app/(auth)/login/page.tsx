"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, Github } from "lucide-react";
import AuthHero from "../_components/AuthHero";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setErrorMsg(error.message);
    else router.push("/dashboard");

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* ================= LEFT SIDE (AUTH FORM) ================= */}
      <div className="w-full md:w-[45%] flex flex-col p-8 md:p-12 lg:p-16 relative overflow-hidden h-screen justify-center">
        {/* LOGO */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center p-1">
             <img src="/Lifequest.png" alt="LifeQuest Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">LifeQuest</span>
        </div>

        <div className="max-w-sm mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Welcome Back</h1>
            <p className="text-slate-500 text-sm mb-8">
              Enter your email and password to access your account.
            </p>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl mb-6 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input
                    type="email"
                    placeholder="email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-11 pr-4 py-3 
                    focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm placeholder:text-slate-700 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
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

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 cursor-pointer group">
                   <div className="relative flex items-center">
                    <input type="checkbox" id="remember" className="peer appearance-none w-4 h-4 rounded border border-white/10 bg-white/5 checked:bg-indigo-600 checked:border-transparent transition-all cursor-pointer" />
                    <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-0.5 pointer-events-none" />
                   </div>
                  <label htmlFor="remember" className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors cursor-pointer font-bold">Remember Me</label>
                </div>
                <Link href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl 
                shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4 uppercase text-xs tracking-widest"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Log In"}
              </button>
            </form>

            {/* SEPARATOR */}
            <div className="relative my-8 flex items-center">
              <div className="flex-1 h-px bg-white/5" />
              <span className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Or Login With</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* SOCIAL LOGIN */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group scale-100 active:scale-95">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
                <span className="text-xs font-bold text-slate-300">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group scale-100 active:scale-95">
                <Github size={16} className="text-slate-400 group-hover:text-white transition-all" />
                <span className="text-xs font-bold text-slate-300">GitHub</span>
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don&apos;t Have An Account?{" "}
              <Link href="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Register Now.</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= RIGHT SIDE (VISUAL HERO) ================= */}
      <div className="hidden md:flex flex-1 bg-indigo-600 lg:p-16 flex-col justify-center items-center relative overflow-hidden h-screen">
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
              Effortlessly manage your <br className="hidden lg:block" /> dev life & operations.
            </h2>
            <p className="text-white/60 text-lg lg:text-xl max-w-md font-medium">
              Log in to access your Developer RPG dashboard and conquer your sprint goals.
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

// Check Icon for Checkbox
function Check({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}