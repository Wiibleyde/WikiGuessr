"use client";

import { useState } from "react";
import type { LeaderboardCategoryId } from "@/types/leaderboard";
import Layout from "../ui/Layout";
import LeaderboardCategory from "./LeaderboardCategory";

const CATEGORY_IDS: LeaderboardCategoryId[] = [
    "daily",
    "win-streak",
    "best-guess",
    "most-wins",
];

export default function LeaderboardContent() {
    const [openCategories, setOpenCategories] = useState<Set<string>>(
        new Set(CATEGORY_IDS),
    );

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

    return (
        <Layout
            title="🏅 Classement"
            subtitle="Les meilleurs joueurs de WikiGuessr"
        >
            {CATEGORY_IDS.map((categoryId) => (
                <LeaderboardCategory
                    key={categoryId}
                    categoryId={categoryId}
                    isOpen={openCategories.has(categoryId)}
                    onToggle={() => toggleCategory(categoryId)}
                />
            ))}
        </Layout>
    );
}
