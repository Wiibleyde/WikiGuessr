import {
    computeLeaderboard,
    computeLeaderboardCategory,
} from "@/lib/services/leaderboard/computeLeaderboard";
import type {
    LeaderboardCategoryData,
    LeaderboardCategoryId,
    PaginatedLeaderboardCategoryData,
} from "@/types/leaderboard";

export async function getLeaderboard(): Promise<LeaderboardCategoryData[]> {
    return computeLeaderboard();
}

export async function getLeaderboardCategory(
    categoryId: LeaderboardCategoryId,
    page: number,
    perPage: number,
): Promise<PaginatedLeaderboardCategoryData> {
    return computeLeaderboardCategory(categoryId, page, perPage);
}
