import { create } from 'zustand';
import { useUserStatsStore } from './userStatsStore';

export type ShopItemCategory = 'consumable' | 'cosmetic' | 'custom';

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ShopItemCategory;
    icon: string; // Lucide icon name or emoji
    color: string;
    isOwned?: boolean; // Mainly for cosmetics
}

interface ShopState {
    items: ShopItem[];
    inventory: string[]; // Array of item IDs owned by user
    buyItem: (itemId: string) => boolean; // Returns true if successful
    addCustomReward: (reward: ShopItem) => void;
}

const INITIAL_ITEMS: ShopItem[] = [
    {
        id: 's1',
        name: 'Streak Freeze',
        description: 'Protects your streak for 1 day if you miss a quest.',
        price: 200,
        category: 'consumable',
        icon: 'Snowflake',
        color: '#3B82F6' // Blue
    },
    {
        id: 's2',
        name: 'Health Potion',
        description: 'Instantly restores 20 HP.',
        price: 150,
        category: 'consumable',
        icon: 'FlaskConical',
        color: '#EF4444' // Red
    },
    {
        id: 's3',
        name: 'Double XP Boost',
        description: 'Double XP gained from quests for 24 hours.',
        price: 300,
        category: 'consumable',
        icon: 'Zap',
        color: '#EAB308' // Yellow
    },
    {
        id: 's4',
        name: 'Dark Knight Avatar',
        description: 'Unlock this exclusive cosmetic profile picture.',
        price: 1000,
        category: 'cosmetic',
        icon: 'Shield',
        color: '#6B7280' // Gray
    },
    {
        id: 's5',
        name: 'Neon Profile Glow',
        description: 'Add a cool neon glow effect to your profile card.',
        price: 1500,
        category: 'cosmetic',
        icon: 'Sparkles',
        color: '#8B5CF6' // Purple
    },
    {
        id: 's6',
        name: 'Royal Cape',
        description: 'A majestic crimson cape for legendary adventurers.',
        price: 800,
        category: 'cosmetic',
        icon: 'Shirt',
        color: '#B91C1C' // Dark Red
    },
    {
        id: 's7',
        name: 'Wizard Hat',
        description: 'Increase your perceived intelligence by 100%.',
        price: 600,
        category: 'cosmetic',
        icon: 'Hat',
        color: '#1D4ED8' // Dark Blue
    },
    {
        id: 's8',
        name: 'Cyberpunk Visor',
        description: 'High-tech eyewear for the modern quest slayer.',
        price: 1200,
        category: 'cosmetic',
        icon: 'Eye',
        color: '#06B6D4' // Cyan
    },
    // Custom rewards
    {
        id: 'c1',
        name: 'Watch 1 Episode of Anime',
        description: 'Guilt-free entertainment time.',
        price: 100,
        category: 'custom',
        icon: 'Tv',
        color: '#EC4899' // Pink
    },
    {
        id: 'c2',
        name: 'Cheat Meal',
        description: 'Treat yourself to your favorite junk food.',
        price: 500,
        category: 'custom',
        icon: 'Pizza',
        color: '#F97316' // Orange
    }
];

export const useShopStore = create<ShopState>((set, get) => ({
    items: INITIAL_ITEMS,
    inventory: [],
    
    buyItem: (itemId) => {
        const item = get().items.find(i => i.id === itemId);
        if (!item) return false;

        const statsStore = useUserStatsStore.getState();
        if (statsStore.coins >= item.price) {
            
            // Check if cosmetic is already owned
            if (item.category === 'cosmetic' && get().inventory.includes(itemId)) {
                return false; // Cannot buy twice
            }

            // Deduct coins
            statsStore.subtractCoins(item.price);
            
            // Add to inventory
            set((state) => ({
                inventory: [...state.inventory, itemId],
                // If it's cosmetic, mark it as owned in the items list for easy UI rendering
                items: state.items.map(i => i.id === itemId && i.category === 'cosmetic' ? { ...i, isOwned: true } : i)
            }));
            
            return true;
        }
        return false;
    },

    addCustomReward: (reward) => set((state) => ({ items: [...state.items, reward] }))
}));
