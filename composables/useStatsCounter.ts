interface CounterOptions {
    duration?: number;
    delay?: number;
    once?: boolean;
    stagger?: number;
}

interface CounterState {
    el: HTMLElement;
    target: number;
    decimals: number;
    prefix: string;
    suffix: string;
    finalText: string;
}

const READY_ATTR = "data-counter-ready";
const FAILSAFE_MS = 2500;

const formatValue = (state: CounterState, value: number) => {
    const num = state.decimals > 0 ? value.toFixed(state.decimals) : Math.round(value).toString();
    return `${state.prefix}${num}${state.suffix}`;
};

const parseEl = (el: HTMLElement): CounterState | null => {
    const raw = el.dataset.counterTarget || el.textContent || "";
    const match = raw.replace(/\s+/g, "").match(/^-?\d+(?:[.,]\d+)?/);
    if (!match) return null;
    const target = parseFloat(match[0].replace(",", "."));
    if (!isFinite(target) || target <= 0) return null;

    const decimals = parseInt(el.dataset.counterDecimals || "0", 10) || 0;
    const prefix = el.dataset.counterPrefix || "";
    const suffix = el.dataset.counterSuffix || "";

    const state: CounterState = { el, target, decimals, prefix, suffix, finalText: "" };
    state.finalText = formatValue(state, target);
    return state;
};

const isInViewport = (el: HTMLElement) => {
    if (typeof window === "undefined") return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
};

const markReady = (el: HTMLElement) => {
    el.setAttribute(READY_ATTR, "");
};

const finalize = (state: CounterState) => {
    state.el.textContent = state.finalText;
    markReady(state.el);
};

export const useStatsCounter = (
    rootRef: Ref<HTMLElement | null>,
    selector: string,
    options: CounterOptions = {},
) => {
    onMounted(() => {
        if (!rootRef.value) return;

        const root = rootRef.value;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
        const counterStates: CounterState[] = [];

        elements.forEach((el) => {
            const state = parseEl(el);
            if (state) {
                counterStates.push(state);
            } else {
                markReady(el);
            }
        });

        if (!counterStates.length) return;

        if (reduced) {
            counterStates.forEach(finalize);
            return;
        }

        const started = new WeakSet<HTMLElement>();

        let ctx: gsap.Context | null = null;
        let frameId = 0;
        let failsafeId = window.setTimeout(() => {
            counterStates.forEach((state) => {
                if (!started.has(state.el)) {
                    started.add(state.el);
                    finalize(state);
                }
            });
        }, FAILSAFE_MS);

        const cancelFailsafe = () => {
            if (failsafeId !== 0) {
                clearTimeout(failsafeId);
                failsafeId = 0;
            }
        };

        frameId = window.requestAnimationFrame(async () => {
            frameId = 0;
            let tools: Awaited<ReturnType<typeof useGsap>> = null;
            try {
                tools = await useGsap();
            } catch {
                tools = null;
            }

            if (!tools || !rootRef.value) {
                cancelFailsafe();
                counterStates.forEach((state) => {
                    if (!started.has(state.el)) {
                        started.add(state.el);
                        finalize(state);
                    }
                });
                return;
            }
            const { gsap, ScrollTrigger } = tools;

            const duration = options.duration ?? 1.8;
            const stagger = options.stagger ?? 0.12;
            const baseDelay = options.delay ?? 0;
            const once = options.once !== false;

            ctx = gsap.context(() => {
                counterStates.forEach((state, idx) => {
                    const tween = { val: 0 };
                    const snap = state.decimals > 0 ? 1 / Math.pow(10, state.decimals) : 1;
                    const counterDelay = baseDelay + idx * stagger;

                    const startCount = () => {
                        if (started.has(state.el)) return;
                        started.add(state.el);

                        let revealed = false;
                        const reveal = () => {
                            if (revealed) return;
                            revealed = true;
                            markReady(state.el);
                        };

                        const revealFailsafeId = window.setTimeout(() => {
                            state.el.textContent = state.finalText;
                            reveal();
                        }, (counterDelay + 0.5) * 1000);

                        gsap.to(tween, {
                            val: state.target,
                            duration,
                            ease: "expo.out",
                            delay: counterDelay,
                            snap: { val: snap },
                            onUpdate: () => {
                                const next = formatValue(state, tween.val);
                                if (tween.val > 0) {
                                    state.el.textContent = next;
                                    clearTimeout(revealFailsafeId);
                                    reveal();
                                }
                            },
                            onComplete: () => {
                                state.el.textContent = state.finalText;
                                clearTimeout(revealFailsafeId);
                                reveal();
                            },
                        });
                    };

                    if (isInViewport(state.el)) {
                        startCount();
                        return;
                    }

                    ScrollTrigger.create({
                        trigger: state.el,
                        start: "top 95%",
                        once,
                        onEnter: startCount,
                    });
                });
            }, root);
        });

        onBeforeUnmount(() => {
            cancelFailsafe();
            if (frameId !== 0) {
                cancelAnimationFrame(frameId);
                frameId = 0;
            }
            ctx?.revert();
        });
    });
};
