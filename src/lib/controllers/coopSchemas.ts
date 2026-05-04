import { z } from "zod";

export const createLobbySchema = z.object({
    displayName: z
        .string()
        .trim()
        .min(1, "Nom d'affichage requis")
        .max(30, "Nom invalide (1-30 caractères)"),
    userId: z.string().optional(),
});

export const joinLobbySchema = z.object({
    code: z.preprocess(
        (v) => (typeof v === "string" ? v.trim().toUpperCase() : v),
        z
            .string()
            .regex(/^[A-Z2-9]{6}$/, "Code invalide (6 caractères attendus)"),
    ),
    displayName: z
        .string()
        .trim()
        .min(1, "Nom d'affichage requis")
        .max(30, "Nom invalide (1-30 caractères)"),
    userId: z.string().optional(),
});

export const playerTokenSchema = z.object({
    playerToken: z.string().min(1, "Token joueur requis"),
});

export const submitCoopGuessSchema = z.object({
    playerToken: z.string().min(1, "Token joueur requis"),
    word: z.string().trim().min(1, "Mot manquant").max(100, "Mot invalide"),
});
