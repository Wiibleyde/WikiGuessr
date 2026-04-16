"use client";

import { useCallback } from "react";
import { authClient } from "@/lib/auth/client";
import type { AuthUser } from "@/types/auth";

interface UseAuthResult {
    user: AuthUser | null;
    loading: boolean;
    login: (provider?: SocialProvider) => void;
    logout: () => Promise<void>;
}

type SocialProvider = Parameters<
    typeof authClient.signIn.social
>[0]["provider"];

export function useAuth(): UseAuthResult {
    const { data: session, isPending } = authClient.useSession();

    const user = (session?.user as AuthUser | undefined) ?? null;

    const login = useCallback((provider: SocialProvider = "discord") => {
        authClient.signIn.social({ provider });
    }, []);

    const logout = useCallback(async () => {
        await authClient.signOut();
    }, []);

    return { user, loading: isPending, login, logout };
}
