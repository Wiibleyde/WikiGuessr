"use client";

import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { useFetchLeaderboardCategory } from "@/lib/query";

const DAILY_LEADERBOARD_SIZE = 10;

export default function DailyLeaderboard() {
    const { data, isLoading } = useFetchLeaderboardCategory(
        "daily",
        1,
        DAILY_LEADERBOARD_SIZE,
    );

    if (isLoading || !data || data.entries.length === 0) return null;

    return (
        <section className="max-w-5xl mx-auto px-4 pt-4">
            <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-page border-b border-border text-sm font-semibold text-text-secondary">
                    {data.meta.icon} {data.meta.label}
                </div>
                <LeaderboardTable meta={data.meta} entries={data.entries} />
            </div>
        </section>
    );
}
