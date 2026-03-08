import { create } from 'zustand';
import { useTeamStore, TeamRole } from './teamStore';

export type WorkspaceType = 'personal' | 'team';
export type ActiveRole = TeamRole | 'personal';

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
    activeRole: ActiveRole;
    
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

    get activeRole() {
        const workspaceId = get().activeWorkspaceId;
        const workspace = get().workspaces.find(w => w.id === workspaceId);
        
        if (!workspace || workspace.type === 'personal') return 'personal';

        // Mock current user ID for demonstration (Alex Miller)
        const currentUserId = 'u-1'; 
        
        const teamStore = useTeamStore.getState();
        const team = teamStore.teams.find(t => t.id === workspaceId);
        const member = team?.members.find(m => m.userId === currentUserId);
        
        return member?.role || 'member'; // Default to member if not found
    },

    setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
    
    addWorkspace: (workspace) => set((state) => ({ 
        workspaces: [...state.workspaces, workspace] 
    }))
}));
