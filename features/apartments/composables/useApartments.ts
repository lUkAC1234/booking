import type { CardFact, IconName } from "~/types/models";

export interface Apartment {
    id: string;
    title: string;
    summary: string;
    paragraphs: string[];
    facts: CardFact[];
    amenities: string[];
    nearby: string[];
    photoBrief: string;
    floorSize: number;
    rooms: number;
    bedrooms: number;
    bathrooms: number;
}

const APARTMENT_IDS = ["buyuk-turon", "amir-temur"] as const;
const FACT_KEYS = ["size", "rooms", "metro", "bathrooms", "wifi", "checkin"] as const;

const FACT_ICONS: Record<(typeof FACT_KEYS)[number], IconName> = {
    size: "ruler",
    rooms: "bed",
    metro: "train",
    bathrooms: "bath",
    wifi: "wifi",
    checkin: "key",
};

const AMENITY_KEYS = ["wifi", "tv", "kitchen", "climate", "essentials", "furnished", "checkin"] as const;
const NEARBY_KEYS = ["metro", "park", "shop", "food", "transport", "culture", "station"] as const;
const PARAGRAPH_KEYS = ["intro", "space", "area"] as const;

type ApartmentId = (typeof APARTMENT_IDS)[number];

const SPECS: Record<ApartmentId, Pick<Apartment, "floorSize" | "rooms" | "bedrooms" | "bathrooms">> = {
    "buyuk-turon": { floorSize: 55, rooms: 2, bedrooms: 1, bathrooms: 1 },
    "amir-temur": { floorSize: 62, rooms: 2, bedrooms: 1, bathrooms: 1 },
};

export const useApartments = () => {
    const { t } = useI18n();

    const items = computed<Apartment[]>(() =>
        APARTMENT_IDS.map((id) => ({
            id,
            title: t(`apartments.items.${id}.title`),
            summary: t(`apartments.items.${id}.summary`),
            paragraphs: PARAGRAPH_KEYS.map((key) => t(`apartments.items.${id}.paragraphs.${key}`)),
            facts: FACT_KEYS.map((key) => ({
                label: t(`apartments.items.${id}.facts.${key}`),
                icon: FACT_ICONS[key],
            })),
            amenities: AMENITY_KEYS.map((key) => t(`apartments.amenities.${key}`)),
            nearby: NEARBY_KEYS.map((key) => t(`apartments.items.${id}.nearby.${key}`)),
            photoBrief: t(`apartments.items.${id}.photo`),
            ...SPECS[id],
        })),
    );

    return { items };
};
