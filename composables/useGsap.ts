type GsapTools = { gsap: typeof import("gsap").gsap; ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger };

let cached: Promise<GsapTools> | null = null;

export const useGsap = (): Promise<GsapTools | null> => {
    if (import.meta.server) return Promise.resolve(null);

    if (!cached) {
        cached = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
            ([{ gsap }, { ScrollTrigger }]) => {
                gsap.registerPlugin(ScrollTrigger);
                return { gsap, ScrollTrigger };
            },
        );
    }

    return cached;
};
