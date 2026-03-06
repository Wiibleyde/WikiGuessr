import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import * as atomGame from "@/atom/game";
import type { GameCache } from "@/types/game";
import { loadCache, saveCache } from "@/utils/cache";
import { checkWinCondition } from "@/utils/game";
import { fetchStateFromServer, pushStateToServer } from "@/utils/server";
import useGame from "./useGame";

const useDb = () => {
    const { revealAllWords, revealAllImages } = useGame();
    const article = useAtomValue(atomGame.articleAtom);
    const [guesses, setGuesses] = useAtom(atomGame.guessesAtom);
    const [revealed, setRevealed] = useAtom(atomGame.revealedAtom);
    const [saved, setSaved] = useAtom(atomGame.savedAtom);
    const revealedImages = useAtomValue(atomGame.revealedImagesAtom);
    const setWon = useSetAtom(atomGame.wonAtom);
    const [synced, setSynced] = useAtom(atomGame.syncedAtom);
    const setRevealedImages = useSetAtom(atomGame.revealedImagesAtom);

    /** Push current state to the DB (called on each guess when logged in). */
    const syncToDatabase = useCallback(async () => {
        if (!article) return;
        const cache: GameCache = { guesses, revealed, saved, revealedImages };
        await pushStateToServer(cache);
    }, [article, guesses, revealed, saved, revealedImages]);

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
    }, [
        article,
        synced,
        revealAllWords,
        revealAllImages,
        setGuesses,
        setRevealed,
        setRevealedImages,
        setSaved,
        setWon,
        setSynced,
    ]);

    return { syncToDatabase, syncWithDatabase };
};

export default useDb;
