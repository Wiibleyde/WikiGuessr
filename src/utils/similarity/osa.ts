// ---------------------------------------------------------------------------
//  Metric 1 — Optimal String Alignment distance (restricted Damerau-Levenshtein)
//  Handles transpositions on top of insertions, deletions, substitutions.
// ---------------------------------------------------------------------------

export function osaDistance(a: string, b: string): number {
    const m = a.length;
    const n = b.length;

    const d: number[][] = Array.from({ length: m + 1 }, (_, i) => {
        const row = new Array<number>(n + 1);
        row[0] = i;
        return row;
    });
    for (let j = 0; j <= n; j++) d[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            d[i][j] = Math.min(
                d[i - 1][j] + 1, // deletion
                d[i][j - 1] + 1, // insertion
                d[i - 1][j - 1] + cost, // substitution
            );
            // transposition
            if (
                i > 1 &&
                j > 1 &&
                a[i - 1] === b[j - 2] &&
                a[i - 2] === b[j - 1]
            ) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
            }
        }
    }

    return d[m][n];
}

export function osaSimilarity(a: string, b: string): number {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - osaDistance(a, b) / maxLen;
}
