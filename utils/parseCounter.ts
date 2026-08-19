export interface CounterAttrs {
    target: string;
    prefix: string;
    suffix: string;
    decimals: number;
}

export const parseCounter = (raw: string | null | undefined): CounterAttrs | null => {
    if (!raw) return null;
    const match = raw.match(/^(\D*)(-?\d+(?:[.,]\d+)?)(.*)$/);
    if (!match) return null;
    const num = match[2];
    const value = parseFloat(num.replace(",", "."));
    if (!isFinite(value) || value <= 0) return null;
    const decimalPart = num.split(/[.,]/)[1];
    return {
        target: num.replace(",", "."),
        prefix: match[1],
        suffix: match[3],
        decimals: decimalPart ? decimalPart.length : 0,
    };
};
