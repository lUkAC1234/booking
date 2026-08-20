export type IconName =
    | "bath"
    | "bed"
    | "building"
    | "calendar"
    | "check"
    | "clock"
    | "document"
    | "heart"
    | "key"
    | "mountain"
    | "pin"
    | "plane"
    | "ruler"
    | "telegram"
    | "train"
    | "users"
    | "whatsapp"
    | "wifi";

export interface CardFact {
    label: string;
    icon: IconName;
}

export type FaqPage = "apartments" | "tours" | "transfer" | "contact";

export interface FaqItem {
    id: string;
    page: FaqPage;
    question: string;
    answer: string;
}

export type SocialProofService = "apartments" | "tours" | "transfer";

export interface SocialProofToast {
    id: string;
    service: SocialProofService;
    messageKey: string;
    count: number;
    item: string;
    minutesAgo: number;
}
