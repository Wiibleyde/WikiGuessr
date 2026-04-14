interface LoaderProps {
    message: string;
}

const shimmerStyle = {
    background:
        "linear-gradient(90deg, var(--color-subtle) 25%, var(--color-border) 50%, var(--color-subtle) 75%)",
    backgroundSize: "200% 100%",
};

export default function Loader({ message }: LoaderProps) {
    return (
        <output
            className="min-h-[60vh] flex items-center justify-center bg-page px-6"
            aria-live="polite"
        >
            <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-subtle" />
                    <div className="absolute inset-0 rounded-full border-4 border-subtle border-t-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl select-none">📖</span>
                    </div>
                </div>

                <p className="text-xl font-bold text-text mb-6 tracking-tight">
                    {message}
                </p>
                <span className="sr-only">{message}</span>

                <div className="flex flex-col gap-2 max-w-xs mx-auto">
                    <div
                        className="h-3 rounded-full animate-shimmer"
                        style={shimmerStyle}
                    />
                    <div
                        className="h-3 rounded-full animate-shimmer"
                        style={{
                            ...shimmerStyle,
                            width: "80%",
                            marginInline: "auto",
                        }}
                    />
                    <div
                        className="h-3 rounded-full animate-shimmer"
                        style={{
                            ...shimmerStyle,
                            width: "60%",
                            marginInline: "auto",
                        }}
                    />
                </div>
            </div>
        </output>
    );
}
