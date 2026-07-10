"use client";

import type { StoredGuess } from "@/types/game";
import { cn } from "@/utils/cn";
import Guess from "./Guess";

interface GuessListProps {
    guesses: StoredGuess[];
    className?: string;
}

export default function GuessList({ guesses, className }: GuessListProps) {
    return (
        <aside className={cn("lg:w-72 w-full shrink-0", className)}>
            <div className="sticky top-36 bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-page border-b border-border text-sm font-semibold text-text-secondary">
                    Essais ({guesses.length})
                </div>
                <div className="max-h-40 lg:max-h-[60vh] overflow-y-auto divide-y divide-subtle">
                    {guesses.length === 0 ? (
                        <p className="p-4 text-center text-muted text-xs">
                            Aucun essai
                        </p>
                    ) : (
                        guesses.map((guess) => (
                            <Guess key={guess.word} guess={guess} />
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
}
