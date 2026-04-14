"use client";

import type {
    LeaderboardCategoryMeta,
    LeaderboardEntry,
} from "@/types/leaderboard";
import LeaderBoardEntry from "./LeaderBoardEntry";

interface LeaderboardTableProps {
    meta: LeaderboardCategoryMeta;
    entries: LeaderboardEntry[];
}

export default function LeaderboardTable({
    meta,
    entries,
}: LeaderboardTableProps) {
    if (entries.length === 0) {
        return (
            <p className="text-center text-muted text-sm py-6">
                Aucune donnée pour ce classement.
            </p>
        );
    }

    return (
        <div className="divide-y divide-subtle">
            {entries.map((entry) => (
                <LeaderBoardEntry
                    key={entry.userId}
                    entry={entry}
                    meta={meta}
                />
            ))}
        </div>
    );
}
