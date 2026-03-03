import { NextResponse } from "next/server";
import { getMaskedArticle } from "@/lib/game/game";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET(): Promise<NextResponse> {
    try {
        const article = await getMaskedArticle();
        return NextResponse.json(article, { headers: NO_CACHE_HEADERS });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Erreur interne";
        console.error("[api/game]", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
