import type { NextRequest } from "next/server";
import { abandonCoopGameHandler } from "@/lib/controllers/coopController";
import { withErrorHandler } from "@/utils/handler";

export const dynamic = "force-dynamic";

const abandonGameRoute = async (
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> },
) => {
    const { code } = await params;
    return abandonCoopGameHandler(request, code);
};

export const POST = withErrorHandler(abandonGameRoute);
