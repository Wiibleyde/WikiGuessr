"use client";

import type { CoopPlayerInfo } from "@/types/coop";
import User from "../ui/User";
import CoopCodeShare from "./CoopCodeShare";

interface CoopPlayerListProps {
    players: CoopPlayerInfo[];
    code: string;
}

export default function CoopPlayerList({ players, code }: CoopPlayerListProps) {
    return (
        <div className="py-4 flex gap-4">
            <CoopCodeShare code={code} variant="compact" />
            {players.map((player) => (
                <User
                    key={player.id}
                    name={player.displayName}
                    image={null}
                    pictureWidth={24}
                />
            ))}
        </div>
    );
}
