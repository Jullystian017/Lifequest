export type ShopItemCategory = 'consumable' | 'cosmetic' | 'custom';
export type EquipmentSlot = 'head' | 'body' | 'outerwear' | 'accessory' | 'none';

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ShopItemCategory;
    icon: string;
    color: string;
    isOwned?: boolean;
    slot?: EquipmentSlot;
    svgPart?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
    {
        id: 's1',
        name: 'Streak Freeze',
        description: 'Protects your streak for 1 day if you miss a quest.',
        price: 200,
        category: 'consumable',
        icon: 'Snowflake',
        color: '#3B82F6'
    },
    {
        id: 's2',
        name: 'Health Potion',
        description: 'Instantly restores 20 HP.',
        price: 150,
        category: 'consumable',
        icon: 'FlaskConical',
        color: '#EF4444'
    },
    {
        id: 's3',
        name: 'Double XP Boost',
        description: 'Double XP gained from quests for 24 hours.',
        price: 300,
        category: 'consumable',
        icon: 'Zap',
        color: '#EAB308'
    },
    {
        id: 's4',
        name: 'Dark Knight Armor',
        description: 'Heavy plated armor for those who seek discipline.',
        price: 1000,
        category: 'cosmetic',
        icon: 'Shield',
        color: '#4B5563',
        slot: 'outerwear',
        svgPart: 'dark_knight'
    },
    {
        id: 's5',
        name: 'Basic T-Shirt',
        description: 'A comfortable white tee. Every hero starts somewhere.',
        price: 100,
        category: 'cosmetic',
        icon: 'Shirt',
        color: '#FFFFFF',
        slot: 'body',
        svgPart: 'tshirt'
    },
    {
        id: 's6',
        name: 'Royal Cape',
        description: 'A majestic crimson cape for legendary adventurers.',
        price: 800,
        category: 'cosmetic',
        icon: 'Shirt',
        color: '#B91C1C',
        slot: 'accessory',
        svgPart: 'royal_cape'
    },
    {
        id: 's7',
        name: 'Wizard Hat',
        description: 'Increase your perceived intelligence by 100%.',
        price: 600,
        category: 'cosmetic',
        icon: 'Hat',
        color: '#1D4ED8',
        slot: 'head',
        svgPart: 'wizard_hat'
    },
    {
        id: 's8',
        name: 'Cyberpunk Visor',
        description: 'High-tech eyewear for the modern quest slayer.',
        price: 1200,
        category: 'cosmetic',
        icon: 'Eye',
        color: '#06B6D4',
        slot: 'head',
        svgPart: 'visor'
    },
    {
        id: 's9',
        name: 'Leather Jacket',
        description: 'Tough and stylish. Ready for any adventure.',
        price: 500,
        category: 'cosmetic',
        icon: 'Wind',
        color: '#78350F',
        slot: 'outerwear',
        svgPart: 'leather_jacket'
    },
    {
        id: 'c1',
        name: 'Watch 1 Episode of Anime',
        description: 'Guilt-free entertainment time.',
        price: 100,
        category: 'custom',
        icon: 'Tv',
        color: '#EC4899'
    },
    {
        id: 'c2',
        name: 'Cheat Meal',
        description: 'Treat yourself to your favorite junk food.',
        price: 500,
        category: 'custom',
        icon: 'Pizza',
        color: '#F97316'
    }
];
