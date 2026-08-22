<template>
    <Teleport to="body">
        <Transition name="social-proof">
            <aside
                v-if="visibleToast"
                :key="visibleToast.id"
                class="social-proof"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                <span class="social-proof__icon" aria-hidden="true">
                    <SvgIcon :name="ICON_BY_SERVICE[visibleToast.service]" />
                </span>

                <p class="social-proof__message">{{ messageOf(visibleToast) }}</p>

                <button
                    type="button"
                    class="social-proof__close"
                    :aria-label="t('social-proof.dismiss')"
                    @click="close"
                >
                    <SvgClose />
                </button>

                <span class="social-proof__timer" aria-hidden="true" @animationend="onTimerEnd" />
            </aside>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { IconName, SocialProofService, SocialProofToast } from "~/types/models";

const FIRST_DELAY_MS = 30000;
const MIN_GAP_MS = 45000;
const MAX_GAP_MS = 75000;

const ICON_BY_SERVICE: Record<SocialProofService, IconName> = {
    apartments: "key",
    tours: "mountain",
    transfer: "plane",
};

const { t } = useI18n();
const route = useRoute();
const store = useSocialProofStore();
const { current } = storeToRefs(store);
const { buildQueue, markSeen } = useSocialProof();

const suppressedRoute = computed(() => route.path.includes("/contact-us"));
const visibleToast = computed(() => (suppressedRoute.value ? null : current.value));

const messageOf = (toast: SocialProofToast) => t(toast.messageKey, { count: toast.count, item: toast.item });

const gapDelay = ref(FIRST_DELAY_MS);

const { start: startGap, stop: stopGap } = useTimeoutFn(() => showNext(), gapDelay, { immediate: false });

const scheduleNext = () => {
    gapDelay.value = MIN_GAP_MS + Math.floor(Math.random() * (MAX_GAP_MS - MIN_GAP_MS + 1));
    startGap();
};

const showNext = () => {
    if (store.stopped) return;
    if (store.queue.length === 0) store.setQueue(buildQueue());
    const toast = store.next();
    if (!toast) return;
    markSeen(toast.id);
};

const onTimerEnd = () => {
    store.dismiss();
    scheduleNext();
};

const close = () => {
    stopGap();
    store.stop();
};

onKeyStroke("Escape", () => {
    if (visibleToast.value) close();
});

onMounted(() => {
    store.setQueue(buildQueue());
    startGap();
});

onBeforeUnmount(() => stopGap());
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.social-proof {
    --icon-size: var(--icon-size-md);

    position: fixed;
    right: functions.rem(24);
    bottom: calc(var(--bottom-nav-height) + #{functions.rem(24)});
    z-index: var(--z-toast);
    width: min(#{functions.rem(380)}, calc(100vw - #{functions.rem(48)}));
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: functions.rem(14);
    padding: functions.rem(14) functions.rem(16);
    overflow: hidden;
    background-color: var(--surface);
    border: functions.rem(2) solid var(--border-color);
    border-radius: var(--inner-radius);

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

    &__message {
        margin: 0;
        font-size: var(--fz-body-sm);
        line-height: var(--lh-base);
        color: var(--ink);
        text-wrap: pretty;
    }

    &__close {
        --icon-size: var(--icon-size-sm);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(44);
        height: functions.rem(44);
        margin: functions.rem(-8) functions.rem(-8) functions.rem(-8) 0;
        padding: 0;
        appearance: none;
        border: 0;
        background-color: transparent;
        border-radius: var(--pill-radius);
        color: var(--ink-40);
        cursor: pointer;
        transition: color var(--dur-micro) var(--ease-decel);

        &:hover,
        &:focus-visible {
            color: var(--ink);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(-2);
        }

        @include bp.reduced-motion {
            transition: none;
        }
    }

    &__timer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: functions.rem(2);
        background-color: var(--primary-color);
        transform-origin: left center;
        animation: social-proof-timer 7s linear forwards;
    }

    @include bp.down("mobile") {
        right: functions.rem(12);
        left: functions.rem(12);
        bottom: calc(var(--bottom-nav-height) + #{functions.rem(12)});
        width: auto;
        gap: functions.rem(12);
    }
}

@keyframes social-proof-timer {
    from {
        transform: scaleX(1);
    }

    to {
        transform: scaleX(0);
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
