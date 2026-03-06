"use client";

import axios from "axios";
import { useCallback } from "react";
import useSWR from "swr";
import type { AuthUser } from "@/types/auth";

const authFetcher = async (url: string): Promise<{ user: AuthUser | null }> => {
    try {
        const response = await axios.get<{ user: AuthUser | null }>(url);
        return response.data;
    } catch {
        return { user: null };
    }
};

export function useAuth() {
    const { data, isLoading, mutate } = useSWR<{ user: AuthUser | null }>(
        "/api/auth/me",
        authFetcher,
        { revalidateOnFocus: false },
    );

    const user = data?.user ?? null;

    const login = useCallback(() => {
        window.location.href = "/api/auth/login";
    }, []);

    const logout = useCallback(async () => {
        await axios.post("/api/auth/logout");
        mutate({ user: null }, { revalidate: false });
    }, [mutate]);

    return { user, loading: isLoading, login, logout };
}
