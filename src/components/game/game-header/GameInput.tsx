import type React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface InputProps {
    input: string;
    onInputChange: (value: string) => void;
    onSubmit: (e?: React.FormEvent) => void;
    guessing: boolean;
}

export default function GameInput({
    input,
    onInputChange,
    onSubmit,
    guessing,
}: InputProps) {
    const letterCounts = input
        .trim()
        .split(/\s+/)
        .map((word) => (word.match(/[\p{L}\p{N}]/gu) ?? []).length)
        .filter((count) => count > 0);

    return (
        <form onSubmit={onSubmit} className="flex gap-2">
            <div className="relative min-w-0 flex-1 flex">
                <Input
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    readOnly={guessing}
                    placeholder="Devinez un mot…"
                    className="pr-12"
                />
                {letterCounts.length > 0 && (
                    <span
                        aria-hidden="true"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted tabular-nums pointer-events-none select-none"
                        title={`${letterCounts.join(" + ")} lettres`}
                    >
                        {letterCounts.join("+")}
                    </span>
                )}
            </div>
            <Button
                variant="primary"
                disabled={guessing || !input.trim()}
                className="shrink-0 px-4 sm:px-5"
            >
                {guessing ? "…" : "Deviner"}
            </Button>
        </form>
    );
}
