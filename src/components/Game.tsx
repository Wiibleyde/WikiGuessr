"use client";

import ArticleView from "@/components/ArticleView";
import GameHeader from "@/components/GameHeader";
import GuessList from "@/components/GuessList";
import ImageHint from "@/components/ImageHint";
import { useGameState } from "@/hooks/useGameState";
import ErrorMessage from "./ui/Error";
import Loader from "./ui/Loader";
import NoDataMessage from "./ui/NoDataMessage";

export default function Game() {
    const {
        article,
        guesses,
        revealed,
        input,
        setInput,
        loading,
        guessing,
        won,
        error,
        lastGuessFound,
        lastGuessSimilarity,
        lastRevealedWord,
        setLastGuessFound,
        percentage,
        submitGuess,
        revealedImages,
        revealingHint,
        revealHint,
        hintsUsed,
        imageCount,
        score,
    } = useGameState();

    if (loading) return <Loader message="Chargement de l'article du jour…" />;

    if (error && !article) return <ErrorMessage message={error} />;

    if (!article)
        return (
            <NoDataMessage message="Aucun article disponible pour le moment. Veuillez réessayer plus tard." />
        );

    return (
        <div className="min-h-screen bg-stone-50 text-gray-900">
            <GameHeader
                date={article.date}
                guessCount={guesses.length}
                percentage={percentage}
                won={won}
                guessing={guessing}
                input={input}
                lastGuessFound={lastGuessFound}
                lastGuessSimilarity={lastGuessSimilarity}
                hintsUsed={hintsUsed}
                score={score}
                onInputChange={(value) => {
                    setInput(value);
                    setLastGuessFound(null);
                }}
                onSubmit={submitGuess}
            />

            <ImageHint
                imageCount={imageCount}
                revealedImages={revealedImages}
                revealingHint={revealingHint}
                won={won}
                guessCount={guesses.length}
                onRevealHint={revealHint}
            />

            <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
                <ArticleView
                    article={article}
                    revealed={revealed}
                    lastRevealedWord={lastRevealedWord}
                />
                <GuessList guesses={guesses} />
            </div>
        </div>
    );
}
