import { mock } from "bun:test";

export const getVictoriesGroupedByUserMock = mock();
export const getBestScoreByUserMock = mock();
export const getMostWinsMock = mock();
export const createOrUpdateGameResultMock = mock();
export const getGameResultsByUserIdMock = mock();
export const getTodayRankForUserMock = mock();
export const getTodayWinnersMock = mock();

mock.module("@/lib/repositories/gameResultRepository", () => ({
    getVictoriesGroupedByUser: getVictoriesGroupedByUserMock,
    getBestScoreByUser: getBestScoreByUserMock,
    getMostWins: getMostWinsMock,
    createOrUpdateGameResult: createOrUpdateGameResultMock,
    getGameResultsByUserId: getGameResultsByUserIdMock,
    getTodayRankForUser: getTodayRankForUserMock,
    getTodayWinners: getTodayWinnersMock,
}));
