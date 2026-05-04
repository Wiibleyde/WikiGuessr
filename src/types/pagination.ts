/** Métadonnées de pagination partagées entre les différentes réponses paginées */
export interface PaginationMeta {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}
