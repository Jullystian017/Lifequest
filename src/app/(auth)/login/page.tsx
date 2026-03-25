"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0f1a]">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-[#0b0f1a] via-[#0d1222] to-[#0a0f18]" />
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-indigo-600/20 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* 🌟 MAIN CONTAINER */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 px-6 z-10">

        {/* ================= LEFT SIDE (FORM) ================= */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            <span className="text-white">Continue Your </span>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Journey
            </span>
          </h1>

          <p className="text-slate-400 mb-8 max-w-md">
            Login and keep leveling up your life. Every task completed brings you closer to your next achievement.
          </p>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.15)] space-y-6">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl 
                flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 
                transition active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Masuk <ArrowRight size={18} /></>}
              </button>
            </form>

            <p className="text-sm text-slate-400 text-center">
              Belum punya akun?{" "}
              <Link href="/register" className="text-indigo-400 hover:underline">Daftar</Link>
            </p>
          </div>
        </motion.div>

        {/* ================= RIGHT SIDE (VISUAL) ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex items-center justify-center relative"
        >
          {/* Efek Cahaya di belakang gambar agar terlihat menyatu */}
          <div className="absolute w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-[120px] -z-10" />
          
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full"
          >
            <img 
  src="/Innovation-amico.png" 
  alt="Innovation Illustration"
  className="w-full h-auto drop-shadow-[0_0_50px_rgba(168,85,247,0.4)] select-none"
/>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}