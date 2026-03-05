"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--dark)]">
            <Sidebar />
            <div className="ml-64 transition-all duration-300">
                <Navbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
