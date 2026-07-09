import type { NextRequest, NextResponse } from "next/server";
import {
    GameVerificationError,
    HintLockedError,
    HintNotFoundError,
} from "@/lib/errors/gameError";
import {
    completeGame,
    getArticle,
    getGameState,
    getHint,
    getYesterday,
    revealAll,
    saveGameState,
    submitGuess,
} from "@/lib/services/gameService";
import type { AuthUser } from "@/types/auth";
import type { GameCache } from "@/types/game";
import { err, ok } from "@/utils/response";
import {
    completeGameSchema,
    getHintSchema,
    revealAllSchema,
    saveStateSchema,
    submitGuessSchema,
} from "./gameSchemas";

export async function getArticleHandler(
    _request: NextRequest,
    user: AuthUser | null,
): Promise<NextResponse> {
    const article = await getArticle(user);
    return ok(article, 200, {
        "Cache-Control": "no-store, no-cache, must-revalidate",
    });
}

export async function submitGuessHandler(
    request: NextRequest,
    user: AuthUser | null,
): Promise<NextResponse> {
    const parsed = submitGuessSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
    }
    const { word, revealedWords } = parsed.data;
    const result = await submitGuess(word, revealedWords, user);
    return ok(result);
}

export async function getStateHandler(
    _request: NextRequest,
    user: AuthUser,
): Promise<NextResponse> {
    const state = await getGameState(user);
    return ok({ state });
}

export async function saveStateHandler(
    request: NextRequest,
    user: AuthUser,
): Promise<NextResponse> {
    const parsed = saveStateSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err("Données invalides", 400);
    }
    await saveGameState(user, parsed.data as GameCache);
    return ok({ success: true });
}

export async function completeGameHandler(
    request: NextRequest,
    user: AuthUser,
): Promise<NextResponse> {
    const parsed = completeGameSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
    }
    const { guessCount, guessedWords, hintsUsed } = parsed.data;
    const safeHintsUsed = Math.floor(hintsUsed ?? 0);

    try {
        const result = await completeGame(
            user,
            guessCount,
            guessedWords,
            safeHintsUsed,
        );
        return ok({
            success: true,
            resultId: result.resultId,
            rank: result.rank,
        });
    } catch (error) {
        if (error instanceof GameVerificationError) {
            return err(error.message, 400);
        }
        throw error;
    }
}

export async function revealAllHandler(
    request: NextRequest,
    user: AuthUser | null,
): Promise<NextResponse> {
    const parsed = revealAllSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
    }
    try {
        const positions = await revealAll(parsed.data.words, user);
        return ok({ positions });
    } catch (error) {
        if (error instanceof GameVerificationError) {
            return err(error.message, 403);
        }
        throw error;
    }
}

export async function getYesterdayHandler(
    _request: NextRequest,
): Promise<NextResponse> {
    const title = await getYesterday();
    return ok({ title });
}

export async function getHintHandler(
    request: NextRequest,
    user: AuthUser | null,
): Promise<NextResponse> {
    const parsed = getHintSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
    }
    const { hintIndex, guesses, won } = parsed.data;
    try {
        const result = await getHint(hintIndex, user, guesses, won === true);
        return ok(result);
    } catch (error) {
        if (error instanceof HintLockedError) return err(error.message, 403);
        if (error instanceof HintNotFoundError) return err(error.message, 404);
        throw error;
    }
}
