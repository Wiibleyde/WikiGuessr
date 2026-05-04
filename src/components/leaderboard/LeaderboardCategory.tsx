"use client";

import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { useFetchLeaderboardCategory } from "@/lib/query";
import type { LeaderboardCategoryId } from "@/types/leaderboard";
import { cn } from "@/utils/cn";
import { plural } from "@/utils/helper";
import Badge from "../ui/Badge";
import Pagination from "../ui/Pagination";
import LeaderboardTable from "./LeaderboardTable";

interface LeaderboardCategoryProps {
    categoryId: LeaderboardCategoryId;
    isOpen: boolean;
    onToggle: () => void;
}

export default function LeaderboardCategory({
    categoryId,
    isOpen,
    onToggle,
}: LeaderboardCategoryProps) {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useFetchLeaderboardCategory(categoryId, page);

    const meta = data?.meta;
    const entries = data?.entries ?? [];
    const pagination = data?.pagination;
    const totalPages = pagination?.totalPages ?? 1;

    return (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-page transition-colors"
            >
                <div className="flex items-center gap-2">
                    {meta ? (
                        <>
                            <span className="text-lg">{meta.icon}</span>
                            <div className="text-left">
                                <h3 className="font-semibold text-text font-(family-name:--font-heading) text-sm">
                                    {meta.label}
                                </h3>
                                <p className="text-xs text-muted">
                                    {meta.description}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="h-8 w-48 rounded bg-subtle animate-pulse" />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {pagination && (
                        <Badge color="primary">
                            {plural(pagination.total, "joueur", "joueurs")}
                        </Badge>
                    )}
                    <IoIosArrowUp
                        className={cn(
                            "w-4 h-4 text-muted transition-transform duration-300",
                            !isOpen && "rotate-180",
                        )}
                        role="img"
                        aria-label="Basculer la catégorie"
                    />
                </div>
            </button>

            {isOpen && (
                <div>
                    {isLoading ? (
                        <div className="flex justify-center py-6">
                            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        </div>
                    ) : (
                        meta && (
                            <LeaderboardTable meta={meta} entries={entries} />
                        )
                    )}

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        className="px-4 py-3 border-t border-border"
                    />
                </div>
            )}
        </div>
    );
}
