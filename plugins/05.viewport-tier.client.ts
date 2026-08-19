type Tier = "mobile" | "tablet" | "laptop" | "notebook" | "desktop";

export default defineNuxtPlugin(() => {
    const isMobile = useMediaQuery("(max-width: 639px)");
    const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
    const isLaptop = useMediaQuery("(min-width: 1024px) and (max-width: 1279px)");
    const isNotebook = useMediaQuery("(min-width: 1280px) and (max-width: 1365px)");

    const tier = computed<Tier>(() => {
        if (isMobile.value) return "mobile";
        if (isTablet.value) return "tablet";
        if (isLaptop.value) return "laptop";
        if (isNotebook.value) return "notebook";
        return "desktop";
    });

    watchEffect(() => {
        document.documentElement.setAttribute("data-tier", tier.value);
    });
});
