import type { PaginationMeta } from "./pagination";

/** Une entrée dans l'historique */
export interface PageEntry {
    id: number;
    title: string;
    date: Date;
    url: string;
    resolvedCount: number;
}

/** Réponse paginée de /api/historic/paginated */
export interface PaginatedHistoricResponse {
    entries: PageEntry[];
    pagination: PaginationMeta;
}
