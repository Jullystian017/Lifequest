"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchUser, 
  fetchQuests, 
  userQueryKey, 
  questsQueryKey,
  fetchChats,
  chatsQueryKey,
  fetchChatMessages,
  chatMessagesQueryKey
} from "@/lib/queries";
import { createChat, addChatMessage, deleteChat } from "@/lib/mutations";
import { createClient } from "@/lib/supabase/client";
import {
  Bot,
  Send,
  Sparkles,
  Swords,
  BarChart3,
  Loader2,
  Zap,
  RefreshCw,
  Plus,
  Trash2,
  MessageSquare
} from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const EMPTY_ARRAY = [] as any[];

const quickCommands = [
  { label: "Buat Quest Harian", icon: Swords, prompt: "Buatkan 3 quest harian yang bisa saya kerjakan hari ini" },
  { label: "Analisis Produktivitas", icon: BarChart3, prompt: "Analisis produktivitas saya berdasarkan quest yang sudah selesai dan berikan saran" },
  { label: "Motivasi Hari Ini", icon: Zap, prompt: "Berikan motivasi yang kuat untuk saya hari ini sebagai seorang petualang" },
  { label: "Review Harian", icon: RefreshCw, prompt: "Lakukan review harian terhadap progress saya dan berikan evaluasi" },
];

export default function AIAssistantPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
        if (data.user) setUserId(data.user.id);
    });
  }, []);

  const { data: user } = useQuery({
      queryKey: userQueryKey(userId!),
      queryFn: () => fetchUser(userId!),
      enabled: !!userId,
  });

  const { data: questsData } = useQuery({
      queryKey: questsQueryKey(userId!),
      queryFn: () => fetchQuests(userId!),
      enabled: !!userId,
  });
  const quests = questsData ?? EMPTY_ARRAY;

  const { data: chatsData } = useQuery({
      queryKey: chatsQueryKey(userId!),
      queryFn: () => fetchChats(userId!),
      enabled: !!userId,
  });
  const chats = chatsData ?? EMPTY_ARRAY;

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const { data: chatMessagesData } = useQuery({
      queryKey: chatMessagesQueryKey(activeChatId!),
      queryFn: () => fetchChatMessages(activeChatId!),
      enabled: !!activeChatId,
  });
  const chatMessages = chatMessagesData ?? EMPTY_ARRAY;

  const username = user?.username || "Pemain";
  const level = user?.level || 1;

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
        setLocalMessages(chatMessages);
    } else if (!activeChatId && localMessages.length > 0) {
        setLocalMessages(EMPTY_ARRAY);
    }
  }, [chatMessages, activeChatId, localMessages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, isLoading]);

  const createChatMutation = useMutation({
      mutationFn: async ({ title }: { title: string }) => createChat(userId!, title),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: chatsQueryKey(userId!) })
  });

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !userId) return;
    
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: content.trim(),
    };
    
    setLocalMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let currentChatId = activeChatId;

    try {
      if (!currentChatId) {
          const title = content.length > 30 ? content.substring(0, 30) + "..." : content;
          const newChat = await createChatMutation.mutateAsync({ title });
          currentChatId = newChat.id;
          setActiveChatId(newChat.id);
      }

      await addChatMessage(currentChatId!, "user", content.trim());
      queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey(currentChatId!) });

      const contextMessages = [...localMessages, userMsg].map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: contextMessages,
          context: {
            username,
            level,
            totalQuests: quests.length,
            completedQuests: quests.filter((q: any) => q.is_completed).length,
          }
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || data.message || "Maaf, terjadi kesalahan. Coba lagi nanti.";
      
      const savedMsg = await addChatMessage(currentChatId!, "assistant", replyContent);
      setLocalMessages((prev) => [...prev, savedMsg]);
      queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey(currentChatId!) });

    } catch (e) {
      console.error(e);
      setLocalMessages((prev) => [...prev, {
        id: `e-${Date.now()}`,
        role: "assistant",
        content: "⚠️ Gagal terhubung ke server/database. Coba lagi.",
      }]);
    }
    setIsLoading(false);
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
      e.stopPropagation();
      if (!confirm("Hapus percakapan ini?")) return;
      try {
          await deleteChat(chatId);
          queryClient.invalidateQueries({ queryKey: chatsQueryKey(userId!) });
          if (activeChatId === chatId) {
              setActiveChatId(null);
              setLocalMessages([]);
          }
      } catch (err) {
          console.error("Gagal hapus chat", err);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col md:flex-row -mt-8 -mb-8 -mx-10 animate-fade-in overflow-hidden relative border-t border-white/5" style={{ width: 'calc(100% + 5rem)' }}>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#161A23] border-b border-white/5 z-20">
        <button 
            onClick={() => { setActiveChatId(null); setLocalMessages([]); }}
            className="flex items-center gap-2 text-[13px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-4 py-2 rounded-xl"
        >
            <Plus size={16} /> Percakapan Baru
        </button>
      </div>

      {/* Sidebar for Chat History */}
      <div className="hidden md:flex flex-col w-72 bg-[#161A23] border-r border-white/5 z-20 overflow-hidden shrink-0">
        <div className="p-4 border-b border-white/5">
            <button 
                onClick={() => {
                    setActiveChatId(null);
                    setLocalMessages([]);
                }}
                className="w-full flex items-center gap-2 justify-center px-4 py-3 bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors rounded-xl font-bold text-sm"
            >
                <Plus size={16} /> Percakapan Baru
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
            {chats.map((chat: any) => (
                <div 
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`group w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${activeChatId === chat.id ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare size={16} className={activeChatId === chat.id ? 'text-[var(--primary)]' : 'opacity-50'} />
                        <span className="text-sm font-medium truncate">{chat.title}</span>
                    </div>
                    <button 
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10 transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
            {chats.length === 0 && (
                <div className="text-xs text-center text-slate-600 mt-10 font-medium px-4">
                    Belum ada riwayat percakapan. Mulai ngobrol sekarang!
                </div>
            )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[var(--bg-main)]">
        {/* Messages */}
        <div className={`flex-1 ${localMessages.length === 0 ? 'overflow-hidden' : 'overflow-y-auto'} p-4 md:px-8 md:py-6 space-y-6 scrollbar-hide`}>
          {localMessages.length === 0 && (
            <div className="flex flex-col items-center justify-start h-full text-center gap-5 pt-0">
              <div className="p-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/10 mt-6 md:mt-10">
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

          {localMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[90%] md:max-w-[75%] px-5 py-4 rounded-3xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--primary)] text-white rounded-br-sm shadow-xl shadow-[var(--primary)]/20 font-medium"
                  : "bg-[#161A23] border border-white/5 text-slate-200 rounded-bl-sm shadow-lg font-medium"
              }`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                    <div className="p-1.5 rounded bg-[var(--primary)]/20"><Sparkles size={12} className="text-[var(--primary)]" /></div>
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

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-[var(--bg-main)] border-t border-white/5 flex gap-3 z-10 w-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Tulis pesan, pertanyaan, atau instruksi..."
            className="flex-1 bg-[#161A23] border border-white/5 text-white rounded-2xl px-6 py-4 outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-slate-600 text-sm font-medium shadow-inner disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-4 rounded-2xl bg-[var(--primary)] text-white hover:bg-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-[var(--primary)]/20 flex items-center justify-center group"
          >
            <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}

