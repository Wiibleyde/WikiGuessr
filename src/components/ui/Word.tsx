"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

const VARIANTS = {
    articleTitle: "bg-warning-light text-warning-text font-bold",
    default: "bg-success-light text-success-text",
} as const;

type WordVariant = keyof typeof VARIANTS;

interface WordProps {
    length: number;
    text?: string;
    variant?: WordVariant;
    isLastFound?: boolean;
}

export default function Word({
    length,
    text,
    variant = "default",
    isLastFound = false,
}: WordProps) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (text) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [text]);

    if (text) {
        return (
            <span
                className={cn(
                    "inline-block px-0.5 rounded",
                    VARIANTS[variant],
                    animate && "animate-reveal",
                    isLastFound && "ring-2 ring-warning ring-offset-1",
                )}
            >
                {text}
            </span>
        );
    }

    return (
        <span className="inline-flex flex-col items-center align-middle mx-px">
            <span
                className="bg-subtle rounded cursor-default"
                style={{ width: `${length}ch`, height: "1.15em" }}
                aria-hidden="true"
            />
            <span className="text-[0.55em] text-muted leading-none mt-px select-none">
                {length}
            </span>
        </span>
    );
}
