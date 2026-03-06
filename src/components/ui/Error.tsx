import Link from "next/link";

interface ErrorProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-stone-50 px-6">
            <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl select-none">⚠️</span>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-800 mb-3 tracking-tight">
                    Quelque chose s'est mal passé
                </h2>

                <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-4 mb-8">
                    <p className="text-red-600 font-mono text-sm wrap-break-word text-left">
                        {message}
                    </p>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-100"
                >
                    ← Retour à l&apos;accueil
                </Link>
            </div>
        </div>
    );
}
