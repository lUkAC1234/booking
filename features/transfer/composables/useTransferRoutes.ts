export interface TransferRoute {
    id: string;
    from: string;
    to: string;
    note: string;
}

export interface TransferFeature {
    id: string;
    label: string;
}

const ROUTE_IDS = [
    "airport-to-center",
    "center-to-airport",
    "airport-to-mountains",
    "night-flights",
    "railway-station",
] as const;

const FEATURE_IDS = [
    "meet-greet",
    "flight-tracking",
    "free-waiting",
    "child-seat",
    "bilingual-driver",
    "vehicle-choice",
] as const;

export const useTransferRoutes = () => {
    const { t } = useI18n();

    const routes = computed<TransferRoute[]>(() =>
        ROUTE_IDS.map((id) => ({
            id,
            from: t(`transfer.routes.${id}.from`),
            to: t(`transfer.routes.${id}.to`),
            note: t(`transfer.routes.${id}.note`),
        })),
    );

    const features = computed<TransferFeature[]>(() =>
        FEATURE_IDS.map((id) => ({ id, label: t(`transfer.features.${id}`) })),
    );

    return { routes, features };
};
