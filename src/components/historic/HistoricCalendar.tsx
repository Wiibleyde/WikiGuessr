"use client";

import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { cn } from "@/utils/cn";

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
];

interface HistoricCalendarProps {
    /** Set of available dates as YYYY-MM-DD strings */
    availableDates: string[];
    /** Currently selected date as YYYY-MM-DD, or null */
    selectedDate: string | null;
    onSelect: (date: string | null) => void;
}

function toKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function HistoricCalendar({
    availableDates,
    selectedDate,
    onSelect,
}: HistoricCalendarProps) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const availableSet = new Set(availableDates);

    // Day-of-week of first day of month (Mon=0 … Sun=6)
    const firstDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const isAtCurrentMonth =
        viewYear === today.getFullYear() && viewMonth === today.getMonth();

    function prevMonth() {
        if (viewMonth === 0) {
            setViewYear((y) => y - 1);
            setViewMonth(11);
        } else {
            setViewMonth((m) => m - 1);
        }
    }

    function nextMonth() {
        if (isAtCurrentMonth) return;
        if (viewMonth === 11) {
            setViewYear((y) => y + 1);
            setViewMonth(0);
        } else {
            setViewMonth((m) => m + 1);
        }
    }

    return (
        <div className="bg-surface rounded-xl border border-border p-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-3">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1 rounded hover:bg-page transition-colors"
                    aria-label="Mois précédent"
                >
                    <IoIosArrowBack className="w-4 h-4 text-muted" />
                </button>
                <span className="text-sm font-semibold text-text">
                    {MONTHS_FR[viewMonth]} {viewYear}
                </span>
                <button
                    type="button"
                    onClick={nextMonth}
                    disabled={isAtCurrentMonth}
                    className="p-1 rounded hover:bg-page disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Mois suivant"
                >
                    <IoIosArrowForward className="w-4 h-4 text-muted" />
                </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS_FR.map((d) => (
                    <div
                        key={d}
                        className="text-center text-xs text-muted py-1"
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-1">
                {cells.map((day, i) => {
                    if (day === null) {
                        // biome-ignore lint/suspicious/noArrayIndexKey: padding cells have no meaningful key
                        return <div key={`pad-${i}`} />;
                    }

                    const key = toKey(viewYear, viewMonth, day);
                    const available = availableSet.has(key);
                    const isSelected = selectedDate === key;
                    const isToday = isAtCurrentMonth && day === today.getDate();

                    return (
                        <button
                            key={key}
                            type="button"
                            disabled={!available}
                            onClick={() => onSelect(isSelected ? null : key)}
                            className={cn(
                                "mx-auto flex w-7 h-7 items-center justify-center rounded text-xs transition-colors",
                                isSelected &&
                                    "bg-primary text-white font-semibold",
                                !isSelected &&
                                    available &&
                                    "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-800/50",
                                !isSelected &&
                                    !available &&
                                    "text-muted/40 cursor-not-allowed",
                                isToday && !isSelected && "ring-1 ring-primary",
                            )}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            {selectedDate && (
                <button
                    type="button"
                    onClick={() => onSelect(null)}
                    className="mt-3 w-full text-xs text-muted hover:text-text transition-colors text-center"
                >
                    Effacer la sélection
                </button>
            )}
        </div>
    );
}
