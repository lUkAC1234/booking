<template>
    <div ref="rootEl" class="base-dropdown" :data-placement-y="placementY" :data-placement-x="placementX">
        <slot :toggle="toggle" :open="open" :close="close" :is-open="isOpen" :panel-id="panelId" />
        <Teleport to="body" :disabled="!teleport || !teleportReady">
            <Transition name="base-dropdown" @before-enter="measure" @enter="measure">
                <div
                    v-show="isOpen"
                    :id="panelId"
                    ref="panelEl"
                    class="base-dropdown__panel"
                    :class="{ 'base-dropdown__panel--teleported': teleport }"
                    :data-placement-y="placementY"
                    :data-placement-x="placementX"
                    role="listbox"
                    :style="panelStyle"
                >
                    <slot name="panel" :close="close" :is-open="isOpen" />
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";

type Placement = "auto" | "top" | "bottom";
type Align = "auto" | "left" | "right";

interface Props {
    placement?: Placement;
    align?: Align;
    offset?: number;
    closeOnRouteChange?: boolean;
    teleport?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    placement: "auto",
    align: "auto",
    offset: 8,
    closeOnRouteChange: true,
    teleport: false,
});

const emit = defineEmits<{ open: []; close: [] }>();

const rootEl = ref<HTMLElement | null>(null);
const panelEl = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const placementY = ref<"top" | "bottom">("bottom");
const placementX = ref<"left" | "right">("right");
const panelTop = ref(0);
const panelLeft = ref(0);
const panelId = useId();

const teleportReady = ref(false);
onMounted(() => {
    teleportReady.value = true;
});

const panelStyle = computed<CSSProperties>(() => {
    const base: CSSProperties = {
        "--dropdown-offset": `${props.offset / 16}rem`,
    };
    if (props.teleport) {
        return {
            ...base,
            top: `${panelTop.value}px`,
            left: `${panelLeft.value}px`,
        };
    }
    return base;
});

const measure = () => {
    if (!rootEl.value || !panelEl.value) return;

    const rootRect = rootEl.value.getBoundingClientRect();
    const panelHeight = panelEl.value.offsetHeight;
    const panelWidth = panelEl.value.offsetWidth;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const offset = props.offset;

    if (props.placement === "auto") {
        const spaceBelow = vh - rootRect.bottom;
        const spaceAbove = rootRect.top;

        if (panelHeight > 0) {
            const fitsBelow = spaceBelow >= panelHeight + offset;
            const fitsAbove = spaceAbove >= panelHeight + offset;
            if (fitsBelow && spaceBelow >= spaceAbove) {
                placementY.value = "bottom";
            } else if (fitsAbove) {
                placementY.value = "top";
            } else if (fitsBelow) {
                placementY.value = "bottom";
            } else {
                placementY.value = spaceAbove > spaceBelow ? "top" : "bottom";
            }
        } else {
            placementY.value = spaceAbove > spaceBelow ? "top" : "bottom";
        }
    } else {
        placementY.value = props.placement === "top" ? "top" : "bottom";
    }

    if (props.align === "auto") {
        const roomLeftOfTriggerRight = rootRect.right;
        const roomRightOfTriggerLeft = vw - rootRect.left;

        if (panelWidth > 0) {
            const fitsRightAligned = roomLeftOfTriggerRight >= panelWidth;
            const fitsLeftAligned = roomRightOfTriggerLeft >= panelWidth;
            if (fitsRightAligned) {
                placementX.value = "right";
            } else if (fitsLeftAligned) {
                placementX.value = "left";
            } else {
                placementX.value = roomLeftOfTriggerRight >= roomRightOfTriggerLeft ? "right" : "left";
            }
        } else {
            placementX.value = roomLeftOfTriggerRight >= roomRightOfTriggerLeft ? "right" : "left";
        }
    } else {
        placementX.value = props.align === "left" ? "left" : "right";
    }

    if (props.teleport) {
        if (placementY.value === "bottom") {
            panelTop.value = rootRect.bottom + offset;
        } else {
            panelTop.value = rootRect.top - panelHeight - offset;
        }
        if (placementX.value === "left") {
            panelLeft.value = rootRect.left;
        } else {
            panelLeft.value = rootRect.right - panelWidth;
        }
    }
};

const open = async () => {
    if (isOpen.value) return;
    isOpen.value = true;
    emit("open");
    await nextTick();
    measure();
};

const close = () => {
    if (!isOpen.value) return;
    isOpen.value = false;
    emit("close");
};

const toggle = () => {
    if (isOpen.value) {
        close();
    } else {
        open();
    }
};

onClickOutside(rootEl, () => close(), { ignore: [panelEl] });
onKeyStroke("Escape", () => close());

useResizeObserver(panelEl, () => {
    if (isOpen.value) measure();
});

useEventListener(
    "scroll",
    () => {
        if (isOpen.value) measure();
    },
    { passive: true, capture: true },
);

useEventListener(
    "resize",
    () => {
        if (isOpen.value) measure();
    },
    { passive: true },
);

if (props.closeOnRouteChange) {
    const route = useRoute();
    watch(
        () => route.fullPath,
        () => close(),
    );
}

defineExpose({ open, close, toggle, isOpen });
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/mixins" as mixins;

.base-dropdown {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;

    &__panel {
        @include mixins.on-light;

        position: absolute;
        z-index: var(--z-dropdown);
        margin: 0;
        padding: functions.rem(6);
        list-style: none;
        background-color: var(--surface);
        border: functions.rem(2) solid var(--border-color);
        border-radius: functions.rem(12);
        min-width: 100%;
        color: var(--ink);
    }

    &[data-placement-y="bottom"] &__panel:not(&__panel--teleported) {
        top: calc(100% + var(--dropdown-offset));
    }

    &[data-placement-y="top"] &__panel:not(&__panel--teleported) {
        bottom: calc(100% + var(--dropdown-offset));
    }

    &[data-placement-x="right"] &__panel:not(&__panel--teleported) {
        right: 0;
    }

    &[data-placement-x="left"] &__panel:not(&__panel--teleported) {
        left: 0;
    }

    &[data-placement-y="bottom"][data-placement-x="right"] &__panel:not(&__panel--teleported) {
        transform-origin: top right;
    }

    &[data-placement-y="bottom"][data-placement-x="left"] &__panel:not(&__panel--teleported) {
        transform-origin: top left;
    }

    &[data-placement-y="top"][data-placement-x="right"] &__panel:not(&__panel--teleported) {
        transform-origin: bottom right;
    }

    &[data-placement-y="top"][data-placement-x="left"] &__panel:not(&__panel--teleported) {
        transform-origin: bottom left;
    }
}

.base-dropdown__panel--teleported {
    position: fixed;
    z-index: var(--z-modal);
    width: max-content;
    min-width: 0;
    max-width: calc(100vw - #{functions.rem(32)});
    margin: 0;
    padding: functions.rem(6);
    list-style: none;
    background-color: var(--surface);
    border: functions.rem(2) solid var(--border-color);
    border-radius: functions.rem(12);
    color: var(--ink);

    &[data-placement-y="bottom"][data-placement-x="right"] {
        transform-origin: top right;
    }

    &[data-placement-y="bottom"][data-placement-x="left"] {
        transform-origin: top left;
    }

    &[data-placement-y="top"][data-placement-x="right"] {
        transform-origin: bottom right;
    }

    &[data-placement-y="top"][data-placement-x="left"] {
        transform-origin: bottom left;
    }
}

.base-dropdown-enter-active,
.base-dropdown-leave-active {
    transition:
        opacity 220ms var(--ease-decel),
        transform 220ms var(--ease-decel);
}

@include bp.reduced-motion {
    .base-dropdown-enter-active,
    .base-dropdown-leave-active {
        transition: none;
    }
}

.base-dropdown-enter-from,
.base-dropdown-leave-to {
    opacity: 0;
    transform: scale(0.96) translateY(functions.rem(-4));
}

.base-dropdown[data-placement-y="top"] {
    .base-dropdown-enter-from,
    .base-dropdown-leave-to {
        transform: scale(0.96) translateY(functions.rem(4));
    }
}
</style>
