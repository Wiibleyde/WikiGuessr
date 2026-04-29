"use client";

import type { MaskedArticle, RevealedMap } from "@/types/game";
import Section from "./Section";
import TokenList from "./TokenList";

interface ArticleViewProps {
    article: MaskedArticle;
    revealed: RevealedMap;
    lastFoundKeys?: Set<string>;
}

export default function ArticleView({
    article,
    revealed,
    lastFoundKeys,
}: ArticleViewProps) {
    return (
        <main className="flex-1 min-w-0 space-y-4">
            <div className="p-5 bg-surface rounded-xl shadow-sm border border-border">
                <h2 className="text-2xl font-bold leading-[2.2] font-(family-name:--font-heading)">
                    <TokenList
                        tokens={article.sections[0].titleTokens}
                        section={0}
                        part="title"
                        revealed={revealed}
                        lastFoundKeys={lastFoundKeys}
                    />
                </h2>
            </div>

            {article.sections.map((sec, index) => (
                <Section
                    key={sec.contentTokens[0]?.id ?? `section-${index}`}
                    sectionIndex={index}
                    titleTokens={index === 0 ? [] : sec.titleTokens}
                    contentTokens={sec.contentTokens}
                    revealed={revealed}
                    lastFoundKeys={lastFoundKeys}
                />
            ))}
        </main>
    );
}
