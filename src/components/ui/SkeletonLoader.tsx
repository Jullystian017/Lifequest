interface SkeletonLoaderProps {
    width?: string;
    height?: string;
    rounded?: "sm" | "md" | "lg" | "full";
    className?: string;
}

const roundedStyles = {
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
};

export default function SkeletonLoader({
    width = "100%",
    height = "20px",
    rounded = "md",
    className = "",
}: SkeletonLoaderProps) {
    return (
        <div
            className={`skeleton ${roundedStyles[rounded]} ${className}`}
            style={{ width, height }}
        />
    );
}
