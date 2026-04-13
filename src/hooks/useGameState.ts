"use client";

import { useContext } from "react";
import type { GameContextValue } from "@/context/GameContext";
import GameContext from "@/context/GameContext";

export function useGameState(): GameContextValue {
    const ctx = useContext(GameContext);
    if (!ctx) {
        throw new Error("useGameState must be used within a GameProvider");
    }
    return ctx;
}
