import {
    computeHistoricAvailableDates,
    computeHistoricPages,
    computeHistoricPagesPaginated,
} from "@/lib/services/historic/computeHistoricPages";
import type { PageEntry, PaginatedHistoricResponse } from "@/types/historic";

export async function getHistoric(): Promise<PageEntry[]> {
    return computeHistoricPages();
}

export async function getHistoricPaginated(
    page: number,
    perPage: number,
    filterDate?: Date,
): Promise<PaginatedHistoricResponse> {
    return computeHistoricPagesPaginated(page, perPage, filterDate);
}

export async function getHistoricAvailableDates(): Promise<string[]> {
    return computeHistoricAvailableDates();
}
