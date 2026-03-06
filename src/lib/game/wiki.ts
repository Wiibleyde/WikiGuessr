import {
    GENERIC_IMAGE_PATTERNS,
    IGNORED_SECTIONS,
    WIKI_API,
} from "@/lib/constants/wiki";
import type {
    ArticleApiResponse,
    ImageApiResponse,
    PageData,
    RandomPageResponse,
    WikiPage,
    WikiSection,
} from "@/types/wiki";
import { fetchWikiPagePart } from "@/utils/fetcher";

function limitTo2Paragraphs(
    text: string,
    maxChars = 500,
    maxParagraphs = 2,
): string {
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

    if (paragraphs.length === 0) return "";

    const result: string[] = [];
    let totalLength = 0;

    for (const paragraph of paragraphs) {
        const trimmed = paragraph.trim();
        result.push(trimmed);
        totalLength += trimmed.length;

        if (totalLength >= maxChars || result.length >= maxParagraphs) {
            break;
        }
    }

    return result.join("\n\n");
}

function parseWikiSections(content: string): WikiSection[] {
    const sections: WikiSection[] = [];
    const sectionRegex = /^==\s*([^=]+?)\s*==\s*$/gm;
    const matches = [...content.matchAll(sectionRegex)];

    if (matches.length === 0) {
        return [{ title: "Introduction", content: content.trim() }];
    }

    const introContent = content.substring(0, matches[0].index ?? 0).trim();
    if (introContent) {
        sections.push({
            title: "Introduction",
            content: limitTo2Paragraphs(introContent),
        });
    }

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const sectionTitle = match[1].trim();

        if (!sectionTitle || /^[=\s]+$/.test(sectionTitle)) continue;
        if (
            IGNORED_SECTIONS.some((s) => sectionTitle.toLowerCase().includes(s))
        )
            continue;

        const startIndex = (match.index ?? 0) + match[0].length;
        const endIndex =
            i < matches.length - 1
                ? (matches[i + 1].index ?? content.length)
                : content.length;

        let sectionContent = content.substring(startIndex, endIndex).trim();
        sectionContent = sectionContent
            .replace(/^=+\s*[^=]*?\s*=+$/gm, "")
            .trim();

        if (sectionContent.replace(/[=\s\n]+/g, "").length >= 20) {
            sections.push({
                title: sectionTitle,
                content: limitTo2Paragraphs(sectionContent),
            });
        }

        if (sections.length >= 2) {
            break;
        }
    }

    return sections;
}

/**
 * Filtre les images génériques (icônes, logos, SVG de maintenance, etc.)
 */
function filterGenericImages(imageUrls: string[]): string[] {
    return imageUrls.filter((url) => {
        const fileName = url.split("/").pop()?.toLowerCase() ?? "";
        return !GENERIC_IMAGE_PATTERNS.some((pattern) =>
            pattern.test(fileName),
        );
    });
}

async function fetchRandomTitle(): Promise<string | undefined> {
    const data = await fetchWikiPagePart<RandomPageResponse>(
        `${WIKI_API}?action=query&format=json&list=random&rnnamespace=0&rnlimit=1`,
    );
    return data.query?.random?.[0]?.title;
}

async function fetchPageData(title: string): Promise<PageData | undefined> {
    const data = await fetchWikiPagePart<ArticleApiResponse>(
        `${WIKI_API}?action=query&format=json&titles=${encodeURIComponent(title)}&prop=extracts|images|info&inprop=url&explaintext=true&imlimit=500`,
    );
    const pages = data.query?.pages;
    if (!pages) return undefined;
    return Object.values(pages)[0];
}

async function fetchImageUrls(imageTitles: string[]): Promise<string[]> {
    if (imageTitles.length === 0) return [];
    const data = await fetchWikiPagePart<ImageApiResponse>(
        `${WIKI_API}?action=query&format=json&titles=${encodeURIComponent(imageTitles.join("|"))}&prop=imageinfo&iiprop=url`,
    );
    return Object.values(data.query?.pages ?? {})
        .map((p) => p.imageinfo?.[0]?.url)
        .filter((url): url is string => !!url);
}

export async function fetchRandomWikiPage(
    minContentLength = 1000,
    maxAttempts = 25,
): Promise<WikiPage> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const title = await fetchRandomTitle();
            if (!title) continue;

            const page = await fetchPageData(title);
            const content = page?.extract ?? "";
            if (!page || content.length < minContentLength) continue;

            const imageTitles = page.images?.map((img: { title: string }) => img.title) ?? [];
            const imageUrls = await fetchImageUrls(imageTitles);

            return {
                title,
                url: page.fullurl ?? `https://fr.wikipedia.org/wiki/${encodeURIComponent(title)}`,
                images: filterGenericImages(imageUrls),
                sections: parseWikiSections(content),
            };
        } catch (error) {
            console.error(`[wiki] Tentative ${attempt}/${maxAttempts}:`, error);
        }
    }

    throw new Error(
        `Impossible de trouver une page ≥ ${minContentLength} car. après ${maxAttempts} tentatives`,
    );
}
