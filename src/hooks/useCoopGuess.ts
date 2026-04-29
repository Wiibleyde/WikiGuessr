"use client";

import { useCallback, useState } from "react";
import { normalizeWord } from "@/lib/game/normalize";
import type { GuessResult } from "@/types/game";
import { applyPositions, posKey } from "@/utils/helper";
import { useCoopState } from "./useCoopState";

export default function useCoopGuess(code: string | null) {
    const [input, setInput] = useState("");
    const {
        article,
        playerToken,
        guesses,
        won,
        setRevealed,
        setLastFoundKeys,
    } = useCoopState();
    const [guessing, setGuessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitGuess = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            if (
                !input.trim() ||
                !article ||
                !code ||
                !playerToken ||
                won ||
                guessing
            )
                return;

            const raw = input.trim();
            const words = raw.split(/\s+/).filter(Boolean);

            setGuessing(true);

            try {
                for (const word of words) {
                    const normalized = normalizeWord(word);

                    if (guesses.some((g) => g.word === normalized)) {
                        continue;
                    }

                    const res = await fetch(`/api/coop/${code}/guess`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ playerToken, word }),
                    });

                    if (!res.ok) {
                        const data = (await res.json()) as { error: string };
                        setError(data.error);
                        break;
                    }

                    const result = (await res.json()) as GuessResult & {
                        won: boolean;
                    };

                    if (result.found && result.positions.length > 0) {
                        setRevealed((prev) =>
                            applyPositions(prev, result.positions),
                        );
                        const keys = new Set(
                            result.positions.map((p) =>
                                posKey(p.section, p.part, p.wordIndex),
                            ),
                        );
                        setLastFoundKeys(keys);
                    }
                }
            } catch {
                setError("Erreur lors de la soumission");
            } finally {
                setGuessing(false);
                setInput("");
            }
        },
        [
            input,
            article,
            code,
            playerToken,
            won,
            guessing,
            guesses,
            setRevealed,
            setLastFoundKeys,
        ],
    );

    return { input, setInput, submitGuess, guessing, error };
}
