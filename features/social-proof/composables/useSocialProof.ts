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

const SEEN_KEY = "cca-social-proof-seen";
const MIN_COUNT = 2;
const MAX_COUNT = 5;

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

const readSeen = (): string[] => {
    if (!import.meta.client) return [];
    try {
        const stored: unknown = JSON.parse(window.localStorage.getItem(SEEN_KEY) ?? "[]");
        if (!Array.isArray(stored)) return [];
        return stored.filter((entry): entry is string => typeof entry === "string");
    } catch {
        return [];
    }
};

const writeSeen = (keys: string[]): void => {
    if (!import.meta.client) return;
    try {
        window.localStorage.setItem(SEEN_KEY, JSON.stringify(keys));
    } catch {
        return;
    }
};

export const useSocialProof = () => {
    const { items: apartments } = useApartments();
    const { items: tours } = useTours();

    const titlesFor = (service: SocialProofService) => {
        if (service === "apartments") return apartments.value.map((apartment) => apartment.title);
        if (service === "tours") return tours.value.map((tour) => tour.title);
        return [];
    };

    const toastFor = (template: MessageTemplate): SocialProofToast => {
        const titles = template.withItem ? titlesFor(template.service) : [];
        return {
            id: template.key,
            service: template.service,
            messageKey: `social-proof.messages.${template.key}`,
            count: randomInt(MIN_COUNT, MAX_COUNT),
            item: titles.length > 0 ? titles[randomInt(0, titles.length - 1)] : "",
        };
    };

    const buildQueue = (): SocialProofToast[] => {
        const seen = new Set(readSeen());
        const unseen = MESSAGE_TEMPLATES.filter((template) => !seen.has(template.key));
        if (unseen.length === 0) {
            writeSeen([]);
            return shuffle(MESSAGE_TEMPLATES).map(toastFor);
        }
        return shuffle(unseen).map(toastFor);
    };

    const markSeen = (key: string): void => {
        const seen = readSeen();
        if (seen.includes(key)) return;
        writeSeen([...seen, key]);
    };

    return { buildQueue, markSeen };
};
