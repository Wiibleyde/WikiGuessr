import { normalizeWord } from "@/lib/game/normalize";
import {
    areMorphologicalVariants,
    areSemanticallySimilar,
    combinedSimilarity,
    getLemmas,
} from "@/lib/game/similarity";
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

const TOKEN_REGEX = /([\p{L}0-9]+)|(\n)|(\s+)|([^\s\p{L}0-9]+)/gu;

// Thresholds for the improved similarity algorithm
const REVEAL_THRESHOLD = 0.8; // Slightly lower due to better algorithm
const SEMANTIC_REVEAL_THRESHOLD = 1.0; // Exact match for semantic
const MORPHOLOGICAL_REVEAL_THRESHOLD = 0.9; // High confidence for variants
const MIN_FUZZY_LENGTH = 4; // Lowered from 5 to catch more words
const MAX_LENGTH_DIFF = 3; // Increased from 2 to be more forgiving

/**
 * Check if a guess matches a word using semantic or morphological analysis.
 * Returns the similarity score (0-1) if it's a match, or -1 if not a match.
 */
function checkSemanticMatch(
    guessNormalized: string,
    wordNormalized: string,
): number {
    // Check for semantic similarity (synonyms, related words)
    if (areSemanticallySimilar(guessNormalized, wordNormalized)) {
        return SEMANTIC_REVEAL_THRESHOLD;
    }

    // Check for morphological variants (plural, gender, conjugations)
    if (areMorphologicalVariants(guessNormalized, wordNormalized)) {
        return MORPHOLOGICAL_REVEAL_THRESHOLD;
    }

    return -1; // No semantic/morphological match
}

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

interface ArticleCache {
    maskedArticle: MaskedArticle;
    wordGroups: Map<string, WordPosition[]>;
    titleWords: InternalWord[];
    date: string;
}

let articleCache: ArticleCache | null = null;

interface WikiSection {
    title: string;
    content: string;
}

function buildArticleCache(
    title: string,
    sections: WikiSection[],
    date: string,
): ArticleCache {
    const { tokens: articleTitleTokens, words: titleWords } = tokenize(
        title,
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

    const maskedArticle: MaskedArticle = {
        articleTitleTokens,
        sections: maskedSections,
        totalWords,
        date,
    };

    const wordGroups = new Map<string, WordPosition[]>();

    for (const w of titleWords) {
        const pos: WordPosition = {
            section: -1,
            part: "title",
            wordIndex: w.index,
            display: w.display,
        };
        const existing = wordGroups.get(w.normalized);
        if (existing) existing.push(pos);
        else wordGroups.set(w.normalized, [pos]);
    }

    for (let i = 0; i < sections.length; i++) {
        const { words: stw } = tokenize(sections[i].title, `s${i}t-`);
        for (const w of stw) {
            const pos: WordPosition = {
                section: i,
                part: "title",
                wordIndex: w.index,
                display: w.display,
            };
            const existing = wordGroups.get(w.normalized);
            if (existing) existing.push(pos);
            else wordGroups.set(w.normalized, [pos]);
        }

        const { words: scw } = tokenize(sections[i].content, `s${i}c-`);
        for (const w of scw) {
            const pos: WordPosition = {
                section: i,
                part: "content",
                wordIndex: w.index,
                display: w.display,
            };
            const existing = wordGroups.get(w.normalized);
            if (existing) existing.push(pos);
            else wordGroups.set(w.normalized, [pos]);
        }
    }

    return { maskedArticle, wordGroups, titleWords, date };
}

async function getArticleCache(): Promise<ArticleCache> {
    const page = await ensureDailyWikiPage();
    const dateKey = page.date.toISOString().split("T")[0];

    if (articleCache && articleCache.date === dateKey) {
        return articleCache;
    }

    const sections = page.sections as unknown as WikiSection[];
    articleCache = buildArticleCache(page.title, sections, dateKey);
    return articleCache;
}

export async function getMaskedArticle(): Promise<MaskedArticle> {
    const cache = await getArticleCache();
    return cache.maskedArticle;
}

export async function checkGuess(word: string): Promise<GuessResult> {
    const normalizedGuess = normalizeWord(word.trim());
    if (!normalizedGuess) {
        return {
            found: false,
            word: "",
            positions: [],
            occurrences: 0,
            similarity: 0,
        };
    }

    const cache = await getArticleCache();
    const { wordGroups } = cache;

    // 1. Check for exact match
    const exactPositions = wordGroups.get(normalizedGuess);
    if (exactPositions && exactPositions.length > 0) {
        return {
            found: true,
            word: normalizedGuess,
            positions: exactPositions,
            occurrences: exactPositions.length,
            similarity: 1,
        };
    }

    // 2. Check lemmas (morphological variants like plural/singular)
    const guessLemmas = getLemmas(normalizedGuess);
    for (const lemma of guessLemmas) {
        if (lemma !== normalizedGuess) {
            const lemmaPositions = wordGroups.get(lemma);
            if (lemmaPositions && lemmaPositions.length > 0) {
                return {
                    found: true,
                    word: normalizedGuess,
                    positions: lemmaPositions,
                    occurrences: lemmaPositions.length,
                    similarity: MORPHOLOGICAL_REVEAL_THRESHOLD,
                };
            }
        }
    }

    // 3. Fuzzy matching with improved algorithms
    let bestSimilarity = 0;
    let bestMatch: { normalized: string; positions: WordPosition[] } | null =
        null;

    if (normalizedGuess.length >= MIN_FUZZY_LENGTH) {
        for (const [normalized, positions] of wordGroups) {
            if (normalized.length < MIN_FUZZY_LENGTH) continue;

            const lengthDiff = Math.abs(
                normalizedGuess.length - normalized.length,
            );
            if (lengthDiff > MAX_LENGTH_DIFF) continue;

            // Still prefer same first letter, but don't enforce it strictly
            const firstLetterMatch = normalizedGuess[0] === normalized[0];

            // Check semantic/morphological match first
            const semanticSim = checkSemanticMatch(normalizedGuess, normalized);
            if (semanticSim > 0 && semanticSim > bestSimilarity) {
                bestSimilarity = semanticSim;
                bestMatch = { normalized, positions };
            }

            // Use improved orthographic similarity
            const orthoSim = combinedSimilarity(normalizedGuess, normalized);
            // Add a small bonus if first letter matches (0.05 instead of multiplying)
            const adjustedSim = firstLetterMatch
                ? Math.min(orthoSim + 0.05, 1.0)
                : orthoSim;

            if (adjustedSim > bestSimilarity) {
                bestSimilarity = adjustedSim;
                if (adjustedSim >= REVEAL_THRESHOLD) {
                    bestMatch = { normalized, positions };
                }
            }
        }
    }

    if (bestMatch) {
        return {
            found: true,
            word: normalizedGuess,
            positions: bestMatch.positions,
            occurrences: bestMatch.positions.length,
            similarity: Math.min(bestSimilarity, 1.0), // Cap at 1.0
        };
    }

    return {
        found: false,
        word: normalizedGuess,
        positions: [],
        occurrences: 0,
        similarity: bestSimilarity,
    };
}

export async function getAllWordPositions(): Promise<WordPosition[]> {
    const cache = await getArticleCache();
    const allPositions: WordPosition[] = [];
    for (const positions of cache.wordGroups.values()) {
        for (const pos of positions) {
            allPositions.push(pos);
        }
    }
    return allPositions;
}

export async function verifyWin(guessedWords: string[]): Promise<boolean> {
    const cache = await getArticleCache();
    const normalizedGuesses = guessedWords.map(normalizeWord);

    return cache.titleWords.every((titleWord) => {
        for (const guess of normalizedGuesses) {
            // Exact match
            if (guess === titleWord.normalized) return true;

            // Check lemmas
            const guessLemmas = getLemmas(guess);
            const titleLemmas = getLemmas(titleWord.normalized);
            for (const gl of guessLemmas) {
                for (const tl of titleLemmas) {
                    if (gl === tl) return true;
                }
            }

            // Semantic match
            if (areSemanticallySimilar(guess, titleWord.normalized)) {
                return true;
            }

            // Orthographic fuzzy match
            if (
                guess.length >= MIN_FUZZY_LENGTH &&
                titleWord.normalized.length >= MIN_FUZZY_LENGTH &&
                Math.abs(guess.length - titleWord.normalized.length) <=
                    MAX_LENGTH_DIFF
            ) {
                const sim = combinedSimilarity(guess, titleWord.normalized);
                if (sim >= REVEAL_THRESHOLD) {
                    return true;
                }
            }
        }
        return false;
    });
}
