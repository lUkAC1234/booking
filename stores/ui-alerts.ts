import { defineStore } from "pinia";

export type AlertType = "success" | "error" | "info";

export interface AlertItem {
    id: number;
    type: AlertType;
    message: string;
    createdAt: number;
}

let counter = 0;

export const useAlertsStore = defineStore("ui-alerts", () => {
    const items = ref<AlertItem[]>([]);

    const push = (type: AlertType, message: string, ttl = 4000) => {
        const id = ++counter;
        items.value.push({ id, type, message, createdAt: Date.now() });
        if (ttl > 0) {
            setTimeout(() => dismiss(id), ttl);
        }
        return id;
    };

    const dismiss = (id: number) => {
        items.value = items.value.filter((item) => item.id !== id);
    };

    const clear = () => {
        items.value = [];
    };

    return { items, push, dismiss, clear };
});
