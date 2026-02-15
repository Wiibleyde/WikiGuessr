const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

const LIGATURE_MAP: Record<string, string> = {
    "\u0153": "oe",
    "\u0152": "oe",
    "\u00e6": "ae",
    "\u00c6": "ae",
    "\u00df": "ss",
    "\ufb01": "fi",
    "\ufb02": "fl",
};

const LIGATURE_REGEX = new RegExp(
    `[${Object.keys(LIGATURE_MAP).join("")}]`,
    "g",
);

export function normalizeWord(word: string): string {
    return word
        .toLowerCase()
        .replace(LIGATURE_REGEX, (ch) => LIGATURE_MAP[ch] ?? ch)
        .normalize("NFD")
        .replace(DIACRITICS_REGEX, "");
}
