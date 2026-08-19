export const useHeroIntro = (rootRef: Ref<HTMLElement | null>) => {
    onMounted(() => {
        const root = rootRef.value;
        if (!root) return;

        if (prefersReducedMotion()) {
            root.classList.add("hero--reduced");
            return;
        }

        root.classList.add("hero--js");

        const title = root.querySelector<HTMLElement>('[data-hero="title"]');
        let split: ReturnType<typeof splitText> | null = null;

        if (title) {
            title.classList.add("tr", "tr--pending");
            split = splitText(title, "words");
            title.classList.remove("tr--pending");
        }

        const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-hero="card"]'));
        cards.forEach((card, index) => card.style.setProperty("--reveal-i", String(index)));

        let frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => {
                title?.classList.add("is-in");
                root.classList.add("hero-in");
            });
        });

        onBeforeUnmount(() => {
            cancelAnimationFrame(frame);
            split?.revert();
        });
    });
};
