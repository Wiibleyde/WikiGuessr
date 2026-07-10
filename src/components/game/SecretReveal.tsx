"use client";

/**
 * Private easter-egg takeover. Rendered full-screen over the finished game once
 * the secret account wins. Shows only the secret payload, animated in.
 */
export default function SecretReveal() {
    return (
        <div
            className="animate-secret-gradient motion-reduce:animate-none fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#1e293b_0%,#334155_50%,#0f172a_100%)] px-6 text-center text-slate-100"
            style={{ backgroundSize: "220% 220%" }}
            role="dialog"
            aria-modal="true"
            aria-label="Message secret"
        >
            <div className="animate-secret-in motion-reduce:animate-none flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold sm:text-5xl">
                    Series 19&nbsp;· épisode 2
                </h1>

                <p className="animate-secret-pulse motion-reduce:animate-none rounded-2xl bg-white/5 px-8 py-4 font-mono text-5xl font-black tabular-nums text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-sm sm:text-7xl">
                    → 31:57
                </p>
            </div>
        </div>
    );
}
