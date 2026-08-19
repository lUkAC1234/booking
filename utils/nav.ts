export interface NavLink {
    path: string;
    label: string;
    icon: "home" | "apartments" | "tours" | "transfer" | "about" | "contact";
}

export const NAV_LINKS: readonly NavLink[] = [
    { path: "/tashkent-city-center-apartments/", label: "nav.apartments", icon: "apartments" },
    { path: "/tashkent-tours-amirsoy-chimgan/", label: "nav.tours", icon: "tours" },
    { path: "/tashkent-airport-transfer/", label: "nav.transfer", icon: "transfer" },
    { path: "/about-us/", label: "nav.about", icon: "about" },
    { path: "/contact-us/", label: "nav.contact", icon: "contact" },
];

export const HOME_LINK: NavLink = { path: "/", label: "nav.home", icon: "home" };

export const isNavPathActive = (currentPath: string, linkPath: string, localized: string): boolean => {
    const target = localized.endsWith("/") ? localized : `${localized}/`;
    const current = currentPath.endsWith("/") ? currentPath : `${currentPath}/`;
    if (linkPath === "/") return current === target;
    return current === target || current.startsWith(target);
};
