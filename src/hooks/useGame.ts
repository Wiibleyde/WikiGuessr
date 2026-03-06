import { useSetAtom } from "jotai";
import { useCallback } from "react";
import {
    revealedAtom, winImagesAtom
} from "@/atom/game";
import { fetchGameReveal, fetchImageHint } from "@/lib/queries";
import type { MaskedArticle, RevealedMap, StoredGuess } from "@/types/game";
import { saveCache } from "@/utils/cache";
import { posKey } from "@/utils/helper";

const useGame = () => {
    const setWinImages = useSetAtom(winImagesAtom);
    const setRevealed = useSetAtom(revealedAtom);

    const revealAllWords = useCallback(
        async (
            art: MaskedArticle,
            words: string[],
            currentGuesses: StoredGuess[],
            currentRevealed: RevealedMap,
        ) => {
            const reveal = await fetchGameReveal(words);
            if (reveal) {
                const fullRevealed = { ...currentRevealed };
                for (const pos of reveal.positions) {
                    fullRevealed[posKey(pos.section, pos.part, pos.wordIndex)] =
                        pos.display;
                }
                setRevealed(fullRevealed);
                saveCache(art.date, currentGuesses, fullRevealed);
                return;
            }
        },
        [setRevealed],
    );

    const revealAllImages = useCallback(
        async (art: MaskedArticle, currentGuesses: StoredGuess[]) => {
            const total = art.imageCount ?? 0;
            if (total === 0) return;
            const allImages: string[] = [];
            const words = currentGuesses.map((g) => g.word);
            for (let i = 0; i < total; i++) {
                const hint = await fetchImageHint(i, words, true);
                if (hint) allImages.push(hint.imageUrl);
            }
            setWinImages(allImages);
        },
        [setWinImages],
    );

    return { revealAllWords, revealAllImages };
};

export default useGame;
