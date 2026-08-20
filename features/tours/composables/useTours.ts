import type { CardFact, IconName } from "~/types/models";

export interface Tour {
    id: string;
    title: string;
    summary: string;
    highlights: string[];
    facts: CardFact[];
    photoBrief: string;
}

const TOUR_IDS = [
    "amirsoy",
    "chimgan",
    "charvak",
    "amirsoy-gondola",
    "chinorkent",
    "tashkent-metro",
    "besh-qozon",
] as const;

const HIGHLIGHT_KEYS = ["one", "two", "three"] as const;
const FACT_KEYS = ["duration", "group", "vehicle"] as const;

const FACT_ICONS: Record<(typeof FACT_KEYS)[number], IconName> = {
    duration: "clock",
    group: "users",
    vehicle: "car",
};

export const useTours = () => {
    const { t } = useI18n();

    const items = computed<Tour[]>(() =>
        TOUR_IDS.map((id) => ({
            id,
            title: t(`tours.items.${id}.title`),
            summary: t(`tours.items.${id}.summary`),
            highlights: HIGHLIGHT_KEYS.map((key) => t(`tours.items.${id}.highlights.${key}`)),
            facts: FACT_KEYS.map((key) => ({
                label: t(`tours.items.${id}.facts.${key}`),
                icon: FACT_ICONS[key],
            })),
            photoBrief: t(`tours.items.${id}.photo`),
        })),
    );

    return { items };
};
