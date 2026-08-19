export const useBreakpoints = () => {
    const isMobile = useMediaQuery("(max-width: 639px)");
    const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1279px)");
    const isLaptop = useMediaQuery("(min-width: 1280px) and (max-width: 1365px)");
    const isDesktop = useMediaQuery("(min-width: 1366px)");
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

    return { isMobile, isTablet, isLaptop, isDesktop, prefersReducedMotion };
};
