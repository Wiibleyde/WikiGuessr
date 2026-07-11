"use client";

import Button from "@/components/ui/Button";
import type { CoopPlayerInfo } from "@/types/coop";
import { plural } from "@/utils/helper";
import Layout from "../ui/Layout";
import CoopCodeShare from "./CoopCodeShare";
import Player from "./Player";

interface CoopWaitingProps {
    code: string;
    players: CoopPlayerInfo[];
    isLeader: boolean;
    loading: boolean;
    onStart: () => void;
    onLeave: () => void;
}

export default function CoopWaiting({
    code,
    players,
    isLeader,
    loading,
    onStart,
    onLeave,
}: CoopWaitingProps) {
    return (
        <Layout
            title="🤝 Lobby Co-op"
            subtitle="En attente du lancement de la partie"
        >
            <CoopCodeShare code={code} />

            <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden mb-6">
                <div className="px-4 py-2.5 bg-page border-b border-subtle text-sm font-semibold text-text-secondary">
                    {plural(players.length, "joueur", "joueurs")} (max 4)
                </div>
                <div className="divide-y divide-subtle">
                    {players.map((player) => (
                        <Player
                            key={player.id}
                            displayName={player.displayName}
                            isLeader={player.isLeader}
                        />
                    ))}
                </div>
            </div>

            {isLeader ? (
                <Button
                    onClick={onStart}
                    disabled={loading || players.length < 1}
                    className="w-full py-3 text-base"
                >
                    {loading ? "Lancement…" : "Lancer la partie"}
                </Button>
            ) : (
                <div className="text-center text-sm text-muted py-4">
                    En attente du leader pour lancer la partie…
                </div>
            )}

            <Button
                onClick={onLeave}
                variant="secondary"
                className="w-full mt-2"
            >
                Quitter le lobby
            </Button>
        </Layout>
    );
}
