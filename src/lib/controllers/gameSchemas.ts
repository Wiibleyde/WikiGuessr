import { z } from "zod";

const MAX_GUESS_COUNT = 10_000;

export const submitGuessSchema = z.object({
    word: z.string().trim().min(1, "Mot manquant").max(100, "Mot invalide"),
    revealedWords: z.array(z.string()).optional(),
});

export const saveStateSchema = z.object({
    guesses: z.array(z.unknown()),
    revealed: z.record(z.string(), z.unknown()),
    saved: z.boolean().optional(),
    revealedImages: z.array(z.string()).optional(),
});

export const completeGameSchema = z.object({
    guessCount: z
        .number()
        .int()
        .min(1, "Nombre d'essais invalide")
        .max(MAX_GUESS_COUNT, "Nombre d'essais invalide"),
    guessedWords: z
        .array(z.string().min(1, "Liste de mots invalide"))
        .min(1, "Liste de mots manquante"),
    hintsUsed: z.number().min(0).optional(),
});

export const revealAllSchema = z.object({
    words: z
        .array(z.string().min(1, "Liste de mots invalide"))
        .min(1, "Liste de mots requise"),
});

export const getHintSchema = z.object({
    hintIndex: z.number().int().min(0, "Index d'indice invalide"),
    guesses: z.array(z.string()).optional(),
    won: z.boolean().optional(),
});
