import type { RouterConfig } from "@nuxt/schema";

const LOCALE_PREFIXES = ["/ru"] as const;

const stripLocalePrefix = (path: string): string => {
    for (const prefix of LOCALE_PREFIXES) {
        if (path === prefix) return "/";
        if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length);
    }
    return path;
};

const routerOptions: RouterConfig = {
    scrollBehavior(to, from, savedPosition) {
        if (from && stripLocalePrefix(to.path) === stripLocalePrefix(from.path)) {
            return false;
        }

        if (savedPosition) {
            return savedPosition;
        }

        if (to.hash) {
            return {
                el: to.hash,
                top: 80,
                behavior: "smooth",
            };
        }

        return { top: 0, left: 0, behavior: "instant" };
    },
};

export default routerOptions;
