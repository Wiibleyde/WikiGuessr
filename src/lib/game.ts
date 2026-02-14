import type {
    GuessResult,
    MaskedArticle,
    MaskedSection,
    PunctuationToken,
    Token,
    WordPosition,
    WordToken,
} from "@/types/game";
import { ensureDailyWikiPage } from "./daily-wiki";

export type {
    Token,
    WordToken,
    PunctuationToken,
    MaskedSection,
    MaskedArticle,
    WordPosition,
    GuessResult,
};

function normalizeWord(word: string): string {
    return word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

const TOKEN_REGEX = /([a-zA-ZÀ-ÿ0-9]+)|(\n)|(\s+)|([^\sa-zA-ZÀ-ÿ0-9]+)/g;

interface InternalWord {
    normalized: string;
    display: string;
    index: number;
}

interface TokenizeResult {
    tokens: Token[];
    words: InternalWord[];
}

function tokenize(text: string, prefix = ""): TokenizeResult {
    const tokens: Token[] = [];
    const words: InternalWord[] = [];
    let wordIndex = 0;
    let tokenId = 0;

    const regex = new RegExp(TOKEN_REGEX.source, TOKEN_REGEX.flags);

    for (
        let match = regex.exec(text);
        match !== null;
        match = regex.exec(text)
    ) {
        if (match[1]) {
            tokens.push({
                type: "word",
                id: `${prefix}w${tokenId++}`,
                index: wordIndex,
                length: match[1].length,
            });
            words.push({
                normalized: normalizeWord(match[1]),
                display: match[1],
                index: wordIndex,
            });
            wordIndex++;
        } else {
            tokens.push({
                type: "punct",
                id: `${prefix}p${tokenId++}`,
                text: match[0],
            });
        }
    }

    return { tokens, words };
}

function findMatchingPositions(
    text: string,
    normalizedGuess: string,
    section: number,
    part: "title" | "content",
): WordPosition[] {
    const { words } = tokenize(text);
    return words
        .filter((w) => w.normalized === normalizedGuess)
        .map((w) => ({
            section,
            part,
            wordIndex: w.index,
            display: w.display,
        }));
}

export async function getMaskedArticle(): Promise<MaskedArticle> {
    const page = await ensureDailyWikiPage();
    const sections = page.sections as { title: string; content: string }[];

    const { tokens: articleTitleTokens, words: titleWords } = tokenize(
        page.title,
        "at-",
    );
    let totalWords = titleWords.length;

    const maskedSections: MaskedSection[] = sections.map((section, i) => {
        const { tokens: titleTokens, words: stw } = tokenize(
            section.title,
            `s${i}t-`,
        );
        const { tokens: contentTokens, words: scw } = tokenize(
            section.content,
            `s${i}c-`,
        );
        totalWords += stw.length + scw.length;
        return { titleTokens, contentTokens };
    });

    return {
        articleTitleTokens,
        sections: maskedSections,
        totalWords,
        date: page.date.toISOString().split("T")[0],
    };
}

export async function checkGuess(word: string): Promise<GuessResult> {
    const page = await ensureDailyWikiPage();
    const sections = page.sections as { title: string; content: string }[];

    const normalizedGuess = normalizeWord(word.trim());
    if (!normalizedGuess) {
        return { found: false, word: "", positions: [], occurrences: 0 };
    }

    const positions: WordPosition[] = [
        ...findMatchingPositions(page.title, normalizedGuess, -1, "title"),
        ...sections.flatMap((sec, i) => [
            ...findMatchingPositions(sec.title, normalizedGuess, i, "title"),
            ...findMatchingPositions(
                sec.content,
                normalizedGuess,
                i,
                "content",
            ),
        ]),
    ];

    return {
        found: positions.length > 0,
        word: normalizedGuess,
        positions,
        occurrences: positions.length,
    };
}
