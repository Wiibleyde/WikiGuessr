import { type NextRequest, NextResponse } from "next/server";
import { checkGuess } from "@/lib/game";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { word } = await request.json();

        if (!word || typeof word !== "string") {
            return NextResponse.json(
                { error: "Mot manquant" },
                { status: 400 },
            );
        }

        const trimmed = word.trim();
        if (trimmed.length === 0 || trimmed.length > 100) {
            return NextResponse.json(
                { error: "Mot invalide" },
                { status: 400 },
            );
        }

        const result = await checkGuess(trimmed);
        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Erreur interne";
        console.error("[api/game/guess]", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
