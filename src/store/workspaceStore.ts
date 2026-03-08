import { create } from 'zustand';

export type WorkspaceType = 'personal' | 'team';

export interface Workspace {
    id: string;
    name: string;
    type: WorkspaceType;
    icon?: string;
    memberCount?: number;
}

interface WorkspaceState {
    activeWorkspaceId: string;
    workspaces: Workspace[];
    
    // Derived
    activeWorkspace: Workspace | undefined;
    
    // Actions
    setActiveWorkspace: (id: string) => void;
    addWorkspace: (workspace: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    activeWorkspaceId: 'personal-1', // Default
    workspaces: [
        {
            id: 'personal-1',
            name: 'Personal Space',
            type: 'personal',
            icon: '👤'
        },
        {
            id: 'team-1',
            name: 'Deep Work Squad',
            type: 'team',
            icon: '⚡',
            memberCount: 4
        },
        {
            id: 'team-2',
            name: 'Startup Team',
            type: 'team',
            icon: '🚀',
            memberCount: 12
        }
    ],

    get activeWorkspace() {
        return get().workspaces.find(w => w.id === get().activeWorkspaceId);
    },

    setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
    
    addWorkspace: (workspace) => set((state) => ({ 
        workspaces: [...state.workspaces, workspace] 
    }))
}));
