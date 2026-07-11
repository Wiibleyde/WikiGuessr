"use client";

import { useState } from "react";

interface CoopCodeShareProps {
    code: string;
    /** "full" for the lobby card, "compact" for the in-game banner. */
    variant?: "full" | "compact";
}

export default function CoopCodeShare({
    code,
    variant = "full",
}: CoopCodeShareProps) {
    const [copied, setCopied] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyLink = () => {
        const link = `${window.location.origin}/coop/${code}`;
        navigator.clipboard.writeText(link);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    if (variant === "compact") {
        return (
            <div className="flex flex-wrap items-center justify-center gap-2 bg-surface rounded-xl border border-border px-4 py-2 text-sm">
                <span className="text-muted">Code :</span>
                <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-page rounded-lg border border-border hover:bg-subtle transition-colors cursor-pointer"
                >
                    <span className="font-bold tracking-[0.2em] text-text font-(family-name:--font-heading)">
                        {code}
                    </span>
                    <span className="text-xs text-muted">
                        {copied ? "Copié !" : "Copier"}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1 font-medium text-primary-text bg-primary-light rounded-lg border border-primary/20 hover:bg-primary-light/70 transition-colors cursor-pointer"
                >
                    🔗 {copiedLink ? "Copié !" : "Copier"}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl shadow-sm border border-border p-6 mb-6">
            <div className="text-center mb-4">
                <p className="text-sm text-muted mb-2">Code du lobby</p>
                <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-page rounded-lg border border-border hover:bg-subtle transition-colors cursor-pointer"
                >
                    <span className="text-3xl font-bold tracking-[0.3em] text-text font-(family-name:--font-heading)">
                        {code}
                    </span>
                    <span className="text-xs text-muted">
                        {copied ? "Copié !" : "Copier"}
                    </span>
                </button>
            </div>

            <p className="text-center text-sm text-muted">
                Partagez ce code avec vos amis pour qu'ils rejoignent.
            </p>

            <div className="flex justify-center mt-4">
                <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-text bg-primary-light rounded-lg border border-primary/20 hover:bg-primary-light/70 transition-colors cursor-pointer"
                >
                    🔗{" "}
                    {copiedLink
                        ? "Lien copié !"
                        : "Copier le lien d'invitation"}
                </button>
            </div>
        </div>
    );
}
