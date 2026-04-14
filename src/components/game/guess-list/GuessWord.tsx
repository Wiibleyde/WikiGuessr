import type { Player } from "@/types/game";

interface GuessWordProps {
    word: string;
    player?: Player;
    isFound: boolean;
    isClose: boolean;
}

export default function GuessWord({
    word,
    isFound,
    isClose,
    player,
}: GuessWordProps) {
    const wordClass = {
        found: "text-success-text",
        close: "text-warning-text",
        notFound: "text-danger",
    };

    return (
        <div className="flex items-center gap-1 text-sm font-medium">
            {player && (
                <span className="text-muted">{player.displayName}:</span>
            )}
            <span
                className={
                    isFound
                        ? wordClass.found
                        : isClose
                          ? wordClass.close
                          : wordClass.notFound
                }
            >
                {word}
            </span>
        </div>
    );
}
