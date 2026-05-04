import type { NextRequest, NextResponse } from "next/server";
import {
    GameAlreadyStartedError,
    GameNotStartedError,
    LobbyFinishedError,
    LobbyFullError,
    LobbyNotFoundError,
    NotLeaderError,
} from "@/lib/errors/coopError";
import {
    abandonCoopGame,
    createCoopLobby,
    getCoopLobbyState,
    joinCoopLobby,
    leaveLobby,
    restartCoopGame,
    startCoopGame,
    submitCoopGuess,
} from "@/lib/services/coopService";
import { err, ok } from "@/utils/response";
import {
    createLobbySchema,
    joinLobbySchema,
    playerTokenSchema,
    submitCoopGuessSchema,
} from "./coopSchemas";

export async function createLobbyHandler(
    request: NextRequest,
): Promise<NextResponse> {
    const parsed = createLobbySchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
    }
    const { displayName, userId } = parsed.data;

    const { lobby, player, playerToken } = await createCoopLobby(
        displayName,
        userId,
    );

    return ok({
        code: lobby.code,
        playerId: player.id,
        playerToken,
        isLeader: true,
    });
}

export async function joinLobbyHandler(
    request: NextRequest,
): Promise<NextResponse> {
    const parsed = joinLobbySchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
    }
    const { code, displayName, userId } = parsed.data;

    try {
        const { lobby, player, playerToken } = await joinCoopLobby(
            code,
            displayName,
            userId,
        );

        return ok({
            code: lobby.code,
            playerId: player.id,
            playerToken,
            isLeader: player.isLeader,
        });
    } catch (error) {
        if (error instanceof LobbyNotFoundError) return err(error.message, 404);
        if (error instanceof LobbyFullError) return err(error.message, 400);
        if (error instanceof LobbyFinishedError) return err(error.message, 400);
        throw error;
    }
}

export async function getLobbyHandler(
    _request: NextRequest,
    code: string,
): Promise<NextResponse> {
    try {
        const state = await getCoopLobbyState(code);
        return ok(state);
    } catch (error) {
        if (error instanceof LobbyNotFoundError) return err(error.message, 404);
        throw error;
    }
}

export async function startGameHandler(
    request: NextRequest,
    code: string,
): Promise<NextResponse> {
    const parsed = playerTokenSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(
            parsed.error.issues[0]?.message ?? "Token joueur requis",
            400,
        );
    }
    try {
        const article = await startCoopGame(code, parsed.data.playerToken);
        return ok({ article });
    } catch (error) {
        if (error instanceof LobbyNotFoundError) return err(error.message, 404);
        if (error instanceof NotLeaderError) return err(error.message, 403);
        if (error instanceof GameAlreadyStartedError)
            return err(error.message, 400);
        throw error;
    }
}

export async function submitCoopGuessHandler(
    request: NextRequest,
    code: string,
): Promise<NextResponse> {
    const parsed = submitCoopGuessSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(parsed.error.issues[0]?.message ?? "Données invalides", 400);
    }
    const { playerToken, word } = parsed.data;

    try {
        const { guessResult, won } = await submitCoopGuess(
            code,
            playerToken,
            word,
        );
        return ok({ ...guessResult, won });
    } catch (error) {
        if (error instanceof LobbyNotFoundError) return err(error.message, 404);
        if (error instanceof GameNotStartedError)
            return err(error.message, 400);
        throw error;
    }
}

export async function leaveLobbyHandler(
    request: NextRequest,
    code: string,
): Promise<NextResponse> {
    const parsed = playerTokenSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(
            parsed.error.issues[0]?.message ?? "Token joueur requis",
            400,
        );
    }

    try {
        const result = await leaveLobby(code, parsed.data.playerToken);
        return ok(result);
    } catch (error) {
        if (error instanceof LobbyNotFoundError) return err(error.message, 404);
        throw error;
    }
}

export async function restartCoopGameHandler(
    request: NextRequest,
    code: string,
): Promise<NextResponse> {
    const parsed = playerTokenSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(
            parsed.error.issues[0]?.message ?? "Token joueur manquant",
            400,
        );
    }

    try {
        await restartCoopGame(code, parsed.data.playerToken);
        return ok({ success: true });
    } catch (error) {
        if (error instanceof LobbyNotFoundError) return err(error.message, 404);
        if (error instanceof NotLeaderError) return err(error.message, 403);
        if (error instanceof GameNotStartedError)
            return err(error.message, 400);
        throw error;
    }
}

export async function abandonCoopGameHandler(
    request: NextRequest,
    code: string,
): Promise<NextResponse> {
    const parsed = playerTokenSchema.safeParse(await request.json());
    if (!parsed.success) {
        return err(
            parsed.error.issues[0]?.message ?? "Token joueur manquant",
            400,
        );
    }

    try {
        await abandonCoopGame(code, parsed.data.playerToken);
        return ok({ success: true });
    } catch (error) {
        if (error instanceof LobbyNotFoundError) return err(error.message, 404);
        if (error instanceof NotLeaderError) return err(error.message, 403);
        if (error instanceof GameNotStartedError)
            return err(error.message, 400);
        throw error;
    }
}
