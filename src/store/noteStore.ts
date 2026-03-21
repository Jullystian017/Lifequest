import { create } from 'zustand';

export interface Note {
    id: string;
    user_id: string;
    title: string;
    content: string;
    folder: string;
    tags: string[];
    linked_quest_id?: string;
    created_at: string;
    updated_at: string;
}

interface NoteState {
    notes: Note[];
    activeNoteId: string | null;
    setNotes: (notes: Note[]) => void;
    addNote: (note: Note) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    setActiveNote: (id: string | null) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
    notes: [],
    activeNoteId: null,
    setNotes: (notes) => set({ notes }),
    addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
    updateNote: (id, updates) =>
        set((state) => ({
            notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        })),
    deleteNote: (id) =>
        set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
            activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        })),
    setActiveNote: (id) => set({ activeNoteId: id }),
}));
