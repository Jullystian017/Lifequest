import { create } from 'zustand';

export interface SkillNode {
    id: string;
    branch: SkillBranch;
    name: string;
    description: string;
    level: number;       // current unlock level (0=locked)
    maxLevel: number;
    xpCost: number;      // XP to unlock/upgrade
    icon: string;        // lucide icon name
    requires?: string;   // id of prerequisite node
}

export type SkillBranch = "focus" | "discipline" | "creativity" | "health";

interface SkillTreeState {
    skills: SkillNode[];
    setSkills: (skills: SkillNode[]) => void;
    upgradeSkill: (id: string) => void;
}

const DEFAULT_SKILLS: SkillNode[] = [
    // Focus branch
    { id: "f1", branch: "focus", name: "Konsentrasi", description: "Tingkatkan waktu fokus harianmu", level: 0, maxLevel: 5, xpCost: 50, icon: "Eye" },
    { id: "f2", branch: "focus", name: "Deep Work", description: "Kunci sesi kerja mendalam tanpa gangguan", level: 0, maxLevel: 3, xpCost: 100, icon: "Brain", requires: "f1" },
    { id: "f3", branch: "focus", name: "Flow State", description: "Masuk ke kondisi flow lebih cepat", level: 0, maxLevel: 3, xpCost: 200, icon: "Zap", requires: "f2" },
    // Discipline branch
    { id: "d1", branch: "discipline", name: "Rutinitas Pagi", description: "Bangun kebiasaan pagi yang konsisten", level: 0, maxLevel: 5, xpCost: 50, icon: "Sunrise" },
    { id: "d2", branch: "discipline", name: "Manajemen Waktu", description: "Atur jadwal harian dengan efektif", level: 0, maxLevel: 3, xpCost: 100, icon: "Clock", requires: "d1" },
    { id: "d3", branch: "discipline", name: "Iron Will", description: "Disiplin baja yang tak tergoyahkan", level: 0, maxLevel: 3, xpCost: 200, icon: "Shield", requires: "d2" },
    // Creativity branch
    { id: "c1", branch: "creativity", name: "Brainstorming", description: "Hasilkan ide-ide baru dengan cepat", level: 0, maxLevel: 5, xpCost: 50, icon: "Lightbulb" },
    { id: "c2", branch: "creativity", name: "Problem Solving", description: "Pecahkan masalah dari sudut pandang baru", level: 0, maxLevel: 3, xpCost: 100, icon: "Puzzle", requires: "c1" },
    { id: "c3", branch: "creativity", name: "Inovator", description: "Ciptakan solusi yang belum pernah ada", level: 0, maxLevel: 3, xpCost: 200, icon: "Rocket", requires: "c2" },
    // Health branch
    { id: "h1", branch: "health", name: "Olahraga Rutin", description: "Bangun kebiasaan olahraga harian", level: 0, maxLevel: 5, xpCost: 50, icon: "Dumbbell" },
    { id: "h2", branch: "health", name: "Nutrisi Sehat", description: "Perbaiki pola makan dan nutrisimu", level: 0, maxLevel: 3, xpCost: 100, icon: "Apple", requires: "h1" },
    { id: "h3", branch: "health", name: "Regenerasi", description: "Pemulihan tubuh dan tidur berkualitas", level: 0, maxLevel: 3, xpCost: 200, icon: "Heart", requires: "h2" },
];

export const useSkillTreeStore = create<SkillTreeState>((set) => ({
    skills: DEFAULT_SKILLS,
    setSkills: (skills) => set({ skills }),
    upgradeSkill: (id) =>
        set((state) => ({
            skills: state.skills.map((s) =>
                s.id === id && s.level < s.maxLevel
                    ? { ...s, level: s.level + 1 }
                    : s
            ),
        })),
}));
