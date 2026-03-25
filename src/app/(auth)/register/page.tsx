"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, User, Shield, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    
    const { error } = await supabase.auth.signUp({
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
        router.push("/dashboard");
      }, 2500);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0f1a]">
      
      {/* 🌌 BACKGROUND (Serasi dengan Login tapi nuansa Emerald) */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-[#0b0f1a] via-[#0a1a1a] to-[#0a0f18]" />
        
        {/* Glow Effects - Emerald & Teal */}
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[140px]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* 🌟 MAIN CONTAINER */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 px-6 z-10 items-center">
        
        {/* ================= LEFT SIDE (FORM) ================= */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center order-2 md:order-1"
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
              <span className="text-white">Forge Your </span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Legend
              </span>
            </h1>
            <p className="text-slate-400 max-w-md">
              Sign up now and start your productivity adventure. Every great hero started with the first step.
            </p>
          </div>

          {/* REGISTER CARD */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.1)] space-y-6">
            
            {(errorMsg || successMsg) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl text-center text-xs font-medium border ${
                  errorMsg ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                }`}
              >
                {errorMsg || successMsg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* USERNAME */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Nama Karakter (Username)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Email Petualang"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Kata Sandi Rahasia"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3 
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password || !username}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 
                hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl 
                flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 
                transition active:scale-95 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Buat Karakter <ArrowRight size={18} /></>}
              </button>
            </form>

            <p className="text-sm text-slate-400 text-center">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Masuk di Sini
              </Link>
            </p>
          </div>
        </motion.div>

        {/* ================= RIGHT SIDE (VISUAL) ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="hidden md:flex items-center justify-center relative order-1 md:order-2"
        >
          {/* Efek Portal Hijau */}
          <div className="absolute w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
          
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-lg"
          >
            {/* Pakai aset gambar yang sama dengan login atau yang bertema inovasi tadi */}
            <img 
              src="/Innovation-amico.png" 
              alt="Register Hero Illustration"
              className="w-full h-auto drop-shadow-[0_0_50px_rgba(16,185,129,0.3)] select-none opacity-90"
            />
            
            {/* Floating Badge (Opsional untuk mempercantik) */}
            <motion.div 
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-10 right-10 bg-[#151921]/90 border border-emerald-500/30 p-4 rounded-2xl backdrop-blur-md shadow-xl"
            >
              <Shield className="text-emerald-400 mx-auto" size={32} />
              <p className="text-[10px] text-emerald-200 mt-2 font-bold tracking-widest uppercase text-center">New Hero</p>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}