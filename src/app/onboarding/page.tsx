"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStatsStore } from "@/store/userStatsStore";
import {
    BrainCircuit,
    Swords,
    Target,
    ChevronRight,
    Star,
    CheckCircle2
} from "lucide-react";

const ONBOARDING_STEPS = [
    {
        id: "intro",
        title: "Selamat Datang di LifeQuest",
        subtitle: "Ubah hidupmu menjadi RPG épik.",
        icon: Star,
        content: "Setiap tugas yang kamu selesaikan di dunia nyata akan memberimu Experience Points (XP) dan Gold. Naikkan level karaktermu, bangun kebiasaan baik, dan kalahkan monster kemalasan."
    },
    {
        id: "class",
        title: "Pilih Fokus Utamamu",
        subtitle: "Apa tujuan terbesarmu saat ini?",
        icon: Target,
        options: [
            { id: "career", label: "Karir & Pendidikan", desc: "Meningkatkan skill dan nilai." },
            { id: "health", label: "Kesehatan Fisik", desc: "Membangun tubuh yang bugar." },
            { id: "creativity", label: "Kreativitas", desc: "Membangun karya dan portofolio." },
            { id: "balance", label: "Keseimbangan", desc: "Memperbaiki rutinitas harian." }
        ]
    },
    {
        id: "ai",
        title: "AI Assistant Pribadimu",
        subtitle: "Pilih pendamping perjalananmu.",
        icon: BrainCircuit,
        options: [
            { id: "mentor", label: "Mentor Bijak", desc: "Fokus pada pertumbuhan stabil." },
            { id: "drill_sergeant", label: "Komandan Keras", desc: "Disiplin militer tanpa ampun." },
            { id: "cheerleader", label: "Penyemangat", desc: "Selalu optimis merayakan progres." }
        ]
    },
    {
        id: "ready",
        title: "Karakter Dibuat!",
        subtitle: "Petualanganmu dimulai sekarang.",
        icon: Swords,
        content: "Selesaikan Daily Quests pertamamu di Dashboard untuk mendapatkan bonus XP awal. Semoga berhasil, Petualang!"
    }
];

export default function OnboardingPage() {
    const router = useRouter();
    const { username } = useUserStatsStore();
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState<Record<string, string>>({});

    const currentStep = ONBOARDING_STEPS[step];
    const Icon = currentStep.icon;

    const handleNext = () => {
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(prev => prev + 1);
        } else {
            // Finish onboarding
            router.push("/dashboard");
        }
    };

    const handleSelect = (optionId: string) => {
        setSelections({ ...selections, [currentStep.id]: optionId });
    };

    const canProceed = () => {
        if (currentStep.options) return !!selections[currentStep.id];
        return true;
    };

    return (
        <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--secondary)] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
            
            <div className="w-full max-w-2xl z-10">
                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-12">
                    {ONBOARDING_STEPS.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-12 bg-[var(--primary)]' : i < step ? 'w-6 bg-white/40' : 'w-2 bg-white/10'}`} 
                        />
                    ))}
                </div>

                {/* Main Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="bg-black/30 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-0.5 rounded-3xl mb-8 rotate-3 hover:rotate-6 transition-transform">
                                <div className="w-full h-full bg-[var(--bg-card)] rounded-[22px] flex items-center justify-center">
                                    <Icon size={32} className="text-white" />
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-heading)] mb-2">
                                {currentStep.id === "intro" ? `Hello, ${username || 'Adventurer'}!` : currentStep.title}
                            </h1>
                            <p className="text-slate-400 mb-8 max-w-sm">
                                {currentStep.subtitle}
                            </p>

                            {/* Content text */}
                            {currentStep.content && (
                                <p className="text-slate-300 leading-relaxed mb-8 max-w-lg">
                                    {currentStep.content}
                                </p>
                            )}

                            {/* Options grid */}
                            {currentStep.options && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
                                    {currentStep.options.map((opt) => {
                                        const isSelected = selections[currentStep.id] === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleSelect(opt.id)}
                                                className={`text-left p-4 rounded-2xl border-2 transition-all ${
                                                    isSelected 
                                                    ? "bg-[var(--primary)]/10 border-[var(--primary)] shadow-[0_0_20px_rgba(139,92,246,0.15)]" 
                                                    : "bg-black/20 border-white/5 hover:border-white/20"
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className={`font-bold ${isSelected ? 'text-[var(--primary)]' : 'text-white'}`}>{opt.label}</h3>
                                                    {isSelected && <CheckCircle2 size={18} className="text-[var(--primary)]" />}
                                                </div>
                                                <p className="text-xs text-slate-400">{opt.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {step === ONBOARDING_STEPS.length - 1 ? (
                                    <>Mulai Petualangan <Swords size={20} /></>
                                ) : (
                                    <>Lanjut <ChevronRight size={20} /></>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
