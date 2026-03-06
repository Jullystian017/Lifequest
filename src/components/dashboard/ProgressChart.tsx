"use client";

import Card from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const data = [
  { name: "Mon", tasks: 4, xp: 400 },
  { name: "Tue", tasks: 7, xp: 850 },
  { name: "Wed", tasks: 5, xp: 600 },
  { name: "Thu", tasks: 9, xp: 1100 },
  { name: "Fri", tasks: 6, xp: 750 },
  { name: "Sat", tasks: 3, xp: 300 },
  { name: "Sun", tasks: 8, xp: 950 },
];

export default function ProgressChart() {
  return (
    <Card className="min-h-[350px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
            📊 Productivity Trend
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Weekly performance based on XP and tasks
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
             <span className="text-[10px] text-[var(--text-muted)]">XP</span>
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)]" />
             <span className="text-[10px] text-[var(--text-muted)]">Tasks</span>
           </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dark-border)" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748B", fontSize: 10 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748B", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid #334155",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#F8FAFC",
              }}
              cursor={{ stroke: '#475569', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="xp"
              stroke="var(--primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorXp)"
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="var(--secondary)"
              strokeWidth={2}
              dot={{ fill: "var(--secondary)", r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
