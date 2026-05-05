"use client";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { cn } from "@/utils/cn";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    page,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div
            className={cn("flex items-center justify-center gap-1", className)}
        >
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="cursor-pointer p-1 rounded hover:bg-page disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Page précédente"
            >
                <IoIosArrowBack className="w-4 h-4 text-muted" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onPageChange(n)}
                    className={cn(
                        "cursor-pointer w-7 h-7 rounded text-xs font-medium transition-colors",
                        n === page
                            ? "bg-primary text-white"
                            : "hover:bg-page text-muted",
                    )}
                >
                    {n}
                </button>
            ))}

            <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="cursor-pointer p-1 rounded hover:bg-page disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Page suivante"
            >
                <IoIosArrowForward className="w-4 h-4 text-muted" />
            </button>
        </div>
    );
}
