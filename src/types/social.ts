export type ActivityType = 'quest_complete' | 'level_up' | 'streak_milestone' | 'badge_earned' | 'stat_increase';

export interface SocialActivity {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    type: ActivityType;
    content: string;
    timestamp: string;
    likes: number;
    hasLiked: boolean;
}

export interface Guild {
    id: string;
    name: string;
    description: string;
    icon: string;
    memberCount: number;
    level: number;
    xp: number;
    nextLevelXp: number;
    category: 'Productivity' | 'Health' | 'Knowledge' | 'Creativity';
}

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    userName: string;
    userAvatar?: string;
    userClass: string;
    xp: number;
    isUser: boolean;
}

export interface FriendStreak {
    userId: string;
    userName: string;
    userAvatar?: string;
    currentStreak: number;
    isOnline: boolean;
    lastActivity: string;
}
