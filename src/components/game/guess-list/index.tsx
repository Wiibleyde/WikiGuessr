"use client";

import type { StoredGuess } from "@/types/game";
import Guess from "./Guess";

interface GuessListProps {
    guesses: StoredGuess[];
}

export default function GuessList({ guesses }: GuessListProps) {
    return (
        <aside className="lg:w-72 w-full shrink-0">
            <div className="sticky top-36 bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-page border-b border-border text-sm font-semibold text-text-secondary">
                    Essais ({guesses.length})
                </div>
                <div className="max-h-[60vh] overflow-y-auto divide-y divide-subtle">
                    {guesses.length === 0 ? (
                        <p className="p-4 text-center text-muted text-xs">
                            Aucun essai
                        </p>
                    ) : (
                        guesses.map((guess, i) => (
                            <Guess key={`${guess.word}-${i}`} guess={guess} />
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
}
