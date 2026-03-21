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

type AIMode = "chat" | "command";

const quickCommands = [
  { label: "Buat Quest Harian", icon: Swords, prompt: "Buatkan 3 quest harian yang bisa saya kerjakan hari ini untuk meningkatkan produktivitas" },
  { label: "Analisis Produktivitas", icon: BarChart3, prompt: "Analisis produktivitas saya berdasarkan quest yang sudah selesai dan berikan saran perbaikan" },
  { label: "Motivasi Hari Ini", icon: Zap, prompt: "Berikan motivasi yang kuat untuk saya hari ini sebagai seorang petualang" },
  { label: "Review Harian", icon: RefreshCw, prompt: "Lakukan review harian terhadap progress saya dan berikan evaluasi" },
];

export default function AIAssistantPage() {
  const [mode, setMode] = useState<AIMode>("chat");
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
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-6 pb-4">
      {/* Mode Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMode("chat")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "chat" ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "bg-[var(--bg-card)] border border-[var(--border-light)] text-slate-400 hover:text-white"}`}
        >
          <MessageCircle size={16} /> Mode Chat
        </button>
        <button
          onClick={() => setMode("command")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "command" ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "bg-[var(--bg-card)] border border-[var(--border-light)] text-slate-400 hover:text-white"}`}
        >
          <Terminal size={16} /> Mode Perintah
        </button>
      </div>

      {mode === "command" && messages.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickCommands.map((cmd) => (
            <motion.button
              key={cmd.label}
              whileHover={{ y: -2 }}
              onClick={() => sendMessage(cmd.prompt)}
              className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] text-left hover:border-[var(--primary)]/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                  <cmd.icon size={18} className="text-[var(--primary)]" />
                </div>
                <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{cmd.label}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{cmd.prompt}</p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.length === 0 && mode === "chat" && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
                <Bot size={40} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Halo, {username}! 👋</h3>
                <p className="text-sm text-slate-400 max-w-md">
                  Aku adalah Game Master pribadimu. Tanya apa saja tentang quest, produktivitas, atau minta motivasi!
                </p>
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
              <div className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--primary)] text-white rounded-br-md"
                  : "bg-[var(--bg-sidebar)] border border-[var(--border-light)] text-slate-200 rounded-bl-md"
              }`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} className="text-[var(--secondary)]" />
                    <span className="text-[10px] font-semibold text-[var(--secondary)] uppercase tracking-widest">Game Master</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="px-5 py-3.5 rounded-2xl rounded-bl-md bg-[var(--bg-sidebar)] border border-[var(--border-light)]">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-[var(--secondary)]" />
                  <span className="text-xs text-slate-400 font-semibold">Sedang berpikir...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border-light)] flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "chat" ? "Ketik pesanmu..." : "Ketik perintah untuk AI..."}
            className="flex-1 bg-[var(--bg-sidebar)] border border-[var(--border-light)] text-white rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] transition-all placeholder:text-slate-600 text-sm font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[var(--primary)]/20"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
