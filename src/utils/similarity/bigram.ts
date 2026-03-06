// ---------------------------------------------------------------------------
//  Metric 3 — Bigram Dice coefficient
//  Structural similarity — resilient to reordering and scattered edits.
// ---------------------------------------------------------------------------


export function bigramDiceCoefficient(a: string, b: string): number {
    if (a.length < 2 || b.length < 2) return a === b ? 1 : 0;

    const aBigrams = new Map<string, number>();
    for (let i = 0; i < a.length - 1; i++) {
        const bg = a.substring(i, i + 2);
        aBigrams.set(bg, (aBigrams.get(bg) ?? 0) + 1);
    }

    let intersection = 0;
    for (let i = 0; i < b.length - 1; i++) {
        const bg = b.substring(i, i + 2);
        const count = aBigrams.get(bg) ?? 0;
        if (count > 0) {
            intersection++;
            aBigrams.set(bg, count - 1);
        }
    }

    return (2 * intersection) / (a.length - 1 + (b.length - 1));
}