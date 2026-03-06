import { bigramDiceCoefficient } from "./bigram";
import { jaroWinklerSimilarity } from "./jaro";
import { osaSimilarity } from "./osa";

export { bigramDiceCoefficient } from "./bigram";
export { diagnoseProximity } from "./diagnose";
export { jaroWinklerSimilarity } from "./jaro";
export { osaDistance, osaSimilarity } from "./osa";


export function wordSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;

    const osa = osaSimilarity(a, b);
    const jw = jaroWinklerSimilarity(a, b);
    const dice = bigramDiceCoefficient(a, b);

    return Math.max(osa, jw, dice);
}