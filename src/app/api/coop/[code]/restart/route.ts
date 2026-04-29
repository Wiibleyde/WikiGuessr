import type { NextRequest } from "next/server";
import { restartCoopGameHandler } from "@/lib/controllers/coopController";
import { withErrorHandler } from "@/utils/handler";

export const dynamic = "force-dynamic";

const restartGameRoute = async (
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> },
) => {
    const { code } = await params;
    return restartCoopGameHandler(request, code);
};

export const POST = withErrorHandler(restartGameRoute);
