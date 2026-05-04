import { getLeaderboardCategoryHandler } from "@/lib/controllers/leaderboardController";
import { withErrorHandler } from "@/utils/handler";

export const dynamic = "force-dynamic";

export const GET = withErrorHandler(getLeaderboardCategoryHandler);
