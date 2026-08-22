import { defineStore } from "pinia";
import type { SocialProofToast } from "~/types/models";

export const useSocialProofStore = defineStore("social-proof", () => {
    const queue = ref<SocialProofToast[]>([]);
    const current = ref<SocialProofToast | null>(null);
    const stopped = ref(false);

    const setQueue = (items: SocialProofToast[]) => {
        queue.value = items;
    };

    const next = (): SocialProofToast | null => {
        if (stopped.value) return null;
        current.value = queue.value.shift() ?? null;
        return current.value;
    };

    const dismiss = () => {
        current.value = null;
    };

    const stop = () => {
        current.value = null;
        stopped.value = true;
    };

    return { queue, current, stopped, setQueue, next, dismiss, stop };
});
