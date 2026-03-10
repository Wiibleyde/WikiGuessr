import { NextResponse } from "next/server";
import env from "@/env";
import { setStateCookie } from "@/lib/auth/auth";
import { generateState } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_REDIRECT_URI) {
        return NextResponse.json(
            { error: "Configuration Discord manquante" },
            { status: 500 },
        );
    }

    const state = generateState();

    const params = new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        redirect_uri: env.DISCORD_REDIRECT_URI,
        response_type: "code",
        scope: "identify",
        state,
    });

    const response = NextResponse.redirect(
        `${env.DISCORD_AUTHORIZE_URL}?${params.toString()}`,
    );

    setStateCookie(response, state);

    return response;
}
