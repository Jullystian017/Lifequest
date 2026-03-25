export type NoteType = "note" | "til" | "standup" | "wiki";

export interface Note {
    id: string;
    user_id: string;
    title: string;
    content: string;
    summary?: string;
    type: NoteType;
    tags?: string[];
    is_pinned: boolean;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}
