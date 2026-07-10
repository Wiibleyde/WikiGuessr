import { mock } from "bun:test";

export const isSecretUserMock = mock(async () => false);
export const getSecretArticleCacheMock = mock();

mock.module("@/lib/game/secret", () => ({
    SECRET_DISCORD_ID: "668161865045639242",
    SECRET_WIKI_TITLE: "The Horne Section",
    isSecretUser: isSecretUserMock,
    getSecretArticleCache: getSecretArticleCacheMock,
}));
