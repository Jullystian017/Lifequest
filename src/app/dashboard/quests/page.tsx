"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchQuests, fetchUser, questsQueryKey, userQueryKey } from "@/lib/queries";
import { completeQuest as completeQuestMutFn, completeQuestPenalty, completeQuestBonus, createQuest, deleteQuest as deleteQuestFn, updateQuestStatus } from "@/lib/mutations";
import { Quest } from "@/types/quest";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  Plus, Loader2, X, Zap, Coins, Clock, CheckCircle2, CircleDot, Circle,
  Search, Filter, Target, CalendarDays, BrainCircuit, Play, Camera, ShieldCheck, Upload, Trash2
} from "lucide-react";

type KanbanColumn = "todo" | "in_progress" | "done";

const COLUMNS: { id: KanbanColumn; label: string; icon: any; color: string; border: string; bg: string }[] = [
  { id: "todo", label: "Daftar Tugas", icon: Circle, color: "text-slate-400", border: "border-slate-500/20", bg: "bg-slate-500/5" },
  { id: "in_progress", label: "Sedang Dikerjakan", icon: CircleDot, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
  { id: "done", label: "Selesai", icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
];

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  hard: "text-red-400 bg-red-500/10 border-red-500/20",
  extreme: "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
};

const TAGS = [
  { id: "coding", label: "Coding", color: "text-cyan-400 bg-cyan-500/10" },
  { id: "study", label: "Belajar", color: "text-indigo-400 bg-indigo-500/10" },
  { id: "fitness", label: "Kesehatan", color: "text-rose-400 bg-rose-500/10" },
  { id: "daily", label: "Harian", color: "text-slate-400 bg-slate-500/10" }
];

export default function ProQuestBoard() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showProofFlow, setShowProofFlow] = useState(false);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ verified: boolean; confidence: number; reason: string } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<Quest["difficulty"]>("medium");
  const [newType, setNewType] = useState("coding");

  useEffect(() => {
    setIsBrowser(true);
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUserId(data.user.id);
      setLoading(false);
    });
  }, []);

  const { data: quests = [], refetch: refetchQuests } = useQuery({
    queryKey: questsQueryKey(userId!),
    queryFn: () => fetchQuests(userId!),
    enabled: !!userId,
  });

  const { data: currentUser } = useQuery({
    queryKey: userQueryKey(userId!),
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: questsQueryKey(userId!) });
    queryClient.invalidateQueries({ queryKey: userQueryKey(userId!) });
  };


  const columnsMap = useMemo(() => {
    const map: Record<KanbanColumn, Quest[]> = { todo: [], in_progress: [], done: [] };
    const filtered = quests.filter((q: Quest) => {
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter ? q.difficulty === activeFilter : true;
      return matchesSearch && matchesFilter;
    });
    filtered.forEach((q: Quest) => {
      if (q.is_completed) map.done.push(q);
      else if (q.current_value > 0) map.in_progress.push(q);
      else map.todo.push(q);
    });
    return map;
  }, [quests, searchQuery, activeFilter]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const quest = quests.find((q: Quest) => q.id === draggableId);
    if (!quest) return;
    const destCol = destination.droppableId as KanbanColumn;
    const sourceCol = source.droppableId as KanbanColumn;
    if (destCol === "in_progress" && sourceCol === "todo") {
      await updateQuestStatus(quest.id, "in_progress");
      await supabase.from("quests").update({ current_value: 1 }).eq("id", quest.id);
      refetchQuests();
    } else if (destCol === "todo" && sourceCol === "in_progress") {
      await updateQuestStatus(quest.id, "todo");
      await supabase.from("quests").update({ current_value: 0 }).eq("id", quest.id);
      refetchQuests();
    } else if (destCol === "done" && sourceCol !== "done") {
      setSelectedQuest(quest);
    }
  };

  const handleCreateQuest = async () => {
    if (!newTitle.trim() || !userId) return;
    await createQuest(userId, {
      title: newTitle,
      description: newDesc,
      type: newType,
      difficulty: newDifficulty,
      xp_reward: newDifficulty === "easy" ? 50 : newDifficulty === "medium" ? 100 : 250,
      coin_reward: newDifficulty === "easy" ? 25 : newDifficulty === "medium" ? 50 : 100,
    });
    refetchQuests();
    setShowCreateModal(false);
    setNewTitle(""); setNewDesc("");
  };

  const handleDeleteQuest = async () => {
    if (!selectedQuest) return;
    if (!confirm("Konfirmasi penghapusan: Quest ini akan dihapus selamanya dari quest board. Yakin?")) return;
    
    // Optimistic delete
    await deleteQuestFn(selectedQuest.id);
    setSelectedQuest(null);
    setShowProofFlow(false);
    refetchQuests();
  };

  const handleCompleteWithoutProof = async () => {
    if (!selectedQuest || !currentUser) return;
    await completeQuestPenalty(userId!, selectedQuest, currentUser);
    invalidate();
    setSelectedQuest(null);
    setShowProofFlow(false);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result as string);
      setVerifyResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleVerifyProof = async () => {
    if (!proofImage || !selectedQuest) return;
    setIsVerifying(true);
    try {
      const res = await fetch("/api/ai/verify-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questTitle: selectedQuest.title,
          questDescription: selectedQuest.description,
          imageBase64: proofImage,
        }),
      });
      const data = await res.json();
      setVerifyResult(data);

      if (data.verified && !selectedQuest.is_completed && currentUser) {
        await completeQuestBonus(userId!, selectedQuest, currentUser);
        invalidate();
        setSelectedQuest({ ...selectedQuest, is_completed: true });
        
        setTimeout(() => {
            setShowProofFlow(false);
            setSelectedQuest(null);
            setProofImage(null);
            setVerifyResult(null);
        }, 3000);
      }
    } catch {
      setVerifyResult({ verified: false, confidence: 0, reason: "Koneksi AI Vision terputus." });
    }
    setIsVerifying(false);
  };

  if (!isBrowser || loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
        <p className="text-sm font-semibold uppercase tracking-widest">Memuat Quest Board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 w-full animate-fade-in overflow-hidden max-w-full">
      {/* ===== Toolbar Section ===== */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] shadow-sm">
        
        {/* Search & Filters */}
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 scrollbar-hide">
          <div className="relative shrink-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari quest..."
              className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-black/20 border border-white/5 text-white text-sm rounded-xl focus:border-[var(--primary)] outline-none transition-all"
            />
          </div>
          
          <div className="w-px h-6 bg-white/10 shrink-0 mx-1"></div>
          
          <div className="flex gap-2 shrink-0">
            {["all", "easy", "medium", "hard"].map((diff) => (
              <button 
                key={diff}
                onClick={() => setActiveFilter(diff === "all" ? null : (activeFilter === diff ? null : diff))}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                  (diff === "all" && !activeFilter) || activeFilter === diff 
                    ? DIFFICULTY_STYLES[diff] || "text-white bg-white/20 border-white/30"
                    : "text-slate-400 border-white/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full lg:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/20"
        >
          <Plus size={16} /> Buat Quest
        </button>
      </div>

      {/* ===== Kanban Board DND ===== */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide min-h-[60vh]">
          {COLUMNS.map((col) => {
            const questsInCol = columnsMap[col.id];
            
            return (
              <div key={col.id} className="w-full min-w-[320px] max-w-[360px] flex-shrink-0 snap-center flex flex-col h-full pl-0.5">
                {/* Column Header */}
                <div className="flex items-center gap-3 mb-4 sticky top-0 bg-[var(--bg-main)] z-10 py-2">
                  <div className={`p-2 rounded-xl ${col.bg} border ${col.border}`}>
                    <col.icon size={18} className={col.color} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">{col.label}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{questsInCol.length} Quests</p>
                  </div>
                </div>

                {/* Drop Zone */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 rounded-3xl p-3 min-h-[300px] transition-colors border-2 ${
                        snapshot.isDraggingOver ? `bg-[var(--bg-card)] ${col.border} border-dashed` : "border-transparent"
                      }`}
                    >
                      {questsInCol.map((quest, index) => {
                        const styleClass = DIFFICULTY_STYLES[quest.difficulty] || DIFFICULTY_STYLES.medium;
                        const Tag = TAGS.find(t => t.id === quest.type) || TAGS[3];

                        return (
                          <Draggable key={quest.id} draggableId={quest.id} index={index} isDragDisabled={quest.is_completed}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedQuest(quest)}
                                className={`mb-3 p-4 rounded-2xl bg-[var(--bg-card)] cursor-pointer group select-none relative overflow-hidden transition-shadow duration-200
                                  ${snapshot.isDragging ? "shadow-2xl shadow-[var(--primary)]/30 border-2 border-[var(--primary)] z-50 cursor-grabbing" 
                                                        : "border border-white/5 hover:border-white/10 shadow-sm hover:shadow-lg"}
                                  ${quest.is_completed ? "opacity-60" : ""}
                                `}
                              >
                                {/* Card Highlight Accent */}
                                <div className={`absolute top-0 bottom-0 left-0 w-1 ${snapshot.isDragging ? 'bg-[var(--primary)]' : 'bg-transparent group-hover:bg-slate-700'} transition-colors`} />

                                {/* Meta Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md border ${styleClass}`}>
                                    {quest.difficulty}
                                  </span>
                                  <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md ${Tag.color}`}>
                                    # {Tag.label}
                                  </span>
                                </div>

                                {/* Title */}
                                <h4 className="text-sm font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors leading-snug break-words pr-2">
                                  {quest.title}
                                </h4>

                                {/* Rewards Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                  <div className="flex gap-3">
                                    <div className="flex items-center gap-1.5 text-indigo-400">
                                      <Zap size={14} className="opacity-80 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                      <span className="text-xs font-bold leading-none">{quest.xp_reward}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-yellow-500">
                                      <Coins size={14} className="opacity-80 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                      <span className="text-xs font-bold leading-none">{quest.coin_reward}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Status indicator on card */}
                                  {quest.is_completed ? (
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                  ) : quest.current_value > 0 ? (
                                    <CircleDot size={16} className="text-blue-500" />
                                  ) : (
                                    <Circle size={16} className="text-slate-600" />
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* ===== Pro Quest Detail Modal ===== */}
      <AnimatePresence>
        {selectedQuest && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-12 md:pt-20 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "tween", duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
              onClick={() => { setSelectedQuest(null); setShowProofFlow(false); }} 
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="w-full max-w-2xl bg-[#11141c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col mb-auto"
            >
              {/* Cover Header */}
              <div className="h-32 bg-gradient-to-br from-indigo-900/40 to-[#11141c] border-b border-white/5 relative p-6 flex flex-col justify-end">
                <button 
                  onClick={() => { setSelectedQuest(null); setShowProofFlow(false); }} 
                  className="absolute top-4 right-4 p-2 bg-black/30 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex gap-2 relative z-10">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${DIFFICULTY_STYLES[selectedQuest.difficulty]}`}>
                    {selectedQuest.difficulty}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${TAGS.find(t=>t.id === selectedQuest.type)?.color || TAGS[3].color}`}>
                    {selectedQuest.type}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-8 overflow-y-auto scrollbar-hide flex-1 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedQuest.title}</h2>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{selectedQuest.description || "Tugas ini tidak memiliki deskripsi detail, silakan eksekusi sesegera mungkin."}</p>
                </div>

                {/* AI Suggestion/Briefing Box */}
                {!selectedQuest.is_completed && !showProofFlow && (
                    <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-start">
                        <div className="p-2.5 bg-indigo-500/20 rounded-xl">
                            <BrainCircuit size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1">Game Master Briefing</h4>
                            <p className="text-xs text-indigo-200/60 leading-relaxed">Fokus kerjakan quest ini tanpa gangguan. Jauhkan handphone, siapkan secangkir kopi, dan mulai timer. Kamu pasti bisa mendapat full rewards hari ini.</p>
                        </div>
                    </div>
                )}

                {/* Rewards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-1 items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base XP</span>
                    <span className="text-xl font-black text-indigo-400">+{selectedQuest.xp_reward}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-1 items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gold</span>
                    <span className="text-xl font-black text-yellow-500">+{selectedQuest.coin_reward}</span>
                  </div>
                   <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-1 items-center justify-center text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                      <span className="text-sm font-bold capitalize text-white">{selectedQuest.is_completed ? "Selesai" : selectedQuest.current_value > 0 ? "Diproses" : "Tugas"}</span>
                   </div>
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-1 items-center justify-center text-center">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deadline</span>
                     <span className="text-sm font-bold text-white flex items-center justify-center gap-1"><CalendarDays size={14}/> 23:59</span>
                  </div>
                </div>

                {/* ===== Proof of Action OVERRIDE FLOW ===== */}
                <AnimatePresence mode="wait">
                  {showProofFlow ? (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }} 
                        exit={{ opacity: 0, height: 0 }} 
                        className="space-y-6 pt-6 border-t border-white/5"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Camera size={20} className="text-amber-400"/> Buktikan Tindakanmu</h3>
                            <button onClick={() => setShowProofFlow(false)} className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Batal</button>
                        </div>
                        
                        {!proofImage ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Opsi 1: With Proof - Full Reward */}
                                <div className="p-5 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors relative group">
                                    <div className="absolute -top-3 left-4 px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">RECOMMENDED</div>
                                    <label className="cursor-pointer flex flex-col h-full justify-center">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2.5 bg-amber-500/20 rounded-xl shrink-0"><Upload size={20} className="text-amber-400" /></div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">Full Rewards + Bonus</h4>
                                                <p className="text-[10px] text-amber-500/80 font-semibold uppercase tracking-widest leading-tight">100% XP & Gold + 20% Bonus XP</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">Upload foto hasil kerjamu. AI Master akan memvalidasi bukti tersebut untuk memberikan hadiah maksimum.</p>
                                        <input type="file" accept="image/*" capture="environment" onChange={handleProofUpload} className="hidden" />
                                        <div className="mt-auto w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs text-center group-hover:bg-amber-500 group-hover:text-black transition-all">Pilih Foto</div>
                                    </label>
                                </div>

                                {/* Opsi 2: Skip Proof - Penalty */}
                                <div className="p-5 rounded-2xl border border-white/5 bg-black/20 hover:bg-black/40 transition-colors flex flex-col text-left group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2.5 bg-slate-800 rounded-xl shrink-0 opacity-60"><Zap size={20} className="text-slate-500" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Instant Finish</h4>
                                            <p className="text-[10px] text-red-400 font-semibold uppercase tracking-widest leading-tight">50% Penalty - Half Rewards</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors mb-4 leading-relaxed">Selesaikan quest secara instan tanpa perlu bukti. Konsekuensinya, exp dan gold yang didapat terpotong separuh.</p>
                                    <button onClick={handleCompleteWithoutProof} className="mt-auto w-full py-2.5 rounded-xl border border-white/5 text-slate-400 font-bold text-xs text-center group-hover:bg-white/10 group-hover:text-white transition-all">Selesaikan (Skip Bukti)</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fade-in">
                                <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 bg-black/40 p-2">
                                    <img src={proofImage} alt="Proof" className="w-full h-48 md:h-64 object-contain rounded-xl" />
                                    <button
                                        onClick={() => { setProofImage(null); setVerifyResult(null); }}
                                        className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/10 hover:bg-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {!verifyResult && (
                                    <button
                                        onClick={handleVerifyProof}
                                        disabled={isVerifying}
                                        className="w-full py-4 rounded-2xl bg-amber-500 text-black font-black text-sm hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
                                    >
                                        {isVerifying ? (
                                        <><Loader2 size={18} className="animate-spin" /> Menganalisa Piksel Fakta...</>
                                        ) : (
                                        <><ShieldCheck size={18} /> Validasi Bukti ke Pusat</>
                                        )}
                                    </button>
                                )}

                                {verifyResult && (
                                    <div className={`p-6 rounded-2xl border-2 ${verifyResult.verified ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            {verifyResult.verified ? <ShieldCheck size={24} className="text-emerald-400" /> : <X size={24} className="text-red-400" />}
                                            <span className={`text-lg font-black ${verifyResult.verified ? "text-emerald-400" : "text-red-400"}`}>
                                                {verifyResult.verified ? "BUKTI VALID!" : "GAGAL DIVALIDASI"}
                                            </span>
                                            <span className="text-xs font-bold text-slate-500 ml-auto bg-black/30 px-3 py-1 rounded-lg">AI Conf: {verifyResult.confidence}%</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium mb-4">{verifyResult.reason}</p>
                                        {verifyResult.verified && (
                                            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-emerald-500/30">
                                                <Zap size={14}/> Full Rewards + Bonus 20% XP Transfer
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

              </div>

              {/* Action Bar (Footer Modal) */}
              {!showProofFlow && (
                  <div className="p-4 md:p-6 border-t border-white/5 bg-[#0D1017] flex items-center justify-between gap-3 shrink-0">
                    <button 
                        onClick={handleDeleteQuest}
                        className="p-3.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-lg shadow-red-500/10"
                        title="Hapus Quest"
                    >
                        <Trash2 size={18} />
                    </button>
                    <div className="flex gap-3 w-full md:w-auto">
                    {!selectedQuest.is_completed && selectedQuest.current_value === 0 && (
                        <button 
                            onClick={async () => {
                                await updateQuestStatus(selectedQuest.id, "in_progress");
                                await supabase.from("quests").update({ current_value: 1 }).eq("id", selectedQuest.id);
                                refetchQuests();
                                setSelectedQuest(null);
                                setShowProofFlow(false);
                            }} 
                            className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <Play size={16} fill="currentColor" /> Mulai Kerjakan
                        </button>
                    )}
                    {!selectedQuest.is_completed && selectedQuest.current_value > 0 && (
                        <button 
                            onClick={() => setShowProofFlow(true)} 
                            className="w-full px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                            <CheckCircle2 size={18} /> Selesaikan Quest
                        </button>
                    )}
                    {selectedQuest.is_completed && (
                        <div className="w-full py-3.5 px-8 rounded-xl border border-white/5 bg-white/5 text-center text-sm font-bold text-emerald-400 uppercase tracking-widest">
                            QUEST TELAH DITAKLUKKAN
                        </div>
                    )}
                    </div>
                  </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== Create/Add Quest Pro Modal ===== */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={() => setShowCreateModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "tween", duration: 0.2 }}
              className="w-full max-w-lg bg-[#11141c] border border-emerald-500/20 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                   <h3 className="text-xl font-black text-white">Quest Baru</h3>
                   <p className="text-xs text-slate-500 font-medium">Buat tantangan manual untuk dirimu sendiri.</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-xl"><X size={18} /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Judul Target</label>
                  <input
                    value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Belajar Next.js Hooks hari ini"
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500 transition-all font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Detail Briefing (Opsional)</label>
                  <textarea
                    value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Catatan kecil apa yang harus diselesaikan..."
                    rows={2}
                    className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500 transition-all font-medium text-sm resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tag/Kategori</label>
                        <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500 font-medium text-sm appearance-none cursor-pointer">
                            {TAGS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tingkat Kesulitan</label>
                        <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value as any)} className="w-full bg-[#0D1017] border border-white/10 text-white rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500 font-medium text-sm appearance-none cursor-pointer capitalize">
                            <option value="easy">Easy (50 XP)</option>
                            <option value="medium">Medium (100 XP)</option>
                            <option value="hard">Hard (250 XP)</option>
                        </select>
                    </div>
                </div>
              </div>

              <button
                onClick={handleCreateQuest}
                disabled={!newTitle.trim()}
                className="w-full mt-6 py-4 rounded-xl bg-emerald-500 text-black font-black text-sm hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <Target size={18} strokeWidth={3} /> Pasang Target
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
