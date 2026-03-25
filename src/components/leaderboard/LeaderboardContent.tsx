"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import LeaderboardCategory from "@/components/leaderboard/LeaderboardCategory";
import ErrorMessage from "@/components/ui/Error";
import Loader from "@/components/ui/Loader";
import type { LeaderboardCategoryData } from "@/types/leaderboard";
import { fetcher } from "@/utils/fetcher";
import Layout from "../ui/Layout";

export default function LeaderboardContent() {
    const initializedRef = useRef(false);
    const [openCategories, setOpenCategories] = useState<Set<string>>(
        new Set(),
    );

    const { data, error, isLoading } = useSWR<{
        categories: LeaderboardCategoryData[];
    }>("/api/leaderboard", fetcher, {
        revalidateOnFocus: false,
        onSuccess: (data) => {
            if (!initializedRef.current) {
                setOpenCategories(
                    new Set(data.categories.map((c) => c.meta.id)),
                );
                initializedRef.current = true;
            }
        },
    });

    const categories = data?.categories ?? [];

    function toggleCategory(id: string): void {
        setOpenCategories((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    if (isLoading) return <Loader message="Chargement du classement…" />;

    if (error)
        return <ErrorMessage message="Impossible de charger le classement." />;

    return (
        <Layout
            title="🏅 Classement"
            subtitle="Les meilleurs joueurs de WikiGuessr"
        >
            {categories.length === 0 ? (
                <p className="text-center text-gray-400 text-sm">
                    Aucun classement disponible pour le moment.
                </p>
            ) : (
                categories.map((cat) => (
                    <LeaderboardCategory
                        key={cat.meta.id}
                        data={cat}
                        isOpen={openCategories.has(cat.meta.id)}
                        onToggle={() => toggleCategory(cat.meta.id)}
                    />
                ))
            )}
        </Layout>
    );
}
