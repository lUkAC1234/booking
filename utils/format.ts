const UZ_PHONE_GROUPS = [3, 2, 3, 2, 2];

export const formatPhone = (digits: string): string => {
    const clean = digits.replace(/\D/g, "");
    if (clean.length !== 12) return `+${clean}`;

    const parts: string[] = [];
    let offset = 0;
    for (const size of UZ_PHONE_GROUPS) {
        parts.push(clean.slice(offset, offset + size));
        offset += size;
    }
    return `+${parts.join(" ")}`;
};
