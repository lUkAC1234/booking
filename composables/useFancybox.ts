type FancyboxApi = typeof import("@fancyapps/ui/dist/fancybox/fancybox.js").Fancybox;

let cached: Promise<FancyboxApi> | null = null;

export const useFancybox = (): Promise<FancyboxApi | null> => {
    if (import.meta.server) return Promise.resolve(null);

    if (!cached) {
        cached = import("@fancyapps/ui/dist/fancybox/fancybox.js").then(({ Fancybox }) => Fancybox);
    }

    return cached;
};
