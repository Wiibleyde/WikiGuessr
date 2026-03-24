import { NextResponse } from "next/server";
import sharp from "sharp";
import { getHintImage } from "@/lib/game/game";

export const dynamic = "force-dynamic";

const MAX_WIDTH = 600;
const WEBP_QUALITY = 75;
const CACHE_MAX_AGE = 86400; // 24 hours
const USER_AGENT = "WikiGuessr/1.0 (https://wikiguessr.com)";
const MAX_CONCURRENT_WIKI_FETCHES = 3;

// In-memory cache: date → (index → processed image buffer)
let imageCache: { date: string; entries: Map<number, Uint8Array> } | null =
    null;

// In-flight requests: index → promise resolving to processed image
const inFlight = new Map<number, Promise<Uint8Array | null>>();

// Concurrency limiter for outgoing Wikipedia fetches
let activeFetches = 0;
const waitQueue: Array<() => void> = [];

async function acquireFetchSlot(): Promise<void> {
    if (activeFetches < MAX_CONCURRENT_WIKI_FETCHES) {
        activeFetches++;
        return;
    }
    await new Promise<void>((resolve) => waitQueue.push(resolve));
    activeFetches++;
}

function releaseFetchSlot(): void {
    activeFetches--;
    const next = waitQueue.shift();
    if (next) next();
}

function getCachedImage(date: string, index: number): Uint8Array | undefined {
    if (imageCache?.date !== date) {
        imageCache = { date, entries: new Map() };
        return undefined;
    }
    return imageCache.entries.get(index);
}

function setCachedImage(date: string, index: number, data: Uint8Array): void {
    if (imageCache?.date !== date) {
        imageCache = { date, entries: new Map() };
    }
    imageCache.entries.set(index, data);
}

async function fetchAndProcess(imageUrl: string): Promise<Uint8Array | null> {
    await acquireFetchSlot();
    try {
        const response = await fetch(imageUrl, {
            headers: { "User-Agent": USER_AGENT },
        });

        if (!response.ok) {
            console.error(
                `[api/game/hint/image] Failed to fetch upstream image: ${response.status}`,
            );
            return null;
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());
        return new Uint8Array(
            await sharp(imageBuffer)
                .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: WEBP_QUALITY })
                .toBuffer(),
        );
    } finally {
        releaseFetchSlot();
    }
}

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const indexParam = searchParams.get("index");

        if (indexParam === null || Number.isNaN(Number(indexParam))) {
            return NextResponse.json(
                { error: "Paramètre index manquant ou invalide" },
                { status: 400 },
            );
        }

        const hintIndex = Number.parseInt(indexParam, 10);
        const result = await getHintImage(hintIndex);

        if (!result) {
            return NextResponse.json(
                { error: "Aucune image disponible pour cet index" },
                { status: 404 },
            );
        }

        // Serve from in-memory cache if available
        const cached = getCachedImage(result.date, hintIndex);
        if (cached) {
            return new NextResponse(new Uint8Array(cached), {
                status: 200,
                headers: {
                    "Content-Type": "image/webp",
                    "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
                    "Content-Length": String(cached.length),
                },
            });
        }

        // Coalesce concurrent requests for the same index into one upstream fetch
        let promise = inFlight.get(hintIndex);
        if (!promise) {
            promise = fetchAndProcess(result.imageUrl).finally(() => {
                inFlight.delete(hintIndex);
            });
            inFlight.set(hintIndex, promise);
        }

        const processed = await promise;
        if (!processed) {
            return NextResponse.json(
                { error: "Impossible de récupérer l'image" },
                { status: 502 },
            );
        }

        setCachedImage(result.date, hintIndex, processed);

        return new NextResponse(new Uint8Array(processed), {
            status: 200,
            headers: {
                "Content-Type": "image/webp",
                "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
                "Content-Length": String(processed.length),
            },
        });
    } catch (error) {
        console.error("[api/game/hint/image]", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}
