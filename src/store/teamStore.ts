import { create } from 'zustand';

export type TeamRole = 'owner' | 'leader' | 'member';

export interface TeamMember {
    userId: string;
    name: string;
    avatar_url: string;
    role: TeamRole;
    joined_at: string;
}

export interface Team {
    id: string; // Maps 1:1 with Workspace ID (e.g., 'team-1')
    name: string;
    description: string;
    members: TeamMember[];
    current_streak: number;
    longest_streak: number;
    created_at: string;
}

interface TeamStore {
    teams: Team[];
    
    // Actions
    createTeam: (team: Team) => void;
    deleteTeam: (teamId: string) => void;
    addMember: (teamId: string, member: TeamMember) => void;
    removeMember: (teamId: string, userId: string) => void;
    changeRole: (teamId: string, userId: string, newRole: TeamRole) => void;
    incrementStreak: (teamId: string) => void;
    resetStreak: (teamId: string) => void;
}

// Ensure the ID maps to the hardcoded workspaces in workspaceStore.ts for mock purposes
const MOCK_TEAMS: Team[] = [
    {
        id: 'team-1', 
        name: 'Deep Work Squad',
        description: 'Startup productivity team',
        current_streak: 8,
        longest_streak: 15,
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        members: [
            { userId: 'u-1', name: 'Alex Miller', avatar_url: '🧔', role: 'owner', joined_at: new Date().toISOString() },
            { userId: 'u-2', name: 'Sarah Chen', avatar_url: '👩‍💻', role: 'leader', joined_at: new Date().toISOString() },
            { userId: 'u-3', name: 'Daniel Park', avatar_url: '🧑‍🚀', role: 'member', joined_at: new Date().toISOString() },
            { userId: 'u-4', name: 'Elena Rostova', avatar_url: '🧝‍♀️', role: 'member', joined_at: new Date().toISOString() },
        ]
    },
    {
        id: 'team-2',
        name: 'Startup Team',
        description: 'Venture backed madness',
        current_streak: 2,
        longest_streak: 5,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        members: [
            { userId: 'u-1', name: 'Alex Miller', avatar_url: '🧔', role: 'leader', joined_at: new Date().toISOString() },
            { userId: 'u-5', name: 'Zack', avatar_url: '👨‍🎤', role: 'owner', joined_at: new Date().toISOString() },
        ]
    }
];

export const useTeamStore = create<TeamStore>((set) => ({
    teams: MOCK_TEAMS,

    createTeam: (team) => set((state) => ({ 
        teams: [...state.teams, team] 
    })),

    deleteTeam: (teamId) => set((state) => ({
        teams: state.teams.filter(t => t.id !== teamId)
    })),

    addMember: (teamId, member) => set((state) => ({
        teams: state.teams.map(t => 
            t.id === teamId ? { ...t, members: [...t.members, member] } : t
        )
    })),

    removeMember: (teamId, userId) => set((state) => ({
        teams: state.teams.map(t => 
            t.id === teamId ? { ...t, members: t.members.filter(m => m.userId !== userId) } : t
        )
    })),

    changeRole: (teamId, userId, newRole) => set((state) => ({
        teams: state.teams.map(t => 
            t.id === teamId ? { 
                ...t, 
                members: t.members.map(m => m.userId === userId ? { ...m, role: newRole } : m) 
            } : t
        )
    })),

    incrementStreak: (teamId) => set((state) => ({
        teams: state.teams.map(t => {
            if (t.id !== teamId) return t;
            const newStreak = t.current_streak + 1;
            return {
                ...t,
                current_streak: newStreak,
                longest_streak: Math.max(t.longest_streak, newStreak)
            };
        })
    })),

    resetStreak: (teamId) => set((state) => ({
        teams: state.teams.map(t => 
            t.id === teamId ? { ...t, current_streak: 0 } : t
        )
    }))
}));
