"use client";

import { useContext } from "react";
import type { CoopContextValue } from "@/context/CoopContext";
import CoopContext from "@/context/CoopContext";

export function useCoopState(): CoopContextValue {
    const ctx = useContext(CoopContext);
    if (!ctx) {
        throw new Error("useCoopState must be used within a CoopProvider");
    }
    return ctx;
}
