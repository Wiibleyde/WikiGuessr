"use client";
import useCoopGuess from "@/hooks/useCoopGuess";
import useCoopLobby from "@/hooks/useCoopLobby";
import { useCoopState } from "@/hooks/useCoopState";
import Game from ".";

interface CoopGameProps {
    code: string;
    onLeave: () => void;
}

const CoopMode = ({ code, onLeave }: CoopGameProps) => {
    const { article, guesses, revealed, players, won } = useCoopState();
    const { percentage } = useCoopLobby();
    const { input, setInput, submitGuess, guessing, error } =
        useCoopGuess(code);

    if (!article) return null;

    return (
        <Game
            article={article}
            guesses={guesses}
            revealed={revealed}
            error={error}
            loading={false}
            won={won}
            percentage={percentage}
            submitGuess={submitGuess}
            revealedImages={[]}
            revealingHint={false}
            revealHint={() => {}}
            hintsUsed={0}
            imageCount={article.imageCount}
            input={input}
            setInput={setInput}
            guessing={guessing}
            players={players}
            coop
            onLeave={onLeave}
        />
    );
};

export default CoopMode;
