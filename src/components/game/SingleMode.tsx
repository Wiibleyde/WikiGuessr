"use client";
import { useWikiGuessr } from "@/hooks/useWikiGuessr";
import Game from ".";

const SingleMode = () => {
    const {
        article,
        guesses,
        revealed,
        loading,
        won,
        error,
        percentage,
        submitGuess,
        revealedImages,
        revealingHint,
        revealHint,
        hintsUsed,
        imageCount,
        input,
        setInput,
        guessing,
    } = useWikiGuessr();

    return (
        <Game
            article={article}
            guesses={guesses}
            revealed={revealed}
            loading={loading}
            won={won}
            error={error}
            percentage={percentage}
            submitGuess={submitGuess}
            revealedImages={revealedImages}
            revealingHint={revealingHint}
            revealHint={revealHint}
            hintsUsed={hintsUsed}
            imageCount={imageCount}
            input={input}
            setInput={setInput}
            guessing={guessing}
        />
    );
};

export default SingleMode;
