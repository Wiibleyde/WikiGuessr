import {
    getArticleLtDate,
    getArticleLtDatePaginated,
    getHistoricAvailableDates,
} from "@/lib/repositories/articleRepository";
import type { PageEntry, PaginatedHistoricResponse } from "@/types/historic";
import { toDateKey } from "@/utils/date";

export async function computeHistoricPages(): Promise<PageEntry[]> {
    const today = new Date();
    const results = await getArticleLtDate(today);

    return results.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.date,
        url: r.url,
        resolvedCount: r._count.gameResults,
    }));
}

export async function computeHistoricPagesPaginated(
    page: number,
    perPage: number,
    filterDate?: Date,
): Promise<PaginatedHistoricResponse> {
    const today = new Date();
    const skip = (page - 1) * perPage;
    const { rows, total } = await getArticleLtDatePaginated(
        today,
        skip,
        perPage,
        filterDate,
    );

    const entries: PageEntry[] = rows.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.date,
        url: r.url,
        resolvedCount: r._count.gameResults,
    }));

    const totalPages = Math.max(1, Math.ceil(total / perPage));
    return { entries, pagination: { total, page, perPage, totalPages } };
}

export async function computeHistoricAvailableDates(): Promise<string[]> {
    const today = new Date();
    const dates = await getHistoricAvailableDates(today);
    return dates.map((d) => toDateKey(d));
}
