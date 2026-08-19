type ScrollDirection = "up" | "down" | "idle";

export const useScrollDirection = (threshold = 8) => {
    const direction = ref<ScrollDirection>("idle");
    const scrollY = ref(0);

    if (import.meta.server) {
        return { direction, scrollY };
    }

    let lastY = 0;
    let frame = 0;

    const onScroll = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
            const y = window.scrollY;
            const diff = y - lastY;
            if (Math.abs(diff) > threshold) {
                direction.value = diff > 0 ? "down" : "up";
                lastY = y;
            }
            scrollY.value = y;
            frame = 0;
        });
    };

    onMounted(() => {
        lastY = window.scrollY;
        scrollY.value = lastY;
    });

    useEventListener(typeof window !== "undefined" ? window : null, "scroll", onScroll, { passive: true });

    onBeforeUnmount(() => {
        if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        }
    });

    return { direction, scrollY };
};
