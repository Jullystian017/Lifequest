"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
                }
            }
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg("Check your email to verify your account!");
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--dark)] px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] mb-4">
                        <span className="text-3xl">⚔️</span>
                    </div>
                    <h1 className="text-2xl font-semibold font-[family-name:var(--font-heading)] bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary)] bg-clip-text text-transparent">
                        Join LifeQuest
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Create your character and start your journey
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-[var(--dark-secondary)] border border-[var(--dark-border)] rounded-2xl p-6 space-y-4"
                >
                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl mb-4 text-center">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-3 rounded-xl mb-4 text-center">
                            {successMsg}
                        </div>
                    )}
                    <Input
                        label="Username"
                        placeholder="Choose your adventurer name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={<User size={16} />}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={16} />}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={16} />}
                        required
                    />
                    <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                        Create Account
                    </Button>
                </form>

                <p className="text-center text-sm text-[var(--text-muted)] mt-4">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-[var(--primary-light)] hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
