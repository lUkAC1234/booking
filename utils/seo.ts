const META_MIN = 140;
const META_MAX = 160;

const truncateAtWord = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    const sliced = text.slice(0, maxLength - 1);
    const lastSpace = sliced.lastIndexOf(" ");
    const cut = lastSpace > maxLength / 2 ? sliced.slice(0, lastSpace) : sliced;
    return `${cut.trimEnd()}…`;
};

export const fitMetaDescription = (base: string, fallback: string): string => {
    const trimmed = (base || "").trim();
    const fb = (fallback || "").trim();

    if (trimmed.length >= META_MIN && trimmed.length <= META_MAX) {
        return trimmed;
    }
    if (trimmed.length > META_MAX) {
        return truncateAtWord(trimmed, META_MAX);
    }
    if (!trimmed) {
        return fb.length > META_MAX ? truncateAtWord(fb, META_MAX) : fb;
    }
    const combined = `${trimmed} ${fb}`.replace(/\s+/g, " ").trim();
    if (combined.length <= META_MAX) return combined;
    return truncateAtWord(combined, META_MAX);
};
