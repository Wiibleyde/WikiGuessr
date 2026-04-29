import { CLOSE_THRESHOLD } from "@/constants/game";
import type { ProximityReasonType, StoredGuess } from "@/types/game";
import GuessInfos from "./GuessInfos";
import GuessWord from "./GuessWord";

interface GuessProps {
    guess: StoredGuess;
}

const PROXIMITY_ICONS: Record<ProximityReasonType, string> = {
    transposition: "🔄",
    insertion: "➕",
    deletion: "➖",
    substitution: "🔤",
    mixed: "✏️",
};

export default function Guess({ guess }: GuessProps) {
    const isClose = !guess.found && (guess.similarity ?? 0) >= CLOSE_THRESHOLD;

    return (
        <div
            className={[
                "flex items-center justify-between px-4 py-1.5 text-sm",
                guess.found
                    ? "bg-success-light/60"
                    : isClose
                      ? "bg-warning-light/60"
                      : "bg-danger-light/60",
            ].join(" ")}
        >
            <div className="min-w-0 flex-1 truncate">
                <GuessWord
                    word={guess.word}
                    player={guess.player}
                    isFound={guess.found}
                    isClose={isClose}
                />
            </div>

            <div className="shrink-0 ml-2">
                <GuessInfos
                    variant={
                        guess.found ? "found" : isClose ? "close" : "notFound"
                    }
                >
                    {guess.found
                        ? `x${guess.occurrences}`
                        : isClose
                          ? `${guess.proximityReason?.description} ${PROXIMITY_ICONS[guess.proximityReason?.type || "mixed"] || ""}`
                          : ""}
                </GuessInfos>
            </div>
        </div>
    );
}
