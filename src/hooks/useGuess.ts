import { useCallback } from "react";
import { normalizeWord } from "@/lib/game/normalize";
import { checkWinCondition } from "@/lib/game/progress";
import { useSubmitGuess } from "@/lib/query";
import type { StoredGuess } from "@/types/game";
import { saveCache } from "@/utils/cache";
import { applyPositions, posKey } from "@/utils/helper";
import useArticle from "./useArticle";
import useGame from "./useGame";
import { useGameState } from "./useGameState";

const useGuess = () => {
    const { reloadArticle } = useArticle();
    const {
        input,
        setInput,
        article,
        revealed,
        setRevealed,
        guesses,
        setGuesses,
        revealedImages,
        won,
        setWon,
        setError,
        setLastFoundKeys,
    } = useGameState();

    // TanStack Query mutation for submitting guess
    const { mutateAsync: submitGuessMutation, isPending: guessing } =
        useSubmitGuess();
    const { revealAllWords, revealAllImages } = useGame();

    const submitGuess = useCallback<(e?: React.FormEvent) => Promise<void>>(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            if (!input.trim() || !article || won || guessing) return;

            const raw = input.trim();
            const words = raw.split(/\s+/).filter(Boolean);

            let currentFoundWords = guesses
                .filter((g) => g.found)
                .map((g) => g.word);
            let currentRevealed = { ...revealed };
            const newGuessesThisBatch: StoredGuess[] = [];
            const newLastFoundKeys = new Set<string>();

            try {
                for (const word of words) {
                    const normalized = normalizeWord(word);

                    if (
                        guesses.some((g) => g.word === normalized) ||
                        newGuessesThisBatch.some((g) => g.word === normalized)
                    ) {
                        continue;
                    }

                    const guessResult = await submitGuessMutation({
                        word,
                        revealedWords: currentFoundWords,
                    });

                    if (!guessResult) continue;

                    // Detect server day change — discard this guess & reload
                    if (guessResult.serverDate !== article.date) {
                        reloadArticle();
                        return;
                    }

                    const newGuess: StoredGuess = {
                        word: guessResult.word,
                        found: guessResult.found,
                        occurrences: guessResult.occurrences,
                        similarity: guessResult.similarity,
                        proximityReason: guessResult.proximityReason,
                    };

                    newGuessesThisBatch.push(newGuess);
                    currentRevealed = applyPositions(
                        currentRevealed,
                        guessResult.positions,
                    );

                    if (guessResult.found && guessResult.positions.length > 0) {
                        currentFoundWords = [
                            ...currentFoundWords,
                            guessResult.word,
                        ];
                        for (const pos of guessResult.positions) {
                            newLastFoundKeys.add(
                                posKey(pos.section, pos.part, pos.wordIndex),
                            );
                        }
                    }
                }

                if (newGuessesThisBatch.length > 0) {
                    const newGuesses = [
                        ...newGuessesThisBatch.reverse(),
                        ...guesses,
                    ];
                    setGuesses(newGuesses);
                    setRevealed(currentRevealed);

                    if (newLastFoundKeys.size > 0) {
                        setLastFoundKeys(newLastFoundKeys);
                    }

                    saveCache(
                        article.date,
                        newGuesses,
                        currentRevealed,
                        undefined,
                        revealedImages,
                    );

                    if (checkWinCondition(article, currentRevealed)) {
                        setWon(true);
                        const allWords = newGuesses.map((g) => g.word);
                        revealAllWords(
                            article,
                            allWords,
                            newGuesses,
                            currentRevealed,
                        );
                        revealAllImages(article, newGuesses);
                    }
                }
            } catch {
                setError("Erreur lors de la soumission");
            } finally {
                setInput("");
            }
        },
        [
            input,
            article,
            won,
            guessing,
            guesses,
            revealed,
            revealedImages,
            revealAllWords,
            revealAllImages,
            reloadArticle,
            setGuesses,
            setRevealed,
            setError,
            setInput,
            setWon,
            setLastFoundKeys,
            submitGuessMutation,
        ],
    );

    return { submitGuess, guessing };
};

export default useGuess;
