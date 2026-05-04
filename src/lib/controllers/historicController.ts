import type { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    getHistoric,
    getHistoricAvailableDates,
    getHistoricPaginated,
} from "@/lib/services/historicService";
import { err, ok } from "@/utils/response";

export async function getHistoricHandler(
    _request: NextRequest,
): Promise<NextResponse> {
    const data = await getHistoric();
    return ok(data);
}

const historicQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(50).default(5),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
});

export async function getHistoricPaginatedHandler(
    request: NextRequest,
): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const raw = {
        page: searchParams.get("page") ?? undefined,
        perPage: searchParams.get("perPage") ?? undefined,
        date: searchParams.get("date") ?? undefined,
    };

    const parsed = historicQuerySchema.safeParse(raw);
    if (!parsed.success) {
        return err(
            `Paramètres invalides: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
            400,
        );
    }

    const { page, perPage, date } = parsed.data;
    const filterDate = date ? new Date(date) : undefined;
    const data = await getHistoricPaginated(page, perPage, filterDate);
    return ok(data);
}

export async function getHistoricDatesHandler(
    _request: NextRequest,
): Promise<NextResponse> {
    const dates = await getHistoricAvailableDates();
    return ok({ dates });
}
