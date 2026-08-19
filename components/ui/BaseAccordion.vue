<template>
    <div class="base-accordion" :class="{ 'is-open': isOpen }">
        <button
            :id="triggerId"
            type="button"
            class="base-accordion__trigger"
            :aria-expanded="isOpen"
            :aria-controls="contentId"
            @click="toggle"
        >
            <span class="base-accordion__title">{{ title }}</span>
            <span class="base-accordion__icon" aria-hidden="true">
                <span class="base-accordion__icon-bar base-accordion__icon-bar--h" />
                <span class="base-accordion__icon-bar base-accordion__icon-bar--v" />
            </span>
        </button>
        <div
            :id="contentId"
            class="base-accordion__answer"
            role="region"
            :aria-labelledby="triggerId"
        >
            <div class="base-accordion__answer-inner">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string;
    defaultOpen?: boolean;
}
const props = withDefaults(defineProps<Props>(), { defaultOpen: false });

const isOpen = ref(props.defaultOpen);
const triggerId = useId();
const contentId = useId();

const toggle = () => {
    isOpen.value = !isOpen.value;
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.base-accordion {
    border-top: functions.rem(2) solid var(--ink-20);

    &__trigger {
        appearance: none;
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(24);
        padding: functions.rem(28) 0;
        font-family: var(--font);
        font-size: functions.rem(20);
        font-weight: var(--font-weight-medium);
        line-height: 1.35;
        color: var(--ink);
        transition: color 220ms var(--ease-decel);

        &:hover {
            color: var(--primary-color);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(4);
        }

        @include bp.down("mobile") {
            font-size: functions.rem(16);
            padding: functions.rem(20) 0;
            gap: functions.rem(16);
        }
    }

    &__title {
        flex: 1;
        min-width: 0;
        text-wrap: balance;
    }

    &__icon {
        position: relative;
        flex-shrink: 0;
        width: functions.rem(44);
        height: functions.rem(44);
        border-radius: 50%;
        border: functions.rem(2) solid var(--ink-20);
        background-color: transparent;
        transition:
            background-color 360ms var(--ease-decel),
            border-color 360ms var(--ease-decel),
            transform 360ms var(--ease-decel);

        @include bp.down("mobile") {
            width: functions.rem(40);
            height: functions.rem(40);
        }
    }

    &__trigger:hover &__icon {
        border-color: var(--primary-color);
    }

    &__icon-bar {
        position: absolute;
        top: 50%;
        left: 50%;
        width: functions.rem(16);
        height: functions.rem(2);
        background-color: var(--ink);
        border-radius: var(--pill-radius);
        transform-origin: center;
        transform: translate(-50%, -50%);
        transition:
            transform 360ms var(--ease-decel),
            background-color 360ms var(--ease-decel);

        &--v {
            transform: translate(-50%, -50%) rotate(90deg);
        }
    }

    &__answer {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 420ms var(--ease-decel);
    }

    &__answer-inner {
        min-height: 0;
        overflow: hidden;
        opacity: 0;
        transform: translateY(#{functions.rem(-4)});
        transition:
            opacity 320ms var(--ease-decel) 60ms,
            transform 420ms var(--ease-decel);
    }

    &__answer-inner :deep(p) {
        margin: 0 0 functions.rem(12);
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-80);
        max-width: functions.rem(760);

        &:last-child {
            margin-bottom: functions.rem(28);
        }
    }

    &.is-open {
        .base-accordion__trigger {
            color: var(--ink);
        }

        .base-accordion__icon {
            background-color: var(--brand-red);
            border-color: var(--brand-red);
        }

        .base-accordion__icon-bar {
            background-color: var(--white);
        }

        .base-accordion__icon-bar--v {
            transform: translate(-50%, -50%) rotate(0deg);
        }

        .base-accordion__answer {
            grid-template-rows: 1fr;
        }

        .base-accordion__answer-inner {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @include bp.reduced-motion {
        &__trigger,
        &__icon,
        &__icon-bar,
        &__answer,
        &__answer-inner {
            transition: none;
        }
    }
}
</style>
