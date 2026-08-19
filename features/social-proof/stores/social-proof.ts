import { defineStore } from "pinia";
import type { SocialProofToast } from "~/types/models";

export const MAX_TOASTS_PER_SESSION = 4;

export const useSocialProofStore = defineStore("social-proof", () => {
    const queue = ref<SocialProofToast[]>([]);
    const current = ref<SocialProofToast | null>(null);
    const shownCount = ref(0);
    const dismissed = ref(false);

    const canShow = computed(
        () =>
            !dismissed.value &&
            shownCount.value < MAX_TOASTS_PER_SESSION &&
            queue.value.length > 0,
    );

    const start = (items: SocialProofToast[], alreadyShown: number) => {
        queue.value = items;
        shownCount.value = alreadyShown;
        current.value = null;
        dismissed.value = false;
    };

    const next = () => {
        if (!canShow.value) return 0;
        const toast = queue.value.shift();
        if (!toast) return 0;
        current.value = toast;
        shownCount.value += 1;
        return shownCount.value;
    };

    const dismiss = (permanent = false) => {
        current.value = null;
        if (permanent) dismissed.value = true;
    };

    return { queue, current, shownCount, dismissed, canShow, start, next, dismiss };
});
