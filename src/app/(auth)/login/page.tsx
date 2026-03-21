"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, Sword, Loader2, ArrowRight } from "lucide-react";

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
        
        if (error) {
            setErrorMsg(error.message);
        } else {
            router.push("/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#0a0f18] overflow-hidden px-4">
            
            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] mb-6 backdrop-blur-md"
                    >
                        <Sword size={40} className="text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                    </motion.div>
                    
                    <h1 className="text-4xl font-black font-[family-name:var(--font-heading)] text-white tracking-tight drop-shadow-lg mb-2">
                        Enter the Realm
                    </h1>
                    <p className="text-sm font-medium text-indigo-200/60 uppercase tracking-widest">
                        Resume your Epic Quests
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="backdrop-blur-xl bg-[#151921]/80 border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                    {/* Hover Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {errorMsg && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider p-4 rounded-xl text-center flex items-center justify-center gap-2"
                            >
                                {errorMsg}
                            </motion.div>
                        )}
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 pl-1">Adventurer Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="hero@guild.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all shadow-inner placeholder:text-slate-600 font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 pl-1">Secret Passphrase</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all shadow-inner placeholder:text-slate-600 font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || !email || !password}
                            className="w-full relative group/btn disabled:opacity-50 disabled:cursor-not-allowed border-none mt-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 py-4 rounded-xl border border-white/20 shadow-xl overflow-hidden">
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Start Journey <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    A new traveler?{" "}
                    <Link href="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors uppercase tracking-wider text-xs ml-1">
                        Create Character
                    </Link>
                </div>

            </motion.div>
        </div>
    );
}
