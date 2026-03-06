import axios from "axios";

export async function fetcher<T>(url: string): Promise<T> {
    try {
        const response = await axios.get<T>(url);
        return response.data;
    } catch {
        throw new Error("Erreur serveur");
    }
}
