"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = "", ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        className={`
              w-full bg-[var(--dark-surface)] border border-[var(--dark-border)]
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              rounded-xl px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
              transition-all duration-200
              ${icon ? "pl-10" : ""}
              ${error ? "border-red-500 focus:ring-red-500" : ""}
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
export default Input;
