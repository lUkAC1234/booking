
const NBSP = String.fromCharCode(0x00a0);

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

export const formatThousands = (value: number, separator: string = NBSP): string => {
    if (!Number.isFinite(value)) return "";
    const sign = value < 0 ? "-" : "";
    const [intPart, fracPart] = Math.abs(value).toString().split(".");
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return fracPart ? `${sign}${grouped}.${fracPart}` : `${sign}${grouped}`;
};
