<template>
    <Teleport to="body">
        <Transition name="base-modal">
            <div
                v-if="open"
                ref="dialogRef"
                class="base-modal"
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                @click.self="close"
                @keydown.esc="close"
            >
                <div
                    class="base-modal__panel"
                    :class="`base-modal__panel--${size}`"
                    :aria-labelledby="title ? titleId : undefined"
                >
                    <button
                        class="base-modal__close"
                        type="button"
                        :aria-label="ariaLabelClose"
                        @click="close"
                    >
                        <SvgClose />
                    </button>
                    <h2 v-if="title" :id="titleId" class="base-modal__title">{{ title }}</h2>
                    <div class="base-modal__body">
                        <slot />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
interface Props {
    open: boolean;
    title?: string;
    ariaLabelClose?: string;
    size?: "default" | "wide";
}

const props = withDefaults(defineProps<Props>(), {
    title: undefined,
    ariaLabelClose: "Close",
    size: "default",
});

const emit = defineEmits<{ close: [] }>();
const titleId = useId();
const dialogRef = ref<HTMLElement | null>(null);

useFocusTrap(dialogRef, () => props.open);

const close = () => emit("close");

const scrollLocked = useScrollLock(import.meta.client ? document.documentElement : null);
watch(
    () => props.open,
    (open) => {
        scrollLocked.value = open;
    },
);

onKeyStroke("Escape", () => {
    if (props.open) close();
});

onBeforeUnmount(() => {
    scrollLocked.value = false;
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.base-modal {
    --icon-size: #{functions.rem(20)};

    position: fixed;
    inset: 0;
    z-index: var(--z-modal);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: functions.rem(24);
    background-color: rgba(10, 10, 15, 0.6);

    @include bp.down("mobile") {
        padding: functions.rem(16);
    }

    &__panel {
        position: relative;
        width: 100%;
        background-color: var(--surface);
        border-radius: functions.rem(28);
        padding: functions.rem(40);
        max-height: min(90dvh, #{functions.rem(800)});
        overflow-y: auto;
        overscroll-behavior: contain;

        @include bp.down("mobile") {
            padding: functions.rem(28);
            border-radius: functions.rem(24);
            max-height: 88dvh;
        }

        &--default {
            max-width: functions.rem(520);
        }

        &--wide {
            max-width: functions.rem(640);
        }
    }

    &__close {
        position: absolute;
        top: functions.rem(16);
        right: functions.rem(16);
        width: functions.rem(40);
        height: functions.rem(40);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: none;
        background-color: var(--surface-mute);
        border-radius: 50%;
        cursor: pointer;
        color: var(--ink-80);
        transition:
            background-color 280ms var(--ease-decel),
            color 280ms var(--ease-decel),
            transform 280ms var(--ease-decel);

        &:hover {
            background-color: var(--ink);
            color: var(--white);
            transform: scale(1.05);
        }

        &:focus-visible {
            background-color: var(--ink);
            color: var(--white);
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(4);
        }
    }

    &__title {
        margin: 0 0 functions.rem(16) 0;
        font-size: functions.rem(24);
    }
}

.base-modal-enter-active,
.base-modal-leave-active {
    transition: opacity 380ms var(--ease-decel);
}

.base-modal-enter-active .base-modal__panel,
.base-modal-leave-active .base-modal__panel {
    transition:
        opacity 380ms var(--ease-decel),
        transform 420ms var(--ease-decel);
}

.base-modal-enter-from,
.base-modal-leave-to {
    opacity: 0;
}

.base-modal-enter-from .base-modal__panel,
.base-modal-leave-to .base-modal__panel {
    opacity: 0;
    transform: translateY(#{functions.rem(12)}) scale(0.96);
}

@include bp.reduced-motion {
    .base-modal-enter-active,
    .base-modal-leave-active,
    .base-modal-enter-active .base-modal__panel,
    .base-modal-leave-active .base-modal__panel {
        transition: opacity 120ms linear;
    }

    .base-modal-enter-from .base-modal__panel,
    .base-modal-leave-to .base-modal__panel {
        transform: none;
    }
}
</style>
