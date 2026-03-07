import { create } from 'zustand';
import { SocialActivity, Guild, LeaderboardEntry, FriendStreak } from '@/types/social';

interface SocialState {
    activities: SocialActivity[];
    guilds: Guild[];
    leaderboard: LeaderboardEntry[];
    friendStreaks: FriendStreak[];

    // Actions
    addActivity: (activity: SocialActivity) => void;
    likeActivity: (id: string) => void;
    joinGuild: (guildId: string) => void;
}

export const useSocialStore = create<SocialState>((set) => ({
    activities: [
        {
            id: '1',
            userId: 'u1',
            userName: 'Kevin W.',
            type: 'quest_complete',
            content: 'completed the "Master React Hooks" quest! ⚔️',
            timestamp: '2 HOURS AGO',
            likes: 12,
            hasLiked: false
        },
        {
            id: '2',
            userId: 'u2',
            userName: 'Sarah M.',
            type: 'level_up',
            content: 'reached Level 15 and unlocked the "Explorer" badge! ✨',
            timestamp: '5 HOURS AGO',
            likes: 24,
            hasLiked: true
        },
        {
            id: '3',
            userId: 'u3',
            userName: 'David L.',
            type: 'streak_milestone',
            content: 'hit a 30-day "Morning Workout" streak! 🔥',
            timestamp: 'YESTERDAY',
            likes: 45,
            hasLiked: false
        }
    ],
    guilds: [
        {
            id: 'g1',
            name: 'Code Ninjas',
            description: 'A place for developers to master their craft.',
            icon: '💻',
            memberCount: 124,
            level: 12,
            xp: 4500,
            nextLevelXp: 5000,
            category: 'Knowledge'
        },
        {
            id: 'g2',
            name: 'Zen Masters',
            description: 'Focus and meditation for daily growth.',
            icon: '🧘',
            memberCount: 89,
            level: 8,
            xp: 2100,
            nextLevelXp: 3000,
            category: 'Health'
        }
    ],
    leaderboard: [
        { rank: 1, userId: 'u10', userName: 'DragonSlayer', userClass: 'Warrior', xp: 45200, isUser: false },
        { rank: 2, userId: 'u11', userName: 'CodeWizard', userClass: 'Mage', xp: 42100, isUser: false },
        { rank: 3, userId: 'u12', userName: 'FitHero', userClass: 'Paladin', xp: 39800, isUser: false },
        { rank: 12, userId: 'user_1', userName: 'You', userClass: 'Adventurer', xp: 12400, isUser: true }
    ],
    friendStreaks: [
        { userId: 'u1', userName: 'Kevin W.', currentStreak: 24, isOnline: true, lastActivity: 'Coding' },
        { userId: 'u2', userName: 'Sarah M.', currentStreak: 15, isOnline: false, lastActivity: 'Reading' },
        { userId: 'u3', userName: 'David L.', currentStreak: 30, isOnline: true, lastActivity: 'Gym' },
        { userId: 'u4', userName: 'Emily R.', currentStreak: 7, isOnline: true, lastActivity: 'Designing' }
    ],

    addActivity: (activity) => set((state) => ({
        activities: [activity, ...state.activities]
    })),

    likeActivity: (id) => set((state) => ({
        activities: state.activities.map(a =>
            a.id === id ? { ...a, likes: a.hasLiked ? a.likes - 1 : a.likes + 1, hasLiked: !a.hasLiked } : a
        )
    })),

    joinGuild: (guildId) => set((state) => ({
        guilds: state.guilds.map(g =>
            g.id === guildId ? { ...g, memberCount: g.memberCount + 1 } : g
        )
    }))
}));
