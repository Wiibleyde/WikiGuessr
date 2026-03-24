export const HINT_IMAGE_URL_VERSION = "3";

export function buildHintImageUrl(hintIndex: number): string {
    return `/api/game/hint/image?index=${hintIndex}&v=${HINT_IMAGE_URL_VERSION}`;
}

export function normalizeHintImageUrls(urls: string[] | undefined): string[] {
    if (!urls || urls.length === 0) {
        return [];
    }

    return urls.map((_, index) => buildHintImageUrl(index));
}
