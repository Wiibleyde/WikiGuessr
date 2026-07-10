import type {
    LeaderboardCategoryMeta,
    LeaderboardEntry,
} from "@/types/leaderboard";
import User from "../ui/User";

const RANK_BADGES: Record<number, string> = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
};

export default function LeaderBoardEntry({
    entry,
    meta,
}: {
    entry: LeaderboardEntry;
    meta: LeaderboardCategoryMeta;
}) {
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 transition-colors ${entry.rank <= 3 ? "bg-warning-light/40" : "hover:bg-page"}`}
        >
            {/* Rang */}
            <span className="w-8 text-center text-sm font-bold text-muted shrink-0">
                {RANK_BADGES[entry.rank] ?? `#${entry.rank}`}
            </span>

            {/* Avatar + nom */}
            <User name={entry.name} image={entry.image} pictureWidth={28} />

            {/* Valeur + détail — min-w-0 + break-words pour ne pas déborder
                sur mobile quand le détail (titre d'article…) est long */}
            <div className="ml-auto text-right min-w-0">
                <span className="text-sm font-semibold text-text whitespace-nowrap">
                    {`${entry.value} ${meta.valueLabel}`}
                </span>
                {entry.detail && (
                    <p className="text-xs text-muted mt-0.5 break-words">
                        {entry.detail}
                    </p>
                )}
            </div>
        </div>
    );
}
