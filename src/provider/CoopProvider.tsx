"use client";

import { type ReactNode, useState } from "react";
import CoopContext from "@/context/CoopContext";
import type {
    CoopGuessEntry,
    CoopLobbyInfo,
    CoopPlayerInfo,
} from "@/types/coop";
import type { MaskedArticle, RevealedMap } from "@/types/game";

interface CoopProviderProps {
    children: ReactNode;
}

const CoopProvider = ({ children }: CoopProviderProps) => {
    const [lobby, setLobby] = useState<CoopLobbyInfo | null>(null);
    const [players, setPlayers] = useState<CoopPlayerInfo[]>([]);
    const [article, setArticle] = useState<MaskedArticle | null>(null);
    const [guesses, setGuesses] = useState<CoopGuessEntry[]>([]);
    const [revealed, setRevealed] = useState<RevealedMap>({});
    const [won, setWon] = useState(false);
    const [playerToken, setPlayerToken] = useState<string | null>(null);
    const [lastFoundKeys, setLastFoundKeys] = useState<Set<string>>(new Set());
    const [abandoned, setAbandoned] = useState(false);
    const [isLeader, setIsLeader] = useState(false);

    return (
        <CoopContext.Provider
            value={{
                lobby,
                setLobby,
                players,
                setPlayers,
                article,
                setArticle,
                guesses,
                setGuesses,
                revealed,
                setRevealed,
                won,
                setWon,
                playerToken,
                setPlayerToken,
                lastFoundKeys,
                setLastFoundKeys,
                abandoned,
                setAbandoned,
                isLeader,
                setIsLeader,
            }}
        >
            {children}
        </CoopContext.Provider>
    );
};

export default CoopProvider;
