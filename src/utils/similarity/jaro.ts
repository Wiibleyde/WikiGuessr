// ---------------------------------------------------------------------------
//  Metric 2 — Jaro-Winkler similarity
//  Prefix-weighted metric — great for catching words with a shared root.
// ---------------------------------------------------------------------------

export function jaroSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (a.length === 0 || b.length === 0) return 0;

    const matchWindow = Math.max(
        0,
        Math.floor(Math.max(a.length, b.length) / 2) - 1,
    );

    const aMatches = new Array<boolean>(a.length).fill(false);
    const bMatches = new Array<boolean>(b.length).fill(false);

    let matches = 0;

    for (let i = 0; i < a.length; i++) {
        const start = Math.max(0, i - matchWindow);
        const end = Math.min(i + matchWindow + 1, b.length);
        for (let j = start; j < end; j++) {
            if (bMatches[j] || a[i] !== b[j]) continue;
            aMatches[i] = true;
            bMatches[j] = true;
            matches++;
            break;
        }
    }

    if (matches === 0) return 0;

    let transpositions = 0;
    let k = 0;
    for (let i = 0; i < a.length; i++) {
        if (!aMatches[i]) continue;
        while (!bMatches[k]) k++;
        if (a[i] !== b[k]) transpositions++;
        k++;
    }

    return (
        (matches / a.length +
            matches / b.length +
            (matches - transpositions / 2) / matches) /
        3
    );
}

export function jaroWinklerSimilarity(a: string, b: string): number {
    const jaro = jaroSimilarity(a, b);

    // Common-prefix bonus (up to 4 characters)
    let prefix = 0;
    for (let i = 0; i < Math.min(4, a.length, b.length); i++) {
        if (a[i] === b[i]) prefix++;
        else break;
    }

    return jaro + prefix * 0.1 * (1 - jaro);
}
