"use client";

import { motion } from "framer-motion";

interface HeatmapDay {
    date: string;
    intensity: 0 | 1 | 2 | 3 | 4; // 0 is none, 4 is max
}

// Generate mock data for the last 12 weeks
const generateMockHeatmapData = (): HeatmapDay[] => {
    const data: HeatmapDay[] = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        data.push({
            date: d.toISOString().split('T')[0],
            intensity: Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4
        });
    }
    return data;
};

const heatmapData = generateMockHeatmapData();

const intensityColors = {
    0: "bg-white/5",
    1: "bg-[var(--primary)]/20",
    2: "bg-[var(--primary)]/40",
    3: "bg-[var(--primary)]/70",
    4: "bg-[var(--primary)]",
};

export default function ProductivityHeatmap() {
    return (
        <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)] uppercase tracking-tight">Productivity Heatmap</h3>
                    <p className="text-sm text-[var(--text-muted)] font-medium mt-1">Consistency over the last 12 weeks</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-sm bg-white/5"></div>
                        <div className="w-2.5 h-2.5 rounded-sm bg-[var(--primary)]/20"></div>
                        <div className="w-2.5 h-2.5 rounded-sm bg-[var(--primary)]/40"></div>
                        <div className="w-2.5 h-2.5 rounded-sm bg-[var(--primary)]/70"></div>
                        <div className="w-2.5 h-2.5 rounded-sm bg-[var(--primary)]"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 overflow-x-auto pb-4 scrollbar-hide">
                <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-max">
                    {heatmapData.map((day, i) => (
                        <motion.div
                            key={day.date}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.005 }}
                            className={`w-3.5 h-3.5 rounded-sm ${intensityColors[day.intensity]} cursor-pointer hover:ring-2 hover:ring-white transition-all`}
                            title={`${day.date}: ${day.intensity} Activity Level`}
                        />
                    ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2 px-1">
                    <span>12 Weeks Ago</span>
                    <span>Today</span>
                </div>
            </div>
            
            {/* Background Aesthetic */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
