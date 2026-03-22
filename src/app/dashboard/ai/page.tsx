"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuestStore } from "@/store/questStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import {
  Bot,
  Send,
  Sparkles,
  Swords,
  BarChart3,
  MessageCircle,
  Terminal,
  Loader2,
  Zap,
  RefreshCw,
} from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// Removed AIMode

const quickCommands = [
  { label: "Buat Quest Harian", icon: Swords, prompt: "Buatkan 3 quest harian yang bisa saya kerjakan hari ini" },
  { label: "Analisis Produktivitas", icon: BarChart3, prompt: "Analisis produktivitas saya berdasarkan quest yang sudah selesai dan berikan saran" },
  { label: "Motivasi Hari Ini", icon: Zap, prompt: "Berikan motivasi yang kuat untuk saya hari ini sebagai seorang petualang" },
  { label: "Review Harian", icon: RefreshCw, prompt: "Lakukan review harian terhadap progress saya dan berikan evaluasi" },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { username, level } = useUserStatsStore();
  const { quests } = useQuestStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: content.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          context: {
            username,
            level,
            totalQuests: quests.length,
            completedQuests: quests.filter(q => q.is_completed).length,
          }
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.reply || data.message || "Maaf, terjadi kesalahan. Coba lagi nanti.",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [...prev, {
        id: `e-${Date.now()}`,
        role: "assistant",
        content: "⚠️ Gagal terhubung ke AI. Pastikan koneksi internet dan API key sudah terkonfigurasi.",
      }]);
    }
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col -mt-8 -mb-8 -mx-10 animate-fade-in overflow-hidden relative" style={{ width: 'calc(100% + 5rem)' }}>
      {/* Chat Area - edge to edge */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Messages */}
        <div className={`flex-1 ${messages.length === 0 ? 'overflow-hidden' : 'overflow-y-auto'} p-4 md:px-8 md:py-6 space-y-6 scrollbar-hide`}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-start h-full text-center gap-5 pt-0">
              <div className="p-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <Bot size={48} className="text-indigo-400" />
              </div>
              
              <div className="w-full max-w-2xl px-4">
                <h3 className="text-2xl font-black text-white mb-1.5">Halo, {username}! 👋</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-5">
                  Game Master siap mendengar. Mau curhat, belajar sesuatu yang baru, atau langsung beri instruksi?
                </p>

                {/* Quick Commands Grid inside the empty state */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {quickCommands.map((cmd) => (
                    <motion.button
                      key={cmd.label}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendMessage(cmd.prompt)}
                      className="p-5 rounded-2xl bg-[#161A23] border border-white/5 hover:border-[var(--primary)]/50 transition-all group shadow-sm hover:shadow-xl hover:shadow-[var(--primary)]/10"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                          <cmd.icon size={20} />
                        </div>
                        <span className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight">{cmd.label}</span>
                      </div>
                      <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{cmd.prompt}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] px-6 py-4 rounded-3xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--primary)] text-white rounded-br-sm shadow-xl shadow-[var(--primary)]/20 font-medium"
                  : "bg-[#161A23] border border-white/5 text-slate-200 rounded-bl-sm shadow-lg font-medium"
              }`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                    <div className="p-1 rounded bg-[var(--primary)]/20"><Sparkles size={12} className="text-[var(--primary)]" /></div>
                    <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest text-shadow-sm">Game Master</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="px-6 py-4 rounded-3xl rounded-bl-sm bg-[#161A23] border border-white/5 shadow-lg">
                <div className="flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-[var(--primary)]" />
                  <span className="text-sm text-slate-400 font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-slate-200 animate-pulse">
                    Menganalisa...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - fixed at bottom and full width */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-[var(--bg-main)] border-t border-white/5 flex gap-3 z-10 w-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan, pertanyaan, atau instruksi..."
            className="flex-1 bg-[#161A23] border border-white/5 text-white rounded-2xl px-6 py-4 outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-slate-600 text-sm font-medium shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 rounded-2xl bg-[var(--primary)] text-white hover:bg-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-[var(--primary)]/20 flex flex-col items-center justify-center gap-1 group"
          >
            <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
