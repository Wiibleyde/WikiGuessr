import Word from "@/components/ui/Word";
import type { RevealedMap, Token } from "@/types/game";
import { posKey } from "@/utils/helper";

interface TokenListProps {
    tokens: Token[];
    section: number;
    part: "title" | "content";
    revealed: RevealedMap;
    lastFoundKeys?: Set<string>;
}

export default function TokenList({
    tokens,
    section,
    part,
    revealed,
    lastFoundKeys,
}: TokenListProps) {
    return (
        <>
            {tokens.map((token) => {
                if (token.type === "punct") {
                    if (token.text === "\n") return <br key={token.id} />;
                    return (
                        <span key={token.id} className="text-muted">
                            {token.text}
                        </span>
                    );
                }

                const key = posKey(section, part, token.index);
                const displayText = revealed[key];

                return (
                    <Word
                        key={token.id}
                        length={token.length}
                        text={displayText}
                        variant="default"
                        isLastFound={lastFoundKeys?.has(key)}
                    />
                );
            })}
        </>
    );
}
