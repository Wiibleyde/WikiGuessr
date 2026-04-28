"use client";
import useCoopGuess from "@/hooks/useCoopGuess";
import useCoopLobby from "@/hooks/useCoopLobby";
import { useCoopState } from "@/hooks/useCoopState";
import Button from "../ui/Button";
import Game from ".";

interface CoopGameProps {
    code: string;
    onLeave: () => void;
}

const CoopMode = ({ code, onLeave }: CoopGameProps) => {
    const {
        article,
        guesses,
        revealed,
        players,
        won,
        lastFoundKeys,
        abandoned,
    } = useCoopState();
    const { percentage, isLeader, restartGame, abandonCoopGame, loading } =
        useCoopLobby();
    const { input, setInput, submitGuess, guessing, error } =
        useCoopGuess(code);

    if (!article) return null;

    return (
        <>
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
                lastFoundKeys={lastFoundKeys}
                abandoned={abandoned}
            />

            {won && isLeader && (
                <div className="max-w-5xl mx-auto px-4 pb-4 text-center">
                    <Button onClick={restartGame} disabled={loading}>
                        Nouvelle partie
                    </Button>
                </div>
            )}

            {!won && !abandoned && isLeader && (
                <div className="max-w-5xl mx-auto px-4 pb-4 text-center">
                    <button
                        type="button"
                        onClick={abandonCoopGame}
                        className="text-xs text-danger hover:underline cursor-pointer"
                    >
                        Abandonner la partie (hôte)
                    </button>
                </div>
            )}
        </>
    );
};

export default CoopMode;
