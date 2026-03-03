import { NextResponse } from "next/server";
import { getCurrentServerDate } from "@/lib/game/game";

export const dynamic = "force-dynamic";

/**
 * GET /api/game/date — lightweight endpoint returning the current server UTC date.
 * Used by clients to detect day changes without fetching the full article.
 */
export async function GET(): Promise<NextResponse> {
    try {
        const date = await getCurrentServerDate();
        return NextResponse.json(
            { date },
            {
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate",
                },
            },
        );
    } catch (error) {
        console.error("[api/game/date]", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}
