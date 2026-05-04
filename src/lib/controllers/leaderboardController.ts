import type { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getLeaderboard,
    getLeaderboardCategory,
} from "@/lib/services/leaderboardService";
import type {
    LeaderboardCategoryId,
    LeaderboardResponse,
    PaginatedLeaderboardCategoryData,
} from "@/types/leaderboard";
import { err, ok } from "@/utils/response";

export async function getLeaderboardHandler(
    _request: NextRequest,
): Promise<NextResponse> {
    const categories = await getLeaderboard();
    const response: LeaderboardResponse = { categories };
    return ok(response);
}

const categoryQuerySchema = z.object({
    category: z.enum(["win-streak", "best-guess", "most-wins"]),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(50).default(5),
});

export async function getLeaderboardCategoryHandler(
    request: NextRequest,
): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const raw = {
        category: searchParams.get("category") ?? undefined,
        page: searchParams.get("page") ?? undefined,
        perPage: searchParams.get("perPage") ?? undefined,
    };

    const parsed = categoryQuerySchema.safeParse(raw);
    if (!parsed.success) {
        return err(
            `Paramètres invalides: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
            400,
        );
    }

    const { category, page, perPage } = parsed.data;
    const data: PaginatedLeaderboardCategoryData = await getLeaderboardCategory(
        category as LeaderboardCategoryId,
        page,
        perPage,
    );
    return ok(data);
}
