"use client";

import type { FormEvent } from "react";
import GameHeader from "@/components/game/game-header";
import ImageHint from "@/components/game/ImageHint";
import type { CoopPlayerInfo } from "@/types/coop";
import type { MaskedArticle, RevealedMap, StoredGuess } from "@/types/game";
import { formatDateWithMonthName } from "@/utils/date";
import { plural } from "@/utils/helper";
import CoopPlayerList from "../coop/CoopPlayerList";
import Button from "../ui/Button";
import Confetti from "../ui/Confetti";
import ErrorMessage from "../ui/Error";
import Loader from "../ui/Loader";
import NoDataMessage from "../ui/NoDataMessage";
import ArticleView from "./article";
import GuessList from "./guess-list";

interface GameProps {
    article: MaskedArticle | null;
    guesses: StoredGuess[];
    revealed: RevealedMap;
    loading: boolean;
    won: boolean;
    error: string | null;
    percentage: number;
    submitGuess: (e?: FormEvent<Element> | undefined) => Promise<void>;
    revealedImages: string[];
    revealingHint: boolean;
    revealHint: () => void;
    hintsUsed: number;
    imageCount: number;
    input: string;
    setInput: (value: string) => void;
    guessing: boolean;
    players?: CoopPlayerInfo[];
    coop?: boolean;
    onLeave?: () => void;
    lastFoundKeys?: Set<string>;
    abandoned?: boolean;
    todayRank?: number | null;
}

export default function Game({
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
    players,
    coop = false,
    onLeave,
    lastFoundKeys,
    abandoned = false,
    todayRank,
}: GameProps) {
    if (loading) return <Loader message="Chargement de l'article du jour…" />;

    if (error && !article) return <ErrorMessage message={error} />;

    if (!article)
        return (
            <NoDataMessage message="Aucun article disponible pour le moment. Veuillez réessayer plus tard." />
        );

    return (
        <div className="min-h-screen bg-page text-text">
            <Confetti active={won} />
            <GameHeader
                date={article.date}
                percentage={percentage}
                won={won}
                hintsUsed={hintsUsed}
                onSubmit={submitGuess}
                guessing={guessing}
                input={input}
                setInput={setInput}
                guessCount={guesses.length}
                coop={coop}
                todayRank={todayRank}
                datas={[
                    formatDateWithMonthName(article.date),
                    plural(guesses.length, "essai", "essais"),
                    plural(hintsUsed, "indice", "indices"),
                    plural(percentage, "% révélé", "% révélés"),
                ]}
                abandoned={abandoned}
            />

            <ImageHint
                imageCount={imageCount}
                revealedImages={revealedImages}
                revealingHint={revealingHint}
                won={won}
                onRevealHint={revealHint}
                guessCount={guesses.length}
            />

            {coop && players && (
                <div className="flex items-center justify-between max-w-5xl mx-auto px-4">
                    <CoopPlayerList players={players} />
                    {onLeave && (
                        <Button
                            variant="secondary"
                            onClick={onLeave}
                            className="shrink-0"
                        >
                            Quitter
                        </Button>
                    )}
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
                <ArticleView
                    article={article}
                    revealed={revealed}
                    lastFoundKeys={lastFoundKeys}
                />
                <GuessList guesses={guesses} />
            </div>
        </div>
    );
}
