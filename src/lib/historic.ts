import type { PageEntry } from "@/types/historic";
import { getArticleLtDate } from "./repositories/articleRepository";

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
