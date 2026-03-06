// ---------------------------------------------------------------------------
//  Proximity diagnosis — explains WHY a guess is close to a target word.
//  Returns a human-readable French description + a type tag for UI icons.
// ---------------------------------------------------------------------------

import type { ProximityReason } from "@/types/game";
import { osaDistance } from "./osa";

export function diagnoseProximity(
    guess: string,
    target: string,
): ProximityReason {
    const dist = osaDistance(guess, target);
    const lenDiff = target.length - guess.length;

    // Single-edit cases: provide precise feedback
    if (dist === 1) {
        if (lenDiff === 1) {
            return { type: "deletion", description: "1 lettre manquante" };
        }
        if (lenDiff === -1) {
            return { type: "insertion", description: "1 lettre en trop" };
        }
        // Same length → substitution or transposition
        if (guess.length === target.length) {
            // Check for adjacent transposition
            for (let i = 0; i < guess.length - 1; i++) {
                if (guess[i] === target[i + 1] && guess[i + 1] === target[i]) {
                    // Verify the rest matches
                    const before =
                        guess.substring(0, i) === target.substring(0, i);
                    const after =
                        guess.substring(i + 2) === target.substring(i + 2);
                    if (before && after) {
                        return {
                            type: "transposition",
                            description: "Lettres inversées",
                        };
                    }
                }
            }
            return { type: "substitution", description: "1 lettre différente" };
        }
    }

    // Multi-edit cases
    if (dist === 2) {
        if (lenDiff === 0) {
            return { type: "mixed", description: "2 lettres différentes" };
        }
        if (lenDiff > 0) {
            return {
                type: "deletion",
                description: `${Math.abs(lenDiff)} lettre${Math.abs(lenDiff) > 1 ? "s" : ""} manquante${Math.abs(lenDiff) > 1 ? "s" : ""}`,
            };
        }
        return {
            type: "insertion",
            description: `${Math.abs(lenDiff)} lettre${Math.abs(lenDiff) > 1 ? "s" : ""} en trop`,
        };
    }

    // General case
    if (Math.abs(lenDiff) >= dist) {
        if (lenDiff > 0) {
            return {
                type: "deletion",
                description: `${dist} lettre${dist > 1 ? "s" : ""} manquante${dist > 1 ? "s" : ""}`,
            };
        }
        return {
            type: "insertion",
            description: `${dist} lettre${dist > 1 ? "s" : ""} en trop`,
        };
    }

    return { type: "mixed", description: "Mot très proche" };
}
