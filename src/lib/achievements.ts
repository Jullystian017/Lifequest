export type AchievementCategory = 'quest' | 'streak' | 'combat' | 'social' | 'special';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    category: AchievementCategory;
    icon: string;
    color: string;
    requirementType: 'complete_quests' | 'reach_streak' | 'defeat_enemies' | 'reach_level';
    requirementValue: number;
    xpReward: number;
}

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'ach_1',
        title: 'Mulai Petualangan',
        description: 'Selesaikan quest pertamamu.',
        category: 'quest',
        icon: 'Flag',
        color: 'bg-emerald-500/20 text-emerald-500',
        requirementType: 'complete_quests',
        requirementValue: 1,
        xpReward: 50
    },
    {
        id: 'ach_2',
        title: 'Pejuang Gigih',
        description: 'Selesaikan 10 quest.',
        category: 'quest',
        icon: 'Zap',
        color: 'bg-amber-500/20 text-amber-500',
        requirementType: 'complete_quests',
        requirementValue: 10,
        xpReward: 200
    },
    {
        id: 'ach_3',
        title: 'Legenda Hidup',
        description: 'Capai level 10.',
        category: 'special',
        icon: 'Star',
        color: 'bg-purple-500/20 text-purple-500',
        requirementType: 'reach_level',
        requirementValue: 10,
        xpReward: 500
    },
    {
        id: 'ach_4',
        title: 'Pemburu Shadow',
        description: 'Kalahkan 5 musuh shadow.',
        category: 'combat',
        icon: 'Swords',
        color: 'bg-red-500/20 text-red-500',
        requirementType: 'defeat_enemies',
        requirementValue: 5,
        xpReward: 300
    }
];
