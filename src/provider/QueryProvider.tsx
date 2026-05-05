"use client";
import {
    environmentManager,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

type QueryProviderProps = {
    children: ReactNode;
};

const makeQueryClient = (): QueryClient =>
    new QueryClient({
        defaultOptions: {
            queries: {
                gcTime: 1000 * 60 * 5, // 5 minutes
                staleTime: 1000 * 60, // 1 minute
                retry: 1,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: 1,
            },
        },
    });

let browserQueryClient: QueryClient | undefined;

const getQueryClient = (): QueryClient => {
    if (environmentManager.isServer()) {
        return makeQueryClient();
    }
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
};

const QueryProvider = ({ children }: QueryProviderProps) => {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default QueryProvider;
