"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
    isLoading?: boolean;
}

const variantStyles = {
    primary: "bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white",
    secondary: "bg-[var(--secondary)] hover:bg-[var(--secondary-dark)] text-white",
    accent: "bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-black",
    ghost: "bg-transparent hover:bg-[var(--dark-surface)] text-[var(--text-secondary)] border border-[var(--dark-border)]",
    danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
};

export default function Button({
    variant = "primary",
    size = "md",
    children,
    isLoading = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        font-medium transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
}
