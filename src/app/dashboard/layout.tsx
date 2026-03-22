"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useSidebarStore } from "@/store/sidebarStore";
import LevelUpModal from "@/components/ui/LevelUpModal";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isCollapsed } = useSidebarStore();

    return (
        <div className="min-h-screen bg-[var(--dark)]">
            <Sidebar />
            <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <Navbar />
                <main className="px-10 py-8">{children}</main>
            </div>
            <LevelUpModal />
        </div>
    );
}
