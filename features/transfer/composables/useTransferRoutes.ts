import type { IconName } from "~/types/models";

export interface TransferRoute {
    id: string;
    from: string;
    to: string;
    note: string;
    icon: IconName;
}

export interface TransferFeature {
    id: string;
    label: string;
}

const ROUTE_ENTRIES: ReadonlyArray<{ id: string; icon: IconName }> = [
    { id: "airport-to-center", icon: "plane" },
    { id: "center-to-airport", icon: "plane" },
    { id: "airport-to-mountains", icon: "mountain" },
    { id: "night-flights", icon: "clock" },
    { id: "railway-station", icon: "train" },
];

const FEATURE_IDS = [
    "meet-greet",
    "flight-tracking",
    "free-waiting",
    "child-seat",
    "bilingual-driver",
    "one-car",
] as const;

export const useTransferRoutes = () => {
    const { t } = useI18n();

    const routes = computed<TransferRoute[]>(() =>
        ROUTE_ENTRIES.map((entry) => ({
            id: entry.id,
            icon: entry.icon,
            from: t(`transfer.routes.${entry.id}.from`),
            to: t(`transfer.routes.${entry.id}.to`),
            note: t(`transfer.routes.${entry.id}.note`),
        })),
    );

    const features = computed<TransferFeature[]>(() =>
        FEATURE_IDS.map((id) => ({ id, label: t(`transfer.features.${id}`) })),
    );

    return { routes, features };
};
