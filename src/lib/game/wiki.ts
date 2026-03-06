import {
    GENERIC_IMAGE_PATTERNS,
    IGNORED_SECTIONS,
    WIKI_API,
} from "@/lib/constants/wiki";
import type {
    ArticleApiResponse,
    ImageApiResponse,
    RandomPageResponse,
    WikiPage,
    WikiSection,
} from "@/types/wiki";

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

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`[wiki] HTTP ${res.status} fetching ${url}`);
    }
    return res.json() as Promise<T>;
}

export async function fetchRandomWikiPage(
    minContentLength = 1000,
    maxAttempts = 25,
): Promise<WikiPage> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const randomData = await fetchJson<RandomPageResponse>(
                `${WIKI_API}?action=query&format=json&list=random&rnnamespace=0&rnlimit=1`,
            );

            const pageTitle = randomData.query?.random?.[0]?.title;
            if (!pageTitle) continue;

            const pageData = await fetchJson<ArticleApiResponse>(
                `${WIKI_API}?action=query&format=json&titles=${encodeURIComponent(pageTitle)}&prop=extracts|images|info&inprop=url&explaintext=true&imlimit=500`,
            );

            const pages = pageData.query?.pages;
            if (!pages) continue;

            const page = Object.values(pages)[0];
            const content = page.extract ?? "";

            if (content.length < minContentLength) continue;

            const imageUrls: string[] = [];
            if (page.images?.length) {
                const imageTitles = page.images
                    .map((img) => img.title)
                    .join("|");
                const imgData = await fetchJson<ImageApiResponse>(
                    `${WIKI_API}?action=query&format=json&titles=${encodeURIComponent(imageTitles)}&prop=imageinfo&iiprop=url`,
                );

                for (const imgPage of Object.values(
                    imgData.query?.pages ?? {},
                )) {
                    const info = imgPage.imageinfo?.[0];
                    if (info?.url) imageUrls.push(info.url);
                }
            }

            return {
                title: pageTitle,
                url:
                    page.fullurl ??
                    `https://fr.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
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
