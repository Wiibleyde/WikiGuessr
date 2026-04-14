"use client";

import Image from "next/image";
import { useState } from "react";
import { HINT_PENALTY, MIN_GUESSES_FOR_HINT } from "@/constants/game";
import { normalizeHintImageUrls } from "@/utils/hintImage";

interface ImageHintProps {
    imageCount: number;
    revealedImages: string[];
    revealingHint: boolean;
    won: boolean;
    onRevealHint: () => void;
    guessCount: number;
}

export default function ImageHint({
    imageCount,
    revealedImages,
    revealingHint,
    won,
    onRevealHint,
    guessCount,
}: ImageHintProps) {
    const [expanded, setExpanded] = useState(true);

    if (imageCount === 0) return null;

    const displayUrls = normalizeHintImageUrls(revealedImages);
    const hintsUsed = revealedImages.length;
    const allRevealed = hintsUsed >= imageCount;
    const hintUnlocked = guessCount >= MIN_GUESSES_FOR_HINT;
    const canReveal = !allRevealed && !won && !revealingHint && hintUnlocked;

    return (
        <div className="max-w-5xl mx-auto px-4 pt-4">
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between border-b border-subtle">
                    <div className="flex items-center gap-2">
                        <span className="text-base">🖼️</span>
                        <span className="text-sm font-medium text-text-secondary">
                            Indices images
                        </span>
                        <span className="text-xs text-muted">
                            ({hintsUsed}/{imageCount})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {!hintUnlocked && !won && (
                            <span className="text-xs text-muted">
                                Disponible après {MIN_GUESSES_FOR_HINT} essais (
                                {guessCount}/{MIN_GUESSES_FOR_HINT})
                            </span>
                        )}
                        {canReveal && (
                            <button
                                type="button"
                                onClick={onRevealHint}
                                disabled={revealingHint}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-warning text-white hover:bg-warning-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {revealingHint
                                    ? "…"
                                    : `Révéler une image (+${HINT_PENALTY} essais)`}
                            </button>
                        )}
                        {hintsUsed > 0 && (
                            <button
                                type="button"
                                onClick={() => setExpanded((prev) => !prev)}
                                className="text-xs text-muted hover:text-text transition-colors"
                            >
                                {expanded ? "Masquer" : "Afficher"}
                            </button>
                        )}
                    </div>
                </div>

                {hintsUsed > 0 && expanded && (
                    <div className="p-4 flex flex-wrap gap-4">
                        {displayUrls.map((url, i) => (
                            <div
                                key={url}
                                className="relative rounded-lg overflow-hidden shadow-sm border border-subtle max-h-48"
                            >
                                <Image
                                    src={url}
                                    alt={`Indice ${i + 1}`}
                                    width={300}
                                    height={192}
                                    className="max-h-48 w-auto rounded-lg object-contain pointer-events-none select-none"
                                    draggable={false}
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                )}

                {hintsUsed === 0 && (
                    <div className="px-4 py-3 text-center">
                        <p className="text-xs text-muted">
                            {hintUnlocked ? (
                                <>
                                    Révélez des images de l&apos;article pour
                                    vous aider. Chaque image ajoute{" "}
                                    {HINT_PENALTY} essais à votre score.
                                </>
                            ) : (
                                <>
                                    Les indices images se débloquent après{" "}
                                    {MIN_GUESSES_FOR_HINT} essais. Chaque image
                                    ajoutera {HINT_PENALTY} essais à votre
                                    score.
                                </>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
