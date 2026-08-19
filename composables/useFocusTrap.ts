import type { Ref } from "vue";

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

const focusedElement = (): HTMLElement | null =>
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

export const useFocusTrap = (container: Ref<HTMLElement | null>, isActive: () => boolean) => {
    let previouslyFocused: HTMLElement | null = null;

    const focusable = (): HTMLElement[] => {
        const root = container.value;
        if (!root) return [];
        return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
        );
    };

    const onKeydown = (event: KeyboardEvent) => {
        if (!isActive() || event.key !== "Tab") return;
        const root = container.value;
        if (!root) return;
        const items = focusable();
        if (items.length === 0) {
            event.preventDefault();
            root.focus();
            return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = focusedElement();
        const inside = active !== null && root.contains(active);
        if (event.shiftKey) {
            if (!inside || active === first) {
                event.preventDefault();
                last.focus();
            }
        } else if (!inside || active === last) {
            event.preventDefault();
            first.focus();
        }
    };

    useEventListener(() => (import.meta.client ? document : undefined), "keydown", onKeydown, {
        capture: true,
    });

    watch(isActive, (active) => {
        if (import.meta.server) return;
        if (active) {
            previouslyFocused = focusedElement();
            nextTick(() => {
                const items = focusable();
                (items[0] ?? container.value)?.focus();
            });
        } else {
            previouslyFocused?.focus?.();
            previouslyFocused = null;
        }
    });
};
