import type { CardFact, GalleryPhoto, IconName } from "~/types/models";

export interface Tour {
    id: string;
    title: string;
    summary: string;
    program: string[];
    facts: CardFact[];
    photos: GalleryPhoto[];
    photoBrief: string;
}

const TOUR_IDS = ["tashkent-city", "tashkent-mountains"] as const;

type TourId = (typeof TOUR_IDS)[number];

const FACT_KEYS = ["duration", "group", "vehicle"] as const;

const FACT_ICONS: Record<(typeof FACT_KEYS)[number], IconName> = {
    duration: "clock",
    group: "users",
    vehicle: "car",
};

const PHOTO_KEYS = ["one", "two", "three", "four", "five", "six", "seven", "eight"] as const;

const PROGRAM_KEYS: Record<TourId, readonly string[]> = {
    "tashkent-city": [
        "khast-imam",
        "chorsu",
        "romanov",
        "besh-qozon",
        "applied-arts",
        "magic-city",
        "minor",
        "independence",
        "amir-temur",
        "metro",
    ],
    "tashkent-mountains": ["amirsoy", "lunch", "chimgan", "charvak", "chinorkent"],
};

const PHOTO_SOURCES: Record<TourId, readonly string[]> = {
    "tashkent-city": [
        "beshqozon/image3",
        "beshqozon/image1",
        "beshqozon/image2",
        "magiccity/image1",
        "magiccity/image2",
        "metro/image1",
        "metro/image2",
    ],
    "tashkent-mountains": [
        "amirsoy/image1",
        "amirsoy/image2",
        "greaterchimgan/image1",
        "greaterchimgan/image2",
        "charvak/image1",
        "charvak/image2",
        "chinorkent/image1",
        "chinorkent/image2",
    ],
};

export const useTours = () => {
    const { t } = useI18n();

    const photosFor = (id: TourId): GalleryPhoto[] =>
        PHOTO_SOURCES[id].map((path, position) => ({
            id: `${id}-${position + 1}`,
            src: `/images/tours/${path}.webp`,
            alt: t(`tours.items.${id}.photos.${PHOTO_KEYS[position]}`),
        }));

    const items = computed<Tour[]>(() =>
        TOUR_IDS.map((id) => ({
            id,
            title: t(`tours.items.${id}.title`),
            summary: t(`tours.items.${id}.summary`),
            program: PROGRAM_KEYS[id].map((key) => t(`tours.items.${id}.program.${key}`)),
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
