"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useNoteStore, Note } from "@/store/noteStore";
import {
  Plus,
  Search,
  Folder,
  Tag,
  FileText,
  Trash2,
  X,
  Loader2,
  Save,
  Hash,
  FolderOpen,
  StickyNote,
} from "lucide-react";

const FOLDER_OPTIONS = ["Umum", "Ide", "Belajar", "Proyek", "Pribadi"];
const TAG_COLORS: Record<string, string> = {
  penting: "text-red-400 bg-red-500/10",
  ide: "text-yellow-400 bg-yellow-500/10",
  referensi: "text-blue-400 bg-blue-500/10",
  quest: "text-indigo-400 bg-indigo-500/10",
  catatan: "text-emerald-400 bg-emerald-500/10",
};

export default function NotesPage() {
  const { notes, setNotes, addNote, updateNote, deleteNote, activeNoteId, setActiveNote } = useNoteStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("notes").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
      if (data) setNotes(data);
      setLoading(false);
    }
    load();
  }, [setNotes]);

  const filteredNotes = useMemo(() => {
    let result = notes;
    if (activeFolder) result = result.filter(n => n.folder === activeFolder);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    return result;
  }, [notes, activeFolder, searchQuery]);

  const handleCreate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const newNote: any = {
      user_id: user.id,
      title: "Catatan Baru",
      content: "",
      folder: activeFolder || "Umum",
      tags: [],
    };
    const { data, error } = await supabase.from("notes").insert(newNote).select().single();
    if (data && !error) {
      addNote(data);
      setActiveNote(data.id);
    }
  };

  const handleSave = async () => {
    if (!activeNote) return;
    setSaving(true);
    await supabase.from("notes").update({
      title: activeNote.title,
      content: activeNote.content,
      folder: activeNote.folder,
      tags: activeNote.tags,
      updated_at: new Date().toISOString(),
    }).eq("id", activeNote.id);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    deleteNote(id);
    await supabase.from("notes").delete().eq("id", id);
  };

  const handleAddTag = () => {
    if (!activeNote || !newTag.trim()) return;
    const tags = [...(activeNote.tags || []), newTag.trim().toLowerCase()];
    updateNote(activeNote.id, { tags });
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    if (!activeNote) return;
    updateNote(activeNote.id, { tags: activeNote.tags.filter(t => t !== tag) });
  };

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(n => { counts[n.folder] = (counts[n.folder] || 0) + 1; });
    return counts;
  }, [notes]);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
        <p className="text-sm font-semibold uppercase tracking-widest">Memuat Catatan...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)] pb-4">
      {/* Left Panel: Folders + Note List */}
      <div className="w-80 shrink-0 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari catatan..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border-light)] text-white rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[var(--primary)] transition-all placeholder:text-slate-600 text-sm"
          />
        </div>

        {/* Folders */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)]">
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Folder</h4>
          <div className="space-y-1">
            <button
              onClick={() => setActiveFolder(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${!activeFolder ? "bg-[var(--primary)] text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              <span className="flex items-center gap-2"><FolderOpen size={14} /> Semua</span>
              <span className="text-[10px]">{notes.length}</span>
            </button>
            {FOLDER_OPTIONS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFolder(f)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeFolder === f ? "bg-[var(--primary)] text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
              >
                <span className="flex items-center gap-2"><Folder size={14} /> {f}</span>
                <span className="text-[10px]">{folderCounts[f] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
          <button onClick={handleCreate} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/10 text-slate-400 hover:text-white hover:border-[var(--primary)]/30 transition-all text-sm font-semibold">
            <Plus size={14} /> Catatan Baru
          </button>
          {filteredNotes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNote(note.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${activeNoteId === note.id ? "bg-[var(--primary)]/10 border border-[var(--primary)]/30" : "bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-white/10"}`}
            >
              <p className="text-sm font-semibold text-white truncate">{note.title || "Tanpa Judul"}</p>
              <p className="text-[10px] text-slate-500 mt-1 truncate">{note.content?.slice(0, 60) || "Kosong..."}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] text-slate-600 font-semibold">{note.folder}</span>
                {note.tags?.slice(0, 2).map(t => (
                  <span key={t} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${TAG_COLORS[t] || "text-slate-400 bg-slate-500/10"}`}>{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Editor */}
      <div className="flex-1 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] flex flex-col overflow-hidden">
        {!activeNote ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
              <StickyNote size={40} className="text-indigo-500/40" />
            </div>
            <p className="text-sm font-semibold text-slate-400">Pilih catatan atau buat yang baru</p>
            <p className="text-xs text-slate-500">Tulis ide, rencana, atau catatan belajarmu di sini</p>
          </div>
        ) : (
          <>
            {/* Editor Header */}
            <div className="p-5 border-b border-[var(--border-light)] flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <input
                  value={activeNote.title}
                  onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                  className="w-full bg-transparent text-xl font-semibold text-white outline-none placeholder:text-slate-600"
                  placeholder="Judul catatan..."
                />
                <div className="flex items-center gap-3 mt-2">
                  <select
                    value={activeNote.folder}
                    onChange={(e) => updateNote(activeNote.id, { folder: e.target.value })}
                    className="text-[10px] font-semibold bg-[var(--bg-sidebar)] border border-[var(--border-light)] text-slate-400 rounded-lg px-2 py-1 outline-none"
                  >
                    {FOLDER_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <div className="flex items-center gap-1 flex-wrap">
                    {activeNote.tags?.map(t => (
                      <span key={t} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${TAG_COLORS[t] || "text-slate-400 bg-slate-500/10"}`}>
                        {t}
                        <button onClick={() => handleRemoveTag(t)} className="hover:text-white"><X size={8} /></button>
                      </span>
                    ))}
                    <div className="flex items-center">
                      <input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                        placeholder="+ tag"
                        className="text-[10px] bg-transparent text-slate-500 outline-none w-14 placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-semibold text-xs hover:opacity-90 transition-all">
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Simpan
                </button>
                <button onClick={() => handleDelete(activeNote.id)} className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Markdown Editor */}
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              placeholder="Tuliskan catatanmu di sini... (mendukung Markdown)"
              className="flex-1 p-6 bg-transparent text-slate-200 text-sm leading-relaxed outline-none resize-none scrollbar-hide placeholder:text-slate-700 font-mono"
            />
          </>
        )}
      </div>
    </div>
  );
}
