import type { FaqItem, FaqPage } from "~/types/models";

const FAQ_INDEX: ReadonlyArray<{ id: string; page: FaqPage }> = [
    { id: "how-to-book", page: "contact" },
    { id: "languages", page: "contact" },
    { id: "payment", page: "contact" },
    { id: "check-in", page: "apartments" },
    { id: "min-stay", page: "apartments" },
    { id: "location", page: "apartments" },
    { id: "amirsoy-distance", page: "tours" },
    { id: "tour-season", page: "tours" },
    { id: "tour-pickup", page: "tours" },
    { id: "airport-meeting", page: "transfer" },
    { id: "flight-delay", page: "transfer" },
    { id: "child-seat", page: "transfer" },
];

export const useFaq = (page?: FaqPage) => {
    const { t } = useI18n();

    const items = computed<FaqItem[]>(() =>
        FAQ_INDEX.filter((entry) => !page || entry.page === page).map((entry) => ({
            id: entry.id,
            page: entry.page,
            question: t(`faq.items.${entry.id}.question`),
            answer: t(`faq.items.${entry.id}.answer`),
        })),
    );

    return { items };
};
