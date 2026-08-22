import type { CardFact, GalleryPhoto, IconName } from "~/types/models";

export interface Tour {
    id: string;
    title: string;
    summary: string;
    highlights: string[];
    facts: CardFact[];
    photos: GalleryPhoto[];
    photoBrief: string;
}

const TOUR_IDS = [
    "amirsoy",
    "chimgan",
    "charvak",
    "chinorkent",
    "tashkent-metro",
    "besh-qozon",
    "magic-city",
] as const;

type TourId = (typeof TOUR_IDS)[number];

const HIGHLIGHT_KEYS = ["one", "two", "three"] as const;
const PHOTO_KEYS = ["one", "two", "three"] as const;
const FACT_KEYS = ["duration", "group", "vehicle"] as const;

const FACT_ICONS: Record<(typeof FACT_KEYS)[number], IconName> = {
    duration: "clock",
    group: "users",
    vehicle: "car",
};

const PHOTO_FOLDERS: Record<TourId, string> = {
    amirsoy: "amirsoy",
    chimgan: "greaterchimgan",
    charvak: "charvak",
    chinorkent: "chinorkent",
    "tashkent-metro": "metro",
    "besh-qozon": "beshqozon",
    "magic-city": "magiccity",
};

const PHOTO_COUNTS: Record<TourId, number> = {
    amirsoy: 2,
    chimgan: 2,
    charvak: 2,
    chinorkent: 2,
    "tashkent-metro": 2,
    "besh-qozon": 3,
    "magic-city": 2,
};

export const useTours = () => {
    const { t } = useI18n();

    const photosFor = (id: TourId): GalleryPhoto[] =>
        Array.from({ length: PHOTO_COUNTS[id] }, (_, position) => ({
            id: `${id}-${position + 1}`,
            src: `/images/tours/${PHOTO_FOLDERS[id]}/image${position + 1}.webp`,
            alt: t(`tours.items.${id}.photos.${PHOTO_KEYS[position]}`),
        }));

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
            photos: photosFor(id),
            photoBrief: t(`tours.items.${id}.photo`),
        })),
    );

    return { items };
};
