"use client";

import { createContext, type Dispatch, type SetStateAction } from "react";
import type {
    CoopGuessEntry,
    CoopLobbyInfo,
    CoopPlayerInfo,
} from "@/types/coop";
import type { MaskedArticle, RevealedMap } from "@/types/game";

export interface CoopContextValue {
    lobby: CoopLobbyInfo | null;
    setLobby: Dispatch<SetStateAction<CoopLobbyInfo | null>>;
    players: CoopPlayerInfo[];
    setPlayers: Dispatch<SetStateAction<CoopPlayerInfo[]>>;
    article: MaskedArticle | null;
    setArticle: Dispatch<SetStateAction<MaskedArticle | null>>;
    guesses: CoopGuessEntry[];
    setGuesses: Dispatch<SetStateAction<CoopGuessEntry[]>>;
    revealed: RevealedMap;
    setRevealed: Dispatch<SetStateAction<RevealedMap>>;
    won: boolean;
    setWon: Dispatch<SetStateAction<boolean>>;
    playerToken: string | null;
    setPlayerToken: Dispatch<SetStateAction<string | null>>;
    lastFoundKeys: Set<string>;
    setLastFoundKeys: Dispatch<SetStateAction<Set<string>>>;
    abandoned: boolean;
    setAbandoned: Dispatch<SetStateAction<boolean>>;
    isLeader: boolean;
    setIsLeader: Dispatch<SetStateAction<boolean>>;
}

const CoopContext = createContext<CoopContextValue | null>(null);

export default CoopContext;
