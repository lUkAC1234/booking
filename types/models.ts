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
