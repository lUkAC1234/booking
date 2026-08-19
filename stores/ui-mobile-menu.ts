import { defineStore } from "pinia";

export const useMobileMenuStore = defineStore("ui-mobile-menu", () => {
    const isOpen = ref(false);

    const open = () => {
        isOpen.value = true;
    };

    const close = () => {
        isOpen.value = false;
    };

    const toggle = () => {
        isOpen.value = !isOpen.value;
    };

    return { isOpen, open, close, toggle };
});
