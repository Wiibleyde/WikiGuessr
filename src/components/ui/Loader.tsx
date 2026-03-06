interface LoaderProps {
    message: string;
}

export default function Loader({ message }: LoaderProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-stone-50 px-6">
            <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-emerald-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl select-none">📖</span>
                    </div>
                </div>

                <p className="text-xl font-bold text-gray-700 mb-6 tracking-tight">
                    {message}
                </p>

                <div className="flex flex-col gap-2 max-w-xs mx-auto">
                    <div className="h-3 bg-gray-200 rounded-full animate-pulse" />
                    <div
                        className="h-3 bg-gray-200 rounded-full animate-pulse"
                        style={{ width: "80%", marginInline: "auto" }}
                    />
                    <div
                        className="h-3 bg-gray-200 rounded-full animate-pulse"
                        style={{ width: "60%", marginInline: "auto" }}
                    />
                </div>
            </div>
        </div>
    );
}
