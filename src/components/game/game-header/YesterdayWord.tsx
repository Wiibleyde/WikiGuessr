"use client";

import useSWR from "swr";
import { fetchYesterdayWord } from "@/lib/queries";

export default function YesterdayWord() {
    const { data: title } = useSWR<string | null>(
        "yesterday-word",
        fetchYesterdayWord,
        {
            revalidateOnFocus: false,
        },
    );

    if (!title) return null;

    return (
        <span className="text-sm text-muted">
            Hier : <span className="font-medium text-text">{title}</span>
        </span>
    );
}
