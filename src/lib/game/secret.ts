import { prisma } from "@/lib/prisma";
import type { AuthUser } from "@/types/auth";
import type { ArticleCache } from "@/types/game";
import { buildArticleCache } from "./game";
import { fetchWikiPageByTitle } from "./wiki";

/**
 * Private easter egg: the Discord account below always plays a game forced onto
 * the "The Horne Section" article and, on win, gets a full-screen secret page.
 * The account may not exist yet — it is resolved lazily the first time it signs in.
 */
export const SECRET_DISCORD_ID = "668161865045639242";
export const SECRET_WIKI_TITLE = "The Horne Section";

// Resolved User.id for the secret Discord account. Only positive results are
// cached — while null we keep re-querying so the match starts working as soon as
// the account is created.
let secretUserId: string | null = null;

async function getSecretUserId(): Promise<string | null> {
    if (secretUserId) return secretUserId;
    const account = await prisma.account.findFirst({
        where: { providerId: "discord", accountId: SECRET_DISCORD_ID },
        select: { userId: true },
    });
    secretUserId = account?.userId ?? null;
    return secretUserId;
}

export async function isSecretUser(user: AuthUser | null): Promise<boolean> {
    if (!user) return false;
    return user.id === (await getSecretUserId());
}

// Isolated article cache — never touches the day-keyed shared cache in game.ts and
// is never persisted to DailyWikiPage. Built once per server process.
let secretCache: ArticleCache | null = null;

export async function getSecretArticleCache(): Promise<ArticleCache> {
    if (secretCache) return secretCache;

    const page = await fetchWikiPageByTitle(SECRET_WIKI_TITLE);
    const cache = buildArticleCache(page.title, page.sections, "secret");
    cache.images = page.images;
    cache.maskedArticle.imageCount = page.images.length;
    cache.maskedArticle.secret = true;

    secretCache = cache;
    return secretCache;
}
