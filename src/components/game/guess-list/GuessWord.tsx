import type { Player } from "@/types/game";

interface GuessWordProps {
    word: string;
    player?: Player;
    isFound: boolean;
    isClose: boolean;
}

export default function GuessWord({ word, isFound, isClose, player }: GuessWordProps) {
    const wordClass = {
        found: "text-emerald-800",
        close: "text-amber-700",
        notFound: "text-red-400 line-through",
    };

    return (
        <span
            className={
                isFound
                    ? wordClass.found
                    : isClose
                      ? wordClass.close
                      : wordClass.notFound
            }
        >
            {player && (
                <span className="text-xs font-medium text-gray-500 mr-1">
                    {player.displayName}:
                </span>
            )}
            {word}
        </span>
    );
}
