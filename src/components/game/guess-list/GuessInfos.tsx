import { cn } from "@/utils/cn";

interface GuessInfosProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "found" | "close" | "notFound";
}

export default function GuessInfos({
    variant = "notFound",
    className,
    children,
    ...props
}: GuessInfosProps) {
    const variants = {
        close: "text-warning",
        found: "text-success",
        notFound: "text-danger",
    };

    return (
        <span
            className={cn(
                "text-xs flex items-center gap-1",
                variants[variant],
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
