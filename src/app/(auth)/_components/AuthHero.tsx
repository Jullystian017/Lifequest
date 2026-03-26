"use client";

import { motion } from "framer-motion";
import { 
  Heart, BookOpen, Swords, Zap, CheckCircle2, 
  LayoutDashboard, ListTodo, Users, Trophy, MessageSquare 
} from "lucide-react";

export default function AuthHero() {
  return (
    <div className="w-full max-w-2xl px-4 relative flex flex-col items-center">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -z-10" />
      
      {/* Browser Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full bg-[#0d111a] border border-white/10 rounded-[2rem] shadow-2xl shadow-black/50 overflow-hidden"
      >
        {/* Browser Top Bar */}
        <div className="border-b border-white/5 bg-white/5 px-6 py-3.5 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
          <div className="px-4 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500 flex items-center gap-2">
            <LayoutDashboard size={10} /> lifequest.web.id/dashboard
          </div>
          <div className="w-10" />
        </div>

        {/* Dashboard Layout */}
        <div className="flex min-h-[400px]">
          {/* SideNav */}
          <div className="w-12 border-r border-white/5 bg-black/20 flex flex-col items-center py-6 gap-6">
            <LayoutDashboard size={18} className="text-indigo-400" />
            <ListTodo size={18} className="text-slate-600" />
            <Users size={18} className="text-slate-600" />
            <Trophy size={18} className="text-slate-600" />
            <MessageSquare size={18} className="text-slate-600" />
          </div>

          {/* Main Space */}
          <div className="flex-1 p-6 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Developer RPG</p>
                <h3 className="text-xl font-black text-white">Project Dashboard</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Level 24</p>
                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Vitality", val: "85%", color: "rose", icon: Heart },
                { label: "Knowledge", val: "92%", color: "blue", icon: BookOpen },
                { label: "Discipline", val: "78%", color: "amber", icon: Swords }
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <s.icon size={12} className={`text-${s.color}-400`} />
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{s.label}</span>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-xs font-black text-white">{s.val}</span>
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: s.val }}
                        transition={{ duration: 1, delay: 1.2 + i * 0.1 }}
                        className={`h-full bg-${s.color}-500`} 
                       />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Boss Raid */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group">
                 <Swords className="absolute -right-2 -bottom-2 text-indigo-500/10 group-hover:scale-125 transition-transform" size={60} />
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Active Raid</p>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl">👾</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Bug Overlord</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Critical Priority</p>
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                      <span>Boss Health</span>
                      <span className="text-rose-400">4,250 / 10,000 HP</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full border border-white/5 overflow-hidden">
                       <motion.div 
                        animate={{ width: ["42%", "40%", "42%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-gradient-to-r from-rose-600 to-pink-500 shadow-[0_0_8px_rgba(225,29,72,0.4)]" 
                       />
                    </div>
                 </div>
              </div>

              {/* Recent Tasks */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Daily Tasks</p>
                 <div className="space-y-2">
                    {[
                      { t: "Implement Auth Layout", c: true },
                      { t: "Refactor Quest API", c: true },
                      { t: "Fix Boss Animation", c: false },
                      { t: "Deploy Build", c: false },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                        <div className={`w-3.5 h-3.5 rounded-full border transition-all flex items-center justify-center ${t.c ? "bg-indigo-500/20 border-indigo-500/40" : "border-white/10"}`}>
                           {t.c && <CheckCircle2 size={10} className="text-indigo-400" />}
                        </div>
                        <span className={`text-[10px] font-bold ${t.c ? "text-slate-500" : "text-slate-300"}`}>{t.t}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Bottom Decoration */}
            <div className="pt-2 flex justify-center opacity-30">
               <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Code decorations */}
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -right-10 top-0 text-[10px] font-mono text-indigo-500/20 select-none hidden lg:block"
      >
        <pre>{`interface Hero {
  id: string;
  name: string;
  level: number;
  stats: Stats;
}`}</pre>
      </motion.div>
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -left-10 bottom-0 text-[10px] font-mono text-purple-500/20 select-none hidden lg:block"
      >
        <pre>{`function levelUp() {
  xp += questXP;
  if(xp >= next) {
    level++;
  }
}`}</pre>
      </motion.div>
    </div>
  );
}
