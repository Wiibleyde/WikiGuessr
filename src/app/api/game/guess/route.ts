import { submitGuessHandler } from "@/lib/controllers/gameController";
import {
    withErrorHandler,
    withOptionalAuth,
    withRateLimit,
} from "@/utils/handler";

export const dynamic = "force-dynamic";

export const POST = withErrorHandler(
    withRateLimit(withOptionalAuth(submitGuessHandler)),
);
