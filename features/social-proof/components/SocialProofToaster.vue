<template>
    <Teleport to="body">
        <Transition name="social-proof">
            <aside
                v-if="visibleToast"
                class="social-proof"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                <span class="social-proof__icon" aria-hidden="true">
                    <SvgIcon :name="ICON_BY_SERVICE[visibleToast.service]" />
                </span>
                <span class="social-proof__body">
                    <span class="social-proof__message">{{ messageOf(visibleToast) }}</span>
                    <span class="social-proof__time">{{ timeOf(visibleToast) }}</span>
                </span>
                <button
                    type="button"
                    class="social-proof__close"
                    :aria-label="t('social-proof.dismiss')"
                    @click="close"
                >
                    <SvgClose />
                </button>
            </aside>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { IconName, SocialProofService, SocialProofToast } from "~/types/models";

const SESSION_KEY = "cca-social-proof-shown";
const FIRST_DELAY_MS = 20000;
const AUTO_DISMISS_MS = 6000;
const MIN_CYCLE_MS = 35000;
const MAX_CYCLE_MS = 55000;
const SCROLL_TRIGGER = 0.25;
const JUST_NOW_BELOW = 2;

const ICON_BY_SERVICE: Record<SocialProofService, IconName> = {
    apartments: "key",
    tours: "mountain",
    transfer: "plane",
};

const { t } = useI18n();
const route = useRoute();
const store = useSocialProofStore();
const { current } = storeToRefs(store);
const { buildQueue } = useSocialProof();

const suppressedRoute = computed(() => route.path.includes("/contact-us"));
const visibleToast = computed(() => (suppressedRoute.value ? null : current.value));

const messageOf = (toast: SocialProofToast) =>
    t(toast.messageKey, { count: toast.count, item: toast.item });

const timeOf = (toast: SocialProofToast) =>
    toast.minutesAgo < JUST_NOW_BELOW
        ? t("social-proof.just-now")
        : t("social-proof.minutes-ago", { count: toast.minutesAgo });

const cycleDelay = ref(MIN_CYCLE_MS);

const { y } = useWindowScroll();
const scrollDepth = computed(() => {
    const root = document.documentElement;
    const scrollable = root.scrollHeight - window.innerHeight;
    return scrollable > 0 ? y.value / scrollable : 0;
});

const { start: startFirstTimer, stop: stopFirstTimer } = useTimeoutFn(
    () => showNext(),
    FIRST_DELAY_MS,
    { immediate: false },
);
const { start: startCycle, stop: stopCycle } = useTimeoutFn(() => showNext(), cycleDelay, {
    immediate: false,
});
const { start: startAutoDismiss, stop: stopAutoDismiss } = useTimeoutFn(
    () => store.dismiss(),
    AUTO_DISMISS_MS,
    { immediate: false },
);

let stopScrollWatch: (() => void) | null = null;

const showNext = () => {
    stopFirstTimer();
    stopCycle();
    stopScrollWatch?.();
    stopScrollWatch = null;
    const shown = store.next();
    if (shown === 0) return;
    window.sessionStorage.setItem(SESSION_KEY, String(shown));
    startAutoDismiss();
    if (store.canShow) {
        cycleDelay.value =
            MIN_CYCLE_MS + Math.floor(Math.random() * (MAX_CYCLE_MS - MIN_CYCLE_MS + 1));
        startCycle();
    }
};

const close = () => {
    stopAutoDismiss();
    stopCycle();
    stopFirstTimer();
    store.dismiss(true);
};

onKeyStroke("Escape", () => {
    if (visibleToast.value) close();
});

onMounted(() => {
    const stored = Number.parseInt(window.sessionStorage.getItem(SESSION_KEY) ?? "", 10);
    store.start(buildQueue(), Number.isFinite(stored) ? stored : 0);
    if (!store.canShow) return;

    startFirstTimer();
    stopScrollWatch = watch(scrollDepth, (depth) => {
        if (depth >= SCROLL_TRIGGER) showNext();
    });
});

onBeforeUnmount(() => {
    stopScrollWatch?.();
    stopScrollWatch = null;
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.social-proof {
    --icon-size: var(--icon-size-md);

    position: fixed;
    left: functions.rem(24);
    bottom: calc(var(--bottom-nav-height) + #{functions.rem(24)});
    z-index: var(--z-toast);
    display: flex;
    align-items: flex-start;
    gap: functions.rem(12);
    max-width: functions.rem(360);
    padding: functions.rem(16);
    background-color: var(--surface);
    border: functions.rem(2) solid var(--border-color);
    border-radius: var(--outer-radius);

    @include bp.down("mobile") {
        left: functions.rem(12);
        right: functions.rem(12);
        max-width: none;
        bottom: calc(var(--bottom-nav-height) + #{functions.rem(12)});
    }

    &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(40);
        height: functions.rem(40);
        border-radius: var(--pill-radius);
        background-color: var(--primary-color);
        color: var(--white);
    }

    &__body {
        display: flex;
        flex-direction: column;
        gap: functions.rem(4);
        flex: 1;
        min-width: 0;
    }

    &__message {
        font-size: var(--fz-body-sm);
        line-height: var(--lh-base);
        color: var(--ink-80);
        text-wrap: pretty;
    }

    &__time {
        font-size: var(--fz-caption);
        line-height: var(--lh-base);
        color: var(--ink-60);
    }

    &__close {
        --icon-size: var(--icon-size-sm);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(44);
        height: functions.rem(44);
        margin: functions.rem(-10) functions.rem(-10) functions.rem(-10) 0;
        padding: 0;
        appearance: none;
        border: 0;
        background-color: transparent;
        border-radius: var(--pill-radius);
        color: var(--ink-60);
        cursor: pointer;
        transition: color var(--dur-micro) var(--ease-decel);

        &:hover,
        &:focus-visible {
            color: var(--ink);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(2);
        }
    }

    @include bp.reduced-motion {
        &__close {
            transition: none;
        }
    }
}

.social-proof-enter-active,
.social-proof-leave-active {
    transition:
        opacity 320ms var(--ease-decel),
        transform 320ms var(--ease-decel);
}

.social-proof-enter-from,
.social-proof-leave-to {
    opacity: 0;
    transform: translate3d(0, functions.rem(16), 0);
}
</style>
