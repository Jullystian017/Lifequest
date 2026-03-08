import { create } from 'zustand';
import { Boss, BossTask } from '@/types/boss';

interface BossStore {
    bosses: Boss[];
    
    // Actions
    dealDamage: (bossId: string, taskId: string) => void;
    addBoss: (boss: Boss) => void;
}

const MOCK_BOSSES: Boss[] = [
    // Personal Boss
    {
        id: 'boss-1',
        workspaceId: 'personal-1',
        name: 'The Portfolio Behemoth',
        description: 'Your archaic personal website needs a complete overhaul to attract top-tier guild recruiters (employers). Defeat this behemoth by redesigning and launching the new iteration.',
        avatar_url: '🐉',
        max_hp: 1000,
        current_hp: 1000,
        difficulty: 'epic',
        status: 'active',
        deadline: '2026-04-15T00:00:00Z',
        created_at: new Date().toISOString(),
        tasks: [
            { id: 't-1', title: 'Design Figma Wireframes', is_completed: false, damage: 200 },
            { id: 't-2', title: 'Setup Next.js Repository', is_completed: false, damage: 100 },
            { id: 't-3', title: 'Implement Three.js Hero Canvas', is_completed: false, damage: 300 },
            { id: 't-4', title: 'Write Case Studies', is_completed: false, damage: 250 },
            { id: 't-5', title: 'Deploy to Vercel & Map Domain', is_completed: false, damage: 150 },
        ],
        rewards: {
            xp: 5000,
            coins: 500,
            badge: 'Master Architect',
        }
    },
    // Team Boss
    {
        id: 'boss-2',
        workspaceId: 'team-1',
        name: 'Product Launch Leviathan',
        description: 'The v1.0 release is looming. The squad must unite to eliminate critical bugs and finalize the marketing copy before judgment day.',
        avatar_url: '🦑',
        max_hp: 5000,
        current_hp: 3100, // Partially defeated
        difficulty: 'hard',
        status: 'active',
        deadline: '2026-03-20T00:00:00Z',
        created_at: new Date().toISOString(),
        tasks: [
            { id: 't-1', title: 'Fix Database Concurrency Issue', is_completed: true, damage: 1000 },
            { id: 't-2', title: 'Write Product Hunt Launch Copy', is_completed: true, damage: 500 },
            { id: 't-3', title: 'Finalize Pricing Page Stripe Integration', is_completed: false, damage: 1500 },
            { id: 't-4', title: 'Record Demo Video', is_completed: false, damage: 800 },
            { id: 't-5', title: 'QA Testing Phase 2', is_completed: true, damage: 400 },
            { id: 't-6', title: 'Send Newsletter Teaser', is_completed: false, damage: 800 },
        ],
        rewards: {
            xp: 15000,
            coins: 2000,
            item: 'Team Momentum Banner',
        }
    },
    // Defeated Personal Boss
    {
        id: 'boss-3',
        workspaceId: 'personal-1',
        name: 'The Certification Specter',
        description: 'AWS Certified Solutions Architect Associate Exam.',
        avatar_url: '👻',
        max_hp: 800,
        current_hp: 0,
        difficulty: 'hard',
        status: 'defeated',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
            { id: 't-1', title: 'Pass Practice Exam 1', is_completed: true, damage: 200 },
            { id: 't-2', title: 'Pass Practice Exam 2', is_completed: true, damage: 200 },
            { id: 't-3', title: 'Pass Practice Exam 3', is_completed: true, damage: 200 },
            { id: 't-4', title: 'Take Final Exam', is_completed: true, damage: 200 },
        ],
        rewards: {
            xp: 3000,
            coins: 300,
            badge: 'Cloud Walker',
        }
    }
];

export const useBossStore = create<BossStore>((set) => ({
    bosses: MOCK_BOSSES,
    
    dealDamage: (bossId, taskId) => set((state) => ({
        bosses: state.bosses.map(boss => {
            if (boss.id !== bossId) return boss;
            
            const task = boss.tasks.find(t => t.id === taskId);
            if (!task || task.is_completed) return boss; // Can't deal damage twice

            // Calculate new HP
            const newHp = Math.max(0, boss.current_hp - task.damage);
            const isDefeated = newHp === 0;

            return {
                ...boss,
                current_hp: newHp,
                status: isDefeated ? 'defeated' : boss.status,
                tasks: boss.tasks.map(t => 
                    t.id === taskId ? { ...t, is_completed: true } : t
                )
            };
        })
    })),

    addBoss: (boss) => set((state) => ({
        bosses: [...state.bosses, boss]
    }))
}));
