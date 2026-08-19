import type { SocialProofService, SocialProofToast } from "~/types/models";

interface MessageTemplate {
    key: string;
    service: SocialProofService;
    withItem: boolean;
}

const MESSAGE_TEMPLATES: ReadonlyArray<MessageTemplate> = [
    { key: "apartment-viewing", service: "apartments", withItem: true },
    { key: "apartment-booked", service: "apartments", withItem: true },
    { key: "apartment-enquiries", service: "apartments", withItem: false },
    { key: "apartment-checkin", service: "apartments", withItem: false },
    { key: "tour-booked", service: "tours", withItem: true },
    { key: "tour-joined", service: "tours", withItem: true },
    { key: "tour-asked", service: "tours", withItem: true },
    { key: "tour-planning", service: "tours", withItem: false },
    { key: "tour-weekend", service: "tours", withItem: false },
    { key: "transfer-confirmed", service: "transfer", withItem: false },
    { key: "transfer-night", service: "transfer", withItem: false },
    { key: "transfer-meeting", service: "transfer", withItem: false },
    { key: "transfer-booked", service: "transfer", withItem: false },
    { key: "transfer-times", service: "transfer", withItem: false },
];

const MIN_COUNT = 2;
const MAX_COUNT = 5;
const MAX_MINUTES_AGO = 9;

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const shuffle = <T>(source: readonly T[]): T[] => {
    const items = [...source];
    for (let index = items.length - 1; index > 0; index -= 1) {
        const target = randomInt(0, index);
        const held = items[index];
        items[index] = items[target];
        items[target] = held;
    }
    return items;
};

export const useSocialProof = () => {
    const { items: apartments } = useApartments();
    const { items: tours } = useTours();

    const titlesFor = (service: SocialProofService) => {
        if (service === "apartments") return apartments.value.map((apartment) => apartment.title);
        if (service === "tours") return tours.value.map((tour) => tour.title);
        return [];
    };

    const buildQueue = (): SocialProofToast[] =>
        shuffle(MESSAGE_TEMPLATES).map((template, index) => {
            const titles = template.withItem ? titlesFor(template.service) : [];
            return {
                id: `${template.key}-${index}`,
                service: template.service,
                messageKey: `social-proof.messages.${template.key}`,
                count: randomInt(MIN_COUNT, MAX_COUNT),
                item: titles.length > 0 ? titles[randomInt(0, titles.length - 1)] : "",
                minutesAgo: randomInt(0, MAX_MINUTES_AGO),
            };
        });

    return { buildQueue };
};
