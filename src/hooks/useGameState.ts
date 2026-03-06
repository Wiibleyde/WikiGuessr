"use client";

import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import {
    articleAtom,
    errorAtom,
    guessesAtom,
    guessingAtom,
    inputAtom,
    lastGuessFoundAtom,
    lastGuessSimilarityAtom,
    lastRevealedWordAtom,
    loadingAtom,
    revealedAtom,
    revealedImagesAtom,
    revealingHintAtom,
    savedAtom,
    syncedAtom,
    winImagesAtom,
    wonAtom,
} from "@/atom/game";
import { HINT_PENALTY, MIN_GUESSES_FOR_HINT } from "@/lib/constants/game";
import {
    fetchGame, fetchImageHint
} from "@/lib/queries";
import type {
    GameCache
} from "@/types/game";
import { clearOldCaches, loadCache, saveCache } from "@/utils/cache";
import { checkWinCondition } from "@/utils/game";
import { fetchStateFromServer, pushStateToServer } from "@/utils/server";
import useGame from "./useGame";
import useGuess from "./useGuess";

export function useGameState() {
    const [article, setArticle] = useAtom(articleAtom);
    const [guesses, setGuesses] = useAtom(guessesAtom);
    const [revealed, setRevealed] = useAtom(revealedAtom);
    const [input, setInput] = useAtom(inputAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const guessing = useAtomValue(guessingAtom);
    const [won, setWon] = useAtom(wonAtom);
    const [saved, setSaved] = useAtom(savedAtom);
    const [error, setError] = useAtom(errorAtom);
    const [lastGuessFound, setLastGuessFound] = useAtom(lastGuessFoundAtom);
    const lastGuessSimilarity = useAtomValue(lastGuessSimilarityAtom);
    const lastRevealedWord = useAtomValue(lastRevealedWordAtom);

    const [synced, setSynced] = useAtom(syncedAtom);
    const [revealedImages, setRevealedImages] = useAtom(revealedImagesAtom);
    const winImages = useAtomValue(winImagesAtom);
    const [revealingHint, setRevealingHint] = useAtom(revealingHintAtom);

    const revealedCount = Object.keys(revealed).length;
    const totalWords = article?.totalWords ?? 0;
    const percentage =
        totalWords > 0 ? Math.round((revealedCount / totalWords) * 100) : 0;
    const hintsUsed = revealedImages.length;
    const imageCount = article?.imageCount ?? 0;
    const score = guesses.length + hintsUsed * HINT_PENALTY;
    const displayImages =
        won && winImages.length > 0 ? winImages : revealedImages;

    /** Fetch all images for the article (used after winning). */


    /** Fetch all word positions from the server and reveal every word. */

    const { revealAllWords, revealAllImages } = useGame();
    const { submitGuess } = useGuess();


    useEffect(() => {
        const gameData = fetchGame();
        gameData
            .then((data) => {
                if (!data) {
                    setError("Impossible de charger l'article du jour");
                    setLoading(false);
                    return;
                }
                setArticle(data);
                clearOldCaches(data.date);

                const cache = loadCache(data.date);
                if (cache) {
                    setGuesses(cache.guesses ?? []);
                    setRevealed(cache.revealed ?? {});
                    setRevealedImages(cache.revealedImages ?? []);
                    if (cache.saved) {
                        setSaved(true);
                    }
                    if (checkWinCondition(data, cache.revealed ?? {})) {
                        setWon(true);
                        const cachedGuesses = cache.guesses ?? [];
                        const words = cachedGuesses.map((g) => g.word);
                        revealAllWords(
                            data,
                            words,
                            cachedGuesses,
                            cache.revealed ?? {},
                        );
                        revealAllImages(data, cachedGuesses);
                    }
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Impossible de charger l'article du jour");
                setLoading(false);
            });
    }, [revealAllWords, revealAllImages, setArticle, setGuesses, setRevealed, setWon, setSaved, setError, setRevealedImages, setLoading]);

    /**
     * Synchronize state with the database after login.
     * - If DB has state → replace localStorage & React state with DB values.
     * - If DB is empty but localStorage has data → push localStorage to DB.
     * - If both empty → do nothing.
     */
    const syncWithDatabase = useCallback(async () => {
        if (!article || synced) return;

        const dbState = await fetchStateFromServer();
        const localCache = loadCache(article.date);

        const dbCount = dbState?.guesses?.length ?? 0;
        const localCount = localCache?.guesses?.length ?? 0;

        if (dbState && dbCount > 0 && dbCount >= localCount) {
            // DB has equal or more progress — use it
            setGuesses(dbState.guesses);
            setRevealed(dbState.revealed);
            setRevealedImages(dbState.revealedImages ?? []);
            if (dbState.saved) {
                setSaved(true);
            }
            const isWon = checkWinCondition(article, dbState.revealed);
            if (isWon) {
                setWon(true);
                const words = dbState.guesses.map((g) => g.word);
                revealAllWords(
                    article,
                    words,
                    dbState.guesses,
                    dbState.revealed,
                );
                revealAllImages(article, dbState.guesses);
            }
            saveCache(
                article.date,
                dbState.guesses,
                dbState.revealed,
                dbState.saved,
                dbState.revealedImages,
            );
        } else if (localCache && localCount > 0) {
            // Local has more progress — push it to DB
            await pushStateToServer(localCache);
        }

        setSynced(true);
    }, [article, synced, revealAllWords, revealAllImages, setGuesses, setRevealed, setRevealedImages, setSaved, setWon, setSynced]);

    /** Push current state to the DB (called on each guess when logged in). */
    const syncToDatabase = useCallback(async () => {
        if (!article) return;
        const cache: GameCache = { guesses, revealed, saved, revealedImages };
        await pushStateToServer(cache);
    }, [article, guesses, revealed, saved, revealedImages]);



    const markSaved = useCallback(() => {
        if (!article) return;
        setSaved(true);
        saveCache(article.date, guesses, revealed, true, revealedImages);
    }, [article, guesses, revealed, revealedImages, setSaved]);

    const revealHint = useCallback(async () => {
        if (!article || won || revealingHint) return;
        if (guesses.length < MIN_GUESSES_FOR_HINT) return;
        const nextIndex = revealedImages.length;
        if (nextIndex >= (article.imageCount ?? 0)) return;

        setRevealingHint(true);
        const hint = await fetchImageHint(
            nextIndex,
            guesses.map((g) => g.word),
        );
        if (hint) {
            const newImages = [...revealedImages, hint.imageUrl];
            setRevealedImages(newImages);
            saveCache(article.date, guesses, revealed, saved, newImages);
        } else {
            console.error("[hint] failed to reveal hint");
        }
        setRevealingHint(false);
    }, [article, won, revealingHint, revealedImages, guesses, revealed, saved, setRevealedImages, setRevealingHint]);

    return {
        article,
        guesses,
        revealed,
        input,
        setInput,
        loading,
        guessing,
        won,
        saved,
        error,
        lastGuessFound,
        lastGuessSimilarity,
        lastRevealedWord,
        setLastGuessFound,
        percentage,
        submitGuess,
        markSaved,
        syncWithDatabase,
        syncToDatabase,
        synced,
        revealedImages: displayImages,
        revealingHint,
        revealHint,
        hintsUsed,
        imageCount,
        score,
    };
}
