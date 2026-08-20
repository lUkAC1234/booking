import type { CardFact, IconName } from "~/types/models";

export type TourCategory = "mountains" | "city" | "winter" | "day-trips";

export interface Tour {
    id: string;
    category: TourCategory;
    title: string;
    summary: string;
    highlights: string[];
    facts: CardFact[];
    photoBrief: string;
}

export const TOUR_CATEGORIES: readonly TourCategory[] = ["mountains", "city", "winter", "day-trips"];

const TOUR_INDEX: ReadonlyArray<{ id: string; category: TourCategory }> = [
    { id: "amirsoy-day-trip", category: "mountains" },
    { id: "chimgan-cable-car", category: "mountains" },
    { id: "charvak-lake", category: "mountains" },
    { id: "beldersay-hike", category: "mountains" },
    { id: "old-tashkent", category: "city" },
    { id: "metro-architecture", category: "city" },
    { id: "bazaar-food-walk", category: "city" },
    { id: "ski-day-transfer", category: "winter" },
    { id: "samarkand-day-trip", category: "day-trips" },
    { id: "bukhara-day-trip", category: "day-trips" },
];

const HIGHLIGHT_KEYS = ["one", "two", "three"] as const;
const FACT_KEYS = ["duration", "group", "season"] as const;

const FACT_ICONS: Record<(typeof FACT_KEYS)[number], IconName> = {
    duration: "clock",
    group: "users",
    season: "calendar",
};

export const useTours = () => {
    const { t } = useI18n();

    const items = computed<Tour[]>(() =>
        TOUR_INDEX.map((entry) => ({
            id: entry.id,
            category: entry.category,
            title: t(`tours.items.${entry.id}.title`),
            summary: t(`tours.items.${entry.id}.summary`),
            highlights: HIGHLIGHT_KEYS.map((key) => t(`tours.items.${entry.id}.highlights.${key}`)),
            facts: FACT_KEYS.map((key) => ({
                label: t(`tours.items.${entry.id}.facts.${key}`),
                icon: FACT_ICONS[key],
            })),
            photoBrief: t(`tours.items.${entry.id}.photo`),
        })),
    );

    const featured = computed<Tour[]>(() =>
        items.value.filter((tour) => tour.category === "mountains"),
    );

    const byCategory = (category: TourCategory) =>
        computed<Tour[]>(() => items.value.filter((tour) => tour.category === category));

    return { items, featured, byCategory };
};
