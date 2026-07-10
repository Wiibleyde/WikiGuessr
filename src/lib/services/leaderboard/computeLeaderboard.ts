import { HINT_PENALTY } from "@/constants/game";
import { ensureDailyWikiPage } from "@/lib/game/daily-wiki";
import {
    getBestScoreByUser,
    getMostWins,
    getTodayWinners,
    getVictoriesGroupedByUser,
} from "@/lib/repositories/gameResultRepository";
import { getUserWhereIdIn } from "@/lib/repositories/userRepository";
import type {
    LeaderboardCategoryData,
    LeaderboardCategoryId,
    LeaderboardCategoryMeta,
    LeaderboardEntry,
    PaginatedLeaderboardCategoryData,
} from "@/types/leaderboard";

const LEADERBOARD_LIMIT = 20;

export const LEADERBOARD_DEFAULT_PER_PAGE = 5;

const CATEGORIES: LeaderboardCategoryMeta[] = [
    {
        id: "daily",
        label: "Classement du jour",
        description: "Les premiers à avoir trouvé l'article du jour",
        icon: "📅",
        valueLabel: "essais",
        sortOrder: "asc",
    },
    {
        id: "win-streak",
        label: "Meilleure série",
        description:
            "Le plus grand nombre de jours consécutifs avec une victoire",
        icon: "🔥",
        valueLabel: "jours",
        sortOrder: "desc",
    },
    {
        id: "best-guess",
        label: "Meilleure performance",
        description: "Le meilleur score (essais + pénalités d'indices)",
        icon: "🎯",
        valueLabel: "score",
        sortOrder: "asc",
    },
    {
        id: "most-wins",
        label: "Plus de victoires",
        description: "Le plus grand nombre total de victoires",
        icon: "🏆",
        valueLabel: "victoires",
        sortOrder: "desc",
    },
];

type CategoryComputer = () => Promise<LeaderboardEntry[]>;

// Classement du jour : ordre d'arrivée (createdAt), cohérent avec le rang
// affiché dans la bannière de victoire (getTodayRankForUser).
async function computeDaily(): Promise<LeaderboardEntry[]> {
    const page = await ensureDailyWikiPage();
    const results = await getTodayWinners(page.id);

    return results.map((r, i) => ({
        rank: i + 1,
        userId: r.userId,
        name: r.user.name,
        image: r.user.image,
        value: r.guessCount,
        detail:
            r.hintsUsed > 0
                ? `${r.hintsUsed} indice${r.hintsUsed !== 1 ? "s" : ""}`
                : undefined,
    }));
}

async function computeWinStreak(): Promise<LeaderboardEntry[]> {
    const results = await getVictoriesGroupedByUser();

    const byUser = new Map<
        string,
        {
            name: string;
            image: string | null;
            dates: Date[];
        }
    >();

    for (const r of results) {
        let entry = byUser.get(r.userId);
        if (!entry) {
            entry = {
                name: r.user.name,
                image: r.user.image,
                dates: [],
            };
            byUser.set(r.userId, entry);
        }
        entry.dates.push(r.dailyWikiPage.date);
    }

    const streaks: {
        userId: string;
        name: string;
        image: string | null;
        streak: number;
        from: string;
        to: string;
    }[] = [];

    for (const [userId, data] of byUser) {
        const sorted = data.dates.map((d) => d.getTime()).sort((a, b) => a - b);
        const unique = [
            ...new Set(sorted.map((t) => Math.floor(t / 86400000))),
        ];

        let maxStreak = 1;
        let currentStreak = 1;
        let maxStart = 0;
        let maxEnd = 0;
        let currentStart = 0;

        for (let i = 1; i < unique.length; i++) {
            if (unique[i] - unique[i - 1] === 1) {
                currentStreak++;
            } else {
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                    maxStart = currentStart;
                    maxEnd = i - 1;
                }
                currentStreak = 1;
                currentStart = i;
            }
        }

        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
            maxStart = currentStart;
            maxEnd = unique.length - 1;
        }

        const fromDate = new Date(unique[maxStart] * 86400000);
        const toDate = new Date(unique[maxEnd] * 86400000);

        streaks.push({
            userId,
            name: data.name,
            image: data.image,
            streak: maxStreak,
            from: fromDate.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
            }),
            to: toDate.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
            }),
        });
    }

    streaks.sort((a, b) => b.streak - a.streak);

    return streaks.map((s, i) => ({
        rank: i + 1,
        userId: s.userId,
        name: s.name,
        image: s.image,
        value: s.streak,
        detail: s.streak > 1 ? `du ${s.from} au ${s.to}` : undefined,
    }));
}

async function computeBestGuess(): Promise<LeaderboardEntry[]> {
    const results = await getBestScoreByUser();
    const best = new Map<string, LeaderboardEntry & { rawValue: number }>();

    for (const r of results) {
        const score = r.guessCount + r.hintsUsed * HINT_PENALTY;
        const existing = best.get(r.userId);
        if (!existing || score < existing.rawValue) {
            const date = r.dailyWikiPage.date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            const detail =
                r.hintsUsed > 0
                    ? `${r.dailyWikiPage.title} (${date}) — ${r.guessCount} essai${r.guessCount !== 1 ? "s" : ""} + ${r.hintsUsed} indice${r.hintsUsed !== 1 ? "s" : ""}`
                    : `${r.dailyWikiPage.title} (${date})`;

            best.set(r.userId, {
                rank: 0,
                userId: r.userId,
                name: r.user.name,
                image: r.user.image,
                value: score,
                detail,
                rawValue: score,
            });
        }
    }

    const sorted = [...best.values()].sort((a, b) => a.rawValue - b.rawValue);

    return sorted.map((e, i) => ({
        rank: i + 1,
        userId: e.userId,
        name: e.name,
        image: e.image,
        value: e.value,
        detail: e.detail,
    }));
}

async function computeMostWins(): Promise<LeaderboardEntry[]> {
    const results = await getMostWins();
    const userIds = results.map((r) => r.userId);
    const users = await getUserWhereIdIn(userIds);
    const userMap = new Map(users.map((u) => [u.id, u]));

    return results.map((r, i) => {
        const user = userMap.get(r.userId);
        return {
            rank: i + 1,
            userId: r.userId,
            name: user?.name ?? "Inconnu",
            image: user?.image ?? null,
            value: r._count.id,
        };
    });
}

export async function computeLeaderboardCategory(
    categoryId: LeaderboardCategoryId,
    page: number,
    perPage: number,
): Promise<PaginatedLeaderboardCategoryData> {
    const meta = CATEGORIES.find((c) => c.id === categoryId);
    if (!meta) {
        throw new Error(`Unknown leaderboard category: ${categoryId}`);
    }

    const compute = COMPUTERS[categoryId];
    const allEntries = await compute();
    const total = allEntries.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * perPage;
    const sliced = allEntries.slice(start, start + perPage);
    const entries = sliced.map((e, i) => ({
        ...e,
        rank: start + i + 1,
    }));

    return {
        meta,
        entries,
        pagination: { total, page: safePage, perPage, totalPages },
    };
}

const COMPUTERS: Record<string, CategoryComputer> = {
    daily: computeDaily,
    "win-streak": computeWinStreak,
    "best-guess": computeBestGuess,
    "most-wins": computeMostWins,
};

export async function computeLeaderboard(): Promise<LeaderboardCategoryData[]> {
    const results: LeaderboardCategoryData[] = [];

    for (const meta of CATEGORIES) {
        const compute = COMPUTERS[meta.id];
        if (!compute) continue;
        const allEntries = await compute();
        const entries = allEntries.slice(0, LEADERBOARD_LIMIT);
        results.push({ meta, entries });
    }

    return results;
}

export { CATEGORIES };
