import { describe, expect, it, mock } from "bun:test";
import { NextRequest } from "next/server";

const getSessionUserMock = mock();
const ensureDailyWikiPageMock = mock();
const findUniqueMock = mock();
const upsertMock = mock();

mock.module("@/lib/auth/auth", () => ({
    getSessionUser: getSessionUserMock,
}));

mock.module("@/lib/game/daily-wiki", () => ({
    ensureDailyWikiPage: ensureDailyWikiPageMock,
}));

mock.module("@/lib/prisma", () => ({
    prisma: {
        gameState: {
            findUnique: findUniqueMock,
            upsert: upsertMock,
        },
    },
}));

const { GET, PUT } = await import("./route");

describe("GET /api/game/state", () => {
    it("retourne 401 si non authentifié", async () => {
        getSessionUserMock.mockResolvedValue(null);

        const response = await GET();
        expect(response.status).toBe(401);
    });

    it("retourne state null si aucun état n'existe", async () => {
        getSessionUserMock.mockResolvedValue({ id: "user-1" });
        ensureDailyWikiPageMock.mockResolvedValue({ id: "page-1" });
        findUniqueMock.mockResolvedValue(null);

        const response = await GET();
        const body = (await response.json()) as { state: null };

        expect(response.status).toBe(200);
        expect(body.state).toBeNull();
    });
});

describe("PUT /api/game/state", () => {
    function createRequest(body: unknown): NextRequest {
        return new NextRequest("http://localhost/api/game/state", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    }

    it("retourne 401 si non authentifié", async () => {
        getSessionUserMock.mockResolvedValue(null);

        const response = await PUT(
            createRequest({ guesses: [], revealed: {} }),
        );
        expect(response.status).toBe(401);
    });

    it("retourne 400 si payload invalide", async () => {
        getSessionUserMock.mockResolvedValue({ id: "user-1" });

        const response = await PUT(
            createRequest({ guesses: "bad", revealed: {} }),
        );
        const body = (await response.json()) as { error: string };

        expect(response.status).toBe(400);
        expect(body.error).toBe("Données invalides");
    });

    it("upsert l'état courant quand payload valide", async () => {
        getSessionUserMock.mockResolvedValue({ id: "user-1" });
        ensureDailyWikiPageMock.mockResolvedValue({ id: "page-1" });
        upsertMock.mockResolvedValue({});

        const response = await PUT(
            createRequest({
                guesses: [
                    {
                        word: "tour",
                        found: true,
                        occurrences: 1,
                        similarity: 1,
                    },
                ],
                revealed: { "-1:title:0": "Tour" },
                saved: true,
                revealedImages: ["https://example.com/img.jpg"],
            }),
        );
        const body = (await response.json()) as { success: boolean };

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(upsertMock).toHaveBeenCalled();
    });
});
