export type ReviewService = "apartments" | "tours" | "transfer";

export interface Review {
    id: string;
    name: string;
    country: string;
    service: ReviewService;
    quote: string;
}

export const REVIEWS_ARE_VERIFIED = false;

const REVIEW_INDEX: ReadonlyArray<{ id: string; service: ReviewService }> = [
    { id: "hannah", service: "apartments" },
    { id: "marco", service: "tours" },
    { id: "yuki", service: "transfer" },
    { id: "daniel", service: "apartments" },
    { id: "elise", service: "tours" },
    { id: "omar", service: "transfer" },
    { id: "sofia", service: "apartments" },
    { id: "james", service: "tours" },
    { id: "anna", service: "transfer" },
    { id: "lukas", service: "tours" },
    { id: "priya", service: "apartments" },
    { id: "mehmet", service: "tours" },
];

export const useReviews = () => {
    const { t } = useI18n();

    const items = computed<Review[]>(() =>
        REVIEW_INDEX.map((entry) => ({
            id: entry.id,
            service: entry.service,
            name: t(`reviews.items.${entry.id}.name`),
            country: t(`reviews.items.${entry.id}.country`),
            quote: t(`reviews.items.${entry.id}.quote`),
        })),
    );

    const half = computed(() => Math.ceil(items.value.length / 2));
    const rowOne = computed<Review[]>(() => items.value.slice(0, half.value));
    const rowTwo = computed<Review[]>(() => items.value.slice(half.value));

    return { items, rowOne, rowTwo };
};
