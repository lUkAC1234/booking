export interface Apartment {
    id: string;
    title: string;
    summary: string;
    paragraphs: string[];
    facts: string[];
    amenities: string[];
    nearby: string[];
    photoBrief: string;
    floorSize: number;
    rooms: number;
    bedrooms: number;
    bathrooms: number;
}

const APARTMENT_IDS = ["amir-timur-loft", "tashkent-city-panorama"] as const;
const FACT_KEYS = ["size", "bedrooms", "bathrooms", "floor", "wifi", "checkin"] as const;
const AMENITY_KEYS = ["kitchen", "laundry", "workspace", "linen", "climate", "parking", "security"] as const;
const NEARBY_KEYS = ["square", "broadway", "metro", "chorsu", "park"] as const;
const PARAGRAPH_KEYS = ["intro", "space", "area"] as const;

type ApartmentId = (typeof APARTMENT_IDS)[number];

const SPECS: Record<ApartmentId, Pick<Apartment, "floorSize" | "rooms" | "bedrooms" | "bathrooms">> = {
    "amir-timur-loft": { floorSize: 74, rooms: 3, bedrooms: 2, bathrooms: 2 },
    "tashkent-city-panorama": { floorSize: 52, rooms: 2, bedrooms: 1, bathrooms: 1 },
};

export const useApartments = () => {
    const { t } = useI18n();

    const items = computed<Apartment[]>(() =>
        APARTMENT_IDS.map((id) => ({
            id,
            title: t(`apartments.items.${id}.title`),
            summary: t(`apartments.items.${id}.summary`),
            paragraphs: PARAGRAPH_KEYS.map((key) => t(`apartments.items.${id}.paragraphs.${key}`)),
            facts: FACT_KEYS.map((key) => t(`apartments.items.${id}.facts.${key}`)),
            amenities: AMENITY_KEYS.map((key) => t(`apartments.amenities.${key}`)),
            nearby: NEARBY_KEYS.map((key) => t(`apartments.items.${id}.nearby.${key}`)),
            photoBrief: t(`apartments.items.${id}.photo`),
            ...SPECS[id],
        })),
    );

    return { items };
};
