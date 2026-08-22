import type { DirectiveBinding } from "vue";

type MotionEl = HTMLElement & { __motionCleanup?: () => void };

interface RevealValue {
    variant?: string;
    distance?: number;
    delay?: number;
    stagger?: number;
    duration?: number;
    y?: number;
}

const VARIANT_KEYS = [
    "up",
    "down",
    "left",
    "right",
    "scale",
    "zoom",
    "clip",
    "clipLeft",
] as const;

const variantToAttr = (variant: string): string =>
    variant === "clipLeft" ? "clip-left" : variant;

const resolveVariant = (
    modifiers: Partial<Record<string, boolean>>,
    value?: RevealValue,
): string => {
    if (value?.variant) return value.variant;
    for (const key of VARIANT_KEYS) {
        if (modifiers[key]) return key;
    }
    return "up";
};

const resolveDuration = (modifiers: Partial<Record<string, boolean>>, value?: RevealValue): string | null => {
    if (typeof value?.duration === "number") return `${value.duration}s`;
    if (modifiers.fast) return "0.6s";
    if (modifiers.slow) return "1.1s";
    return null;
};

const armElement = (
    el: HTMLElement,
    variant: string,
    value: RevealValue | undefined,
    modifiers: Partial<Record<string, boolean>>,
): void => {
    el.classList.add("motion", "motion--armed");
    if (variant !== "up") el.setAttribute("data-rv", variantToAttr(variant));

    const distance = value?.distance ?? value?.y;
    if (typeof distance === "number") el.style.setProperty("--rv-d", `${distance}px`);
    if (typeof value?.delay === "number") el.style.setProperty("--rv-delay", `${value.delay}s`);

    const duration = resolveDuration(modifiers, value);
    if (duration) el.style.setProperty("--rv-dur", duration);
};

interface RevealQueueItem {
    el: HTMLElement;
    apply: (inView: boolean) => void;
}

const revealQueue: RevealQueueItem[] = [];
let flushScheduled = false;

const flushReveals = (): void => {
    flushScheduled = false;
    const batch = revealQueue.splice(0, revealQueue.length);
    const decisions = batch.map((item) => {
        const rect = item.el.getBoundingClientRect();
        return { item, inView: rect.top < window.innerHeight && rect.bottom > 0 };
    });
    for (const { item, inView } of decisions) item.apply(inView);
};

const queueReveal = (el: HTMLElement, apply: (inView: boolean) => void): void => {
    revealQueue.push({ el, apply });
    if (!flushScheduled) {
        flushScheduled = true;
        requestAnimationFrame(flushReveals);
    }
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("reveal", {
        mounted(el: MotionEl, binding: DirectiveBinding<RevealValue | undefined>) {
            if (import.meta.server || prefersReducedMotion()) return;

            const value = binding.value;
            const modifiers = binding.modifiers ?? {};

            if (modifiers.text) {
                const mode = modifiers.chars ? "chars" : "words";

                let split: ReturnType<typeof splitText> | null = null;
                let observerCleanup: (() => void) | null = null;
                let cancelled = false;

                queueReveal(el, (inView) => {
                    if (cancelled || inView) return;

                    el.classList.add("tr", "tr--pending");
                    if (typeof value?.stagger === "number") {
                        el.style.setProperty("--tr-stagger", `${value.stagger}s`);
                    }
                    if (typeof value?.duration === "number") {
                        el.style.setProperty("--tr-dur", `${value.duration}s`);
                    }

                    observerCleanup = observeReveal(el, (target) => {
                        split = splitText(el, mode);
                        el.classList.remove("tr--pending");
                        requestAnimationFrame(() =>
                            requestAnimationFrame(() => target.classList.add("is-in")),
                        );
                    });
                });

                el.__motionCleanup = () => {
                    cancelled = true;
                    observerCleanup?.();
                    split?.revert();
                };
                return;
            }

            const variant = resolveVariant(modifiers, value);
            let observerCleanup: (() => void) | null = null;
            let cancelled = false;

            queueReveal(el, (inView) => {
                if (cancelled || inView) return;

                if (typeof value?.stagger === "number") {
                    el.style.setProperty("--rv-stagger", `${value.stagger}s`);
                }

                if (modifiers.stagger || el.hasAttribute("data-reveal-stagger")) {
                    const children = Array.from(el.children).filter(
                        (child): child is HTMLElement => child instanceof HTMLElement,
                    );
                    if (!children.length) return;
                    el.classList.add("motion-stagger");
                    children.forEach((child, index) => {
                        armElement(child, variant, value, modifiers);
                        child.style.setProperty("--reveal-i", String(index));
                    });
                } else {
                    armElement(el, variant, value, modifiers);
                }

                observerCleanup = observeReveal(el, (target) => target.classList.add("is-in"));
            });

            el.__motionCleanup = () => {
                cancelled = true;
                observerCleanup?.();
            };
        },

        unmounted(el: MotionEl) {
            el.__motionCleanup?.();
        },
    });

    nuxtApp.vueApp.directive("parallax", {
        mounted(el: MotionEl, binding: DirectiveBinding<number | { y?: number } | undefined>) {
            if (import.meta.server || prefersReducedMotion()) return;

            const strength =
                typeof binding.value === "number"
                    ? binding.value
                    : (binding.value?.y ?? 12);

            el.setAttribute("data-parallax", "");

            let killed = false;
            let cleanup: (() => void) | null = null;

            useGsap().then((tools) => {
                if (killed || !tools || !el.isConnected) return;
                const { gsap, ScrollTrigger } = tools;
                const tween = gsap.fromTo(
                    el,
                    { yPercent: -strength },
                    {
                        yPercent: strength,
                        ease: "none",
                        scrollTrigger: {
                            trigger: el,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    },
                );
                cleanup = () => {
                    tween.scrollTrigger?.kill();
                    tween.kill();
                };
                ScrollTrigger.refresh();
            });

            el.__motionCleanup = () => {
                killed = true;
                cleanup?.();
            };
        },

        unmounted(el: MotionEl) {
            el.__motionCleanup?.();
        },
    });
});
