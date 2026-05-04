"use client";

import { useState } from "react";
import { useFetchHistoricDates, useFetchHistoricPaginated } from "@/lib/query";
import ErrorMessage from "../ui/Error";
import Loader from "../ui/Loader";
import NoDataMessage from "../ui/NoDataMessage";
import Pagination from "../ui/Pagination";
import HistoricCalendar from "./HistoricCalendar";
import HistoricalPageEntry from "./PageHistoric";

export default function HistoricContent() {
    const [page, setPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const {
        data: paginatedData,
        error,
        isLoading,
    } = useFetchHistoricPaginated(page, 5, selectedDate ?? undefined);

    const { data: availableDates } = useFetchHistoricDates();

    function handleDateSelect(date: string | null) {
        setSelectedDate(date);
        setPage(1);
    }

    return (
        <div className="h-full bg-page text-text w-full">
            <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-text font-(family-name:--font-heading)">
                        🕒 Historique
                    </h2>
                    <p className="text-sm text-muted mt-1">
                        Découvrez les dernières pages Wikipédia qui ont été
                        devinées dans WikiGuessr.
                    </p>
                </div>

                {/* Content: calendar + list */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Calendar */}
                    <div className="w-full lg:w-64 shrink-0">
                        <HistoricCalendar
                            availableDates={availableDates ?? []}
                            selectedDate={selectedDate}
                            onSelect={handleDateSelect}
                        />
                    </div>

                    {/* Paginated list */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {isLoading && (
                            <Loader message="Chargement du historique…" />
                        )}
                        {error && !isLoading && (
                            <ErrorMessage message="Impossible de charger l'historique." />
                        )}
                        {!isLoading &&
                            !error &&
                            paginatedData?.entries.length === 0 && (
                                <NoDataMessage message="Aucune page disponible." />
                            )}
                        {!isLoading &&
                            !error &&
                            paginatedData?.entries.map((p) => (
                                <HistoricalPageEntry page={p} key={p.id} />
                            ))}

                        {paginatedData && (
                            <Pagination
                                page={paginatedData.pagination.page}
                                totalPages={paginatedData.pagination.totalPages}
                                onPageChange={setPage}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
