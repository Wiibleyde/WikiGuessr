import axios from "axios";

export async function fetcher<T>(url: string): Promise<T> {
    try {
        const response = await axios.get<T>(url);
        return response.data;
    } catch {
        throw new Error("Erreur serveur");
    }
}

export async function fetchWikiPagePart<T>(url: string): Promise<T> {
    try {
        const response = await axios.get<T>(url, {
            headers: {
                // Requis sinon 403 sur l'api de Wikipédia
                "User-Agent": "WikiGuessr/1.0 (https://wikiguessr.com)",
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(
                `[wiki] HTTP ${error.response.status} fetching ${url}`,
            );
        }
        throw error;
    }
}