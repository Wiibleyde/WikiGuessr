import { beforeEach, describe, expect, it, mock } from "bun:test";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const getVictoriesGroupedByUserMock = mock();
const getBestScoreByUserMock = mock();
const getMostWinsMock = mock();

mock.module("@/lib/repositories/gameResultRepository", () => ({
    getVictoriesGroupedByUser: getVictoriesGroupedByUserMock,
    getBestScoreByUser: getBestScoreByUserMock,
    getMostWins: getMostWinsMock,
    createOrUpdateGameResult: mock(),
    getGameResultsByUserId: mock(),
    getTodayRankForUser: mock(),
}));

const getUserWhereIdInMock = mock();

mock.module("@/lib/repositories/userRepository", () => ({
    getUserWhereIdIn: getUserWhereIdInMock,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeVictoryRow(userId: string, dateIso: string) {
    return {
        userId,
        user: { name: `User ${userId}`, image: null },
        dailyWikiPage: { date: new Date(dateIso) },
    };
}

function makeBestScoreRow(
    userId: string,
    guessCount: number,
    hintsUsed: number,
    title = "Article",
    dateIso = "2026-01-01",
) {
    return {
        userId,
        guessCount,
        hintsUsed,
        user: { name: `User ${userId}`, image: null },
        dailyWikiPage: { title, date: new Date(dateIso) },
    };
}

function makeMostWinsRow(userId: string, count: number) {
    return { userId, _count: { id: count } };
}

function makeUser(id: string) {
    return { id, name: `User ${id}`, image: null };
}

// Build N distinct users, each with exactly one win-streak victory on consecutive days
function buildVictoryRows(n: number) {
    return Array.from({ length: n }, (_, i) => {
        const userId = `u${i + 1}`;
        const date = new Date(
            `2026-0${Math.floor(i / 28) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
        );
        return makeVictoryRow(userId, date.toISOString());
    });
}

// ─── Dynamic import ───────────────────────────────────────────────────────────

const { computeLeaderboardCategory } = await import(
    "@/lib/services/leaderboard/computeLeaderboard"
);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("computeLeaderboardCategory — most-wins", () => {
    beforeEach(() => {
        getMostWinsMock.mockReset();
        getUserWhereIdInMock.mockReset();
    });

    it("retourne la première page avec perPage=5", async () => {
        const rows = Array.from({ length: 12 }, (_, i) =>
            makeMostWinsRow(`u${i + 1}`, 12 - i),
        );
        const users = rows.map((r) => makeUser(r.userId));
        getMostWinsMock.mockResolvedValue(rows);
        getUserWhereIdInMock.mockResolvedValue(users);

        const result = await computeLeaderboardCategory("most-wins", 1, 5);

        expect(result.entries.length).toBe(5);
        expect(result.pagination.page).toBe(1);
        expect(result.pagination.perPage).toBe(5);
        expect(result.pagination.total).toBe(12);
        expect(result.pagination.totalPages).toBe(3);
    });

    it("retourne la dernière page (partielle)", async () => {
        const rows = Array.from({ length: 12 }, (_, i) =>
            makeMostWinsRow(`u${i + 1}`, 12 - i),
        );
        const users = rows.map((r) => makeUser(r.userId));
        getMostWinsMock.mockResolvedValue(rows);
        getUserWhereIdInMock.mockResolvedValue(users);

        const result = await computeLeaderboardCategory("most-wins", 3, 5);

        expect(result.entries.length).toBe(2); // 12 - 2*5 = 2
        expect(result.pagination.page).toBe(3);
        expect(result.pagination.total).toBe(12);
    });

    it("les rangs sont corrects sur la page 2", async () => {
        const rows = Array.from({ length: 10 }, (_, i) =>
            makeMostWinsRow(`u${i + 1}`, 10 - i),
        );
        const users = rows.map((r) => makeUser(r.userId));
        getMostWinsMock.mockResolvedValue(rows);
        getUserWhereIdInMock.mockResolvedValue(users);

        const result = await computeLeaderboardCategory("most-wins", 2, 5);

        expect(result.entries[0].rank).toBe(6);
        expect(result.entries[4].rank).toBe(10);
    });

    it("total >= entries.length", async () => {
        const rows = [makeMostWinsRow("u1", 5)];
        getMostWinsMock.mockResolvedValue(rows);
        getUserWhereIdInMock.mockResolvedValue([makeUser("u1")]);

        const result = await computeLeaderboardCategory("most-wins", 1, 5);

        expect(result.pagination.total).toBeGreaterThanOrEqual(
            result.entries.length,
        );
    });

    it("totalPages = ceil(total / perPage)", async () => {
        const rows = Array.from({ length: 7 }, (_, i) =>
            makeMostWinsRow(`u${i + 1}`, 7 - i),
        );
        const users = rows.map((r) => makeUser(r.userId));
        getMostWinsMock.mockResolvedValue(rows);
        getUserWhereIdInMock.mockResolvedValue(users);

        const result = await computeLeaderboardCategory("most-wins", 1, 5);

        expect(result.pagination.totalPages).toBe(
            Math.ceil(result.pagination.total / result.pagination.perPage),
        );
    });
});

describe("computeLeaderboardCategory — best-guess", () => {
    beforeEach(() => {
        getBestScoreByUserMock.mockReset();
    });

    it("retourne les bonnes métadonnées de pagination", async () => {
        const rows = Array.from({ length: 8 }, (_, i) =>
            makeBestScoreRow(`u${i + 1}`, i + 1, 0),
        );
        getBestScoreByUserMock.mockResolvedValue(rows);

        const result = await computeLeaderboardCategory("best-guess", 1, 5);

        expect(result.pagination.total).toBe(8);
        expect(result.pagination.totalPages).toBe(2);
        expect(result.entries.length).toBe(5);
    });

    it("page 2 retourne les entrées restantes", async () => {
        const rows = Array.from({ length: 8 }, (_, i) =>
            makeBestScoreRow(`u${i + 1}`, i + 1, 0),
        );
        getBestScoreByUserMock.mockResolvedValue(rows);

        const result = await computeLeaderboardCategory("best-guess", 2, 5);

        expect(result.entries.length).toBe(3);
        expect(result.pagination.page).toBe(2);
    });
});

describe("computeLeaderboardCategory — win-streak", () => {
    beforeEach(() => {
        getVictoriesGroupedByUserMock.mockReset();
    });

    it("retourne les bonnes métadonnées de pagination", async () => {
        const rows = buildVictoryRows(9);
        getVictoriesGroupedByUserMock.mockResolvedValue(rows);

        const result = await computeLeaderboardCategory("win-streak", 1, 5);

        expect(result.pagination.total).toBe(9);
        expect(result.pagination.totalPages).toBe(2);
        expect(result.entries.length).toBe(5);
    });
});

describe("computeLeaderboardCategory — catégorie invalide", () => {
    it("lève une erreur pour une catégorie inconnue", async () => {
        await expect(
            // biome-ignore lint/suspicious/noExplicitAny: intentional invalid input for test
            computeLeaderboardCategory("invalid-category" as any, 1, 5),
        ).rejects.toThrow();
    });
});
