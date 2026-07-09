import { getArticleHandler } from "@/lib/controllers/gameController";
import { withErrorHandler, withOptionalAuth } from "@/utils/handler";

export const dynamic = "force-dynamic";

export const GET = withErrorHandler(withOptionalAuth(getArticleHandler));
