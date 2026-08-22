import type { CardFact, GalleryPhoto, IconName } from "~/types/models";

export interface NearbyPlace {
    name: string;
    distance: string;
}

export interface Apartment {
    id: string;
    title: string;
    summary: string;
    facts: CardFact[];
    photos: GalleryPhoto[];
    amenities: string[];
    nearby: NearbyPlace[];
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

type ApartmentId = (typeof APARTMENT_IDS)[number];

const NEARBY_SEPARATOR = " — ";

const toNearbyPlace = (value: string): NearbyPlace => {
    const separatorIndex = value.lastIndexOf(NEARBY_SEPARATOR);
    if (separatorIndex === -1) return { name: value, distance: "" };
    return {
        name: value.slice(0, separatorIndex),
        distance: value.slice(separatorIndex + NEARBY_SEPARATOR.length),
    };
};

const PHOTO_FOLDERS: Record<ApartmentId, string> = {
    "buyuk-turon": "apartment2",
    "amir-temur": "apartment1",
};

const PHOTO_COUNTS: Record<ApartmentId, number> = {
    "buyuk-turon": 7,
    "amir-temur": 8,
};

const SPECS: Record<ApartmentId, Pick<Apartment, "floorSize" | "rooms" | "bedrooms" | "bathrooms">> = {
    "buyuk-turon": { floorSize: 55, rooms: 2, bedrooms: 1, bathrooms: 1 },
    "amir-temur": { floorSize: 62, rooms: 2, bedrooms: 1, bathrooms: 1 },
};

export const useApartments = () => {
    const { t } = useI18n();

    const amenities = computed(() => AMENITY_KEYS.map((key) => t(`apartments.amenities.${key}`)));

    const photosFor = (id: ApartmentId, title: string): GalleryPhoto[] =>
        Array.from({ length: PHOTO_COUNTS[id] }, (_, position) => {
            const index = position + 1;
            return {
                id: `${id}-${index}`,
                src: `/images/${PHOTO_FOLDERS[id]}/image${index}.webp`,
                alt: t("apartments.photo-alt", { title, index }),
            };
        });

    const items = computed<Apartment[]>(() =>
        APARTMENT_IDS.map((id) => ({
            id,
            title: t(`apartments.items.${id}.title`),
            summary: t(`apartments.items.${id}.summary`),
            photos: photosFor(id, t(`apartments.items.${id}.title`)),
            facts: FACT_KEYS.map((key) => ({
                label: t(`apartments.items.${id}.facts.${key}`),
                icon: FACT_ICONS[key],
            })),
            amenities: amenities.value,
            nearby: NEARBY_KEYS.map((key) => toNearbyPlace(t(`apartments.items.${id}.nearby.${key}`))),
            photoBrief: t(`apartments.items.${id}.photo`),
            ...SPECS[id],
        })),
    );

    return { items, amenities };
};
