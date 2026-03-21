"use client";

import { 
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { 
    BarChart3, 
    TrendingUp, 
    Zap, 
    Target, 
    Trophy, 
    Calendar, 
    BrainCircuit,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from "lucide-react";
import ProductivityHeatmap from "@/components/dashboard/ProductivityHeatmap";
import { motion } from "framer-motion";

const trendData = [
  { name: "Mon", quests: 12, gold: 240 },
  { name: "Tue", quests: 18, gold: 380 },
  { name: "Wed", quests: 15, gold: 310 },
  { name: "Thu", quests: 25, gold: 520 },
  { name: "Fri", quests: 22, gold: 460 },
  { name: "Sat", quests: 35, gold: 780 },
  { name: "Sun", quests: 28, gold: 620 },
];

const categoryData = [
  { name: "Growth", value: 400, color: "#8B5CF6" },
  { name: "Health", value: 300, color: "#EF4444" },
  { name: "Focus", value: 300, color: "#10B981" },
  { name: "Social", value: 200, color: "#3B82F6" },
  { name: "Bosses", value: 150, color: "#F59E0B" },
];

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-10 pb-20 animate-fade-in w-full">
            
            {/* 1. Header & Controls */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 shadow-glow-sm">
                            <BarChart3 size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                            Intelligence Center
                        </span>
                    </div>
                    <h2 className="text-3xl font-semibold text-white tracking-tight font-[family-name:var(--font-heading)]">Productivity Insights</h2>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Deep dive into your habits, gains, and performance metrics.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] text-sm font-bold text-white cursor-pointer hover:border-[var(--primary)] transition-all">
                        <Calendar size={16} className="text-slate-500" />
                        <span>Last 30 Days</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] text-slate-500 hover:text-white cursor-pointer transition-all">
                        <Search size={20} />
                    </div>
                </div>
            </header>

            {/* 2. Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Quests", value: "342", sub: "+12.5%", trend: "up", icon: Trophy, color: "var(--discipline)" },
                    { label: "Time in Focus", value: "86h", sub: "+5.2%", trend: "up", icon: Zap, color: "var(--knowledge)" },
                    { label: "Gold Earned", value: "4.2k", sub: "-2.1%", trend: "down", icon: Target, color: "#EAB308" },
                    { label: "Completion Rate", value: "94%", sub: "+1.8%", trend: "up", icon: TrendingUp, color: "var(--health)" },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label} 
                        className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 rounded-xl bg-[var(--bg-main)] text-white" style={{ color: stat.color }}>
                                <stat.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.sub}
                            </div>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{stat.label}</p>
                        <h4 className="text-3xl font-bold text-white font-[family-name:var(--font-heading)]">{stat.value}</h4>
                        
                        {/* Interactive Sparkline Mockup */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--border-light)]">
                            <div className="h-full w-2/3 bg-current transition-all group-hover:w-full" style={{ color: stat.color, opacity: 0.3 }} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 3. Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Col: Main Chart (8 cols) */}
                <div className="lg:col-span-8 space-y-10">
                    
                    {/* Activity Area Chart */}
                    <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] uppercase tracking-tight">Quest & Wealth Flow</h3>
                                <p className="text-sm text-[var(--text-muted)] font-medium mt-1">Correlation between quests completed and gold earned</p>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorQuests" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: "#64748b", fontSize: 12 }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", color: "white" }}
                                        itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="gold" 
                                        stroke="#EAB308" 
                                        fillOpacity={1} 
                                        fill="url(#colorGold)" 
                                        strokeWidth={3}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="quests" 
                                        stroke="var(--primary)" 
                                        fillOpacity={1} 
                                        fill="url(#colorQuests)" 
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <ProductivityHeatmap />
                </div>

                {/* Right Col: Secondary Metrics (4 cols) */}
                <div className="lg:col-span-4 space-y-10">
                    
                    {/* AI Wisdom Widget - High Importance */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] relative border border-white/20 overflow-hidden shadow-2xl shadow-[var(--primary)]/20">
                        {/* Glassmorphism Overlay */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md">
                                    <BrainCircuit size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight uppercase">AI Wisdom</h3>
                                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Performance Analysis</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                                    <p className="text-sm font-medium text-white leading-relaxed">
                                        "You've increased your productivity by <span className="text-yellow-300 font-bold">18%</span> compared to last month. Most of your gold is coming from <span className="font-bold underline decoration-white/30 text-emerald-300">Health quests</span>. Consider prioritizing high-XP Knowledge quests to unlock your next class level faster."
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-widest">
                                    <Zap size={14} className="text-yellow-300" />
                                    <span>AI Grade: S-Rank</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative Icons */}
                        <Star className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
                    </div>

                    {/* Donut Chart: Productivity Distribution */}
                    <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] overflow-hidden">
                        <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)] uppercase tracking-tight mb-8">Quest Distribution</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-4 mt-4">
                            {categoryData.slice(0, 3).map(cat => (
                                <div key={cat.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-xs font-semibold text-slate-400">{cat.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-white">{(cat.value / 12).toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

// Icon helper
function Star({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}
