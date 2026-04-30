import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "navbar" | "navbarActive" | "danger";
}
export default function Button({
    children,
    className,
    variant = "primary",
    ...props
}: ButtonProps) {
    const variants = {
        primary:
            "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md hover:scale-[1.02]",
        secondary: "border border-danger text-danger hover:bg-danger-light",
        navbar: "text-muted hover:text-text hover:bg-primary-light/50",
        navbarActive: "bg-primary-light text-primary-text",
        danger: "bg-danger text-white hover:bg-danger-hover",
    };

    return (
        <button
            className={cn(
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]}`,
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
