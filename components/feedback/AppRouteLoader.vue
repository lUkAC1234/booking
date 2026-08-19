<template>
    <Teleport to="body">
        <Transition name="app-route-loader">
            <div
                v-if="visible"
                class="app-route-loader"
                role="status"
                :aria-label="t('common.loading')"
            >
                <span class="app-route-loader__panel" aria-hidden="true" />
                <span class="app-route-loader__spinner" aria-hidden="true" />
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
const { t } = useI18n();

const SHOW_THRESHOLD_MS = 200;

const visible = ref(false);
let showTimer: ReturnType<typeof setTimeout> | null = null;
let scrollLocked = false;
let savedHtmlPad = "";
let savedHtmlOverflow = "";
let savedBodyOverflow = "";

const lockScroll = () => {
    if (scrollLocked || !import.meta.client) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    savedHtmlPad = html.style.paddingRight;
    savedHtmlOverflow = html.style.overflow;
    savedBodyOverflow = body.style.overflow;
    if (scrollbarWidth > 0) {
        html.style.paddingRight = `${scrollbarWidth}px`;
    }
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    scrollLocked = true;
};

const unlockScroll = () => {
    if (!scrollLocked || !import.meta.client) return;
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = savedHtmlOverflow;
    body.style.overflow = savedBodyOverflow;
    html.style.paddingRight = savedHtmlPad;
    scrollLocked = false;
};

const clearShowTimer = () => {
    if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
    }
};

const start = () => {
    clearShowTimer();
    showTimer = setTimeout(() => {
        visible.value = true;
        lockScroll();
    }, SHOW_THRESHOLD_MS);
};

const finish = () => {
    clearShowTimer();
    if (visible.value) {
        visible.value = false;
        unlockScroll();
    }
};

const nuxtApp = useNuxtApp();

if (import.meta.client) {
    nuxtApp.hook("page:loading:start", start);
    nuxtApp.hook("page:loading:end", finish);
    nuxtApp.hook("vue:error", finish);
    nuxtApp.hook("app:error", finish);
}

onBeforeUnmount(() => {
    clearShowTimer();
    unlockScroll();
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.app-route-loader {
    position: fixed;
    inset: 0;
    z-index: var(--z-toast, 9000);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;

    &__panel {
        position: absolute;
        inset: 0;
        background-color: var(--surface);
    }

    &__spinner {
        position: relative;
        display: inline-block;
        width: functions.rem(40);
        height: functions.rem(40);
        border-radius: 50%;
        border: functions.rem(4) solid var(--ink-20);
        border-top-color: var(--primary-color);
        border-right-color: var(--primary-color);
        animation: app-route-loader-spin 700ms linear infinite;
        will-change: transform;
    }
}

@keyframes app-route-loader-spin {
    to {
        transform: rotate(360deg);
    }
}

.app-route-loader-enter-active,
.app-route-loader-leave-active {
    transition: opacity 220ms var(--ease-decel);
    will-change: opacity;
}

.app-route-loader-enter-from,
.app-route-loader-leave-to {
    opacity: 0;
}

@include bp.reduced-motion {
    .app-route-loader__spinner {
        animation-duration: 1400ms;
    }

    .app-route-loader-enter-active,
    .app-route-loader-leave-active {
        transition: opacity 120ms linear;
    }
}
</style>
