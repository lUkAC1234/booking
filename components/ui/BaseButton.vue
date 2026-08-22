<template>
    <component
        :is="tag"
        :to="to ? localePath(to) : undefined"
        :href="href"
        :type="tag === 'button' ? type : undefined"
        :disabled="disabled || loading"
        :class="rootClass"
        :aria-busy="loading ? 'true' : undefined"
        @pointerenter="setInkOrigin"
        @pointerleave="setInkOrigin"
    >
        <span class="base-button__face">
            <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
            <span class="base-button__label">
                <slot />
            </span>
            <span v-if="hasChip" class="base-button__chip" aria-hidden="true">
                <slot name="icon">
                    <SvgArrowRight />
                </slot>
            </span>
        </span>
        <span class="base-button__face base-button__face--ink" aria-hidden="true">
            <span v-if="loading" class="base-button__spinner" />
            <span class="base-button__label">
                <slot />
            </span>
            <span v-if="hasChip" class="base-button__chip">
                <slot name="icon">
                    <SvgArrowRight />
                </slot>
            </span>
        </span>
    </component>
</template>

<script setup lang="ts">
type Variant = "primary" | "secondary" | "outline-light" | "outline-dark" | "ghost" | "primary-pill" | "icon";
type Size = "default" | "small";

interface Props {
    variant?: Variant;
    size?: Size;
    to?: string;
    href?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    fullwidth?: boolean;
    rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: "primary",
    size: "default",
    to: undefined,
    href: undefined,
    type: "button",
    disabled: false,
    loading: false,
    fullwidth: false,
    rounded: false,
});

const localePath = useLocalePath();

const tag = computed(() => {
    if (props.to) return resolveComponent("NuxtLink");
    if (props.href) return "a";
    return "button";
});

const hasChip = computed(() => props.variant === "primary-pill");

const setInkOrigin = (event: PointerEvent) => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLElement)) return;
    const bounds = button.getBoundingClientRect();
    button.style.setProperty("--btn-ink-x", `${event.clientX - bounds.left}px`);
    button.style.setProperty("--btn-ink-y", `${event.clientY - bounds.top}px`);
};

const rootClass = computed(() => [
    "base-button",
    `base-button--${props.variant}`,
    `base-button--${props.size}`,
    {
        "base-button--fullwidth": props.fullwidth,
        "base-button--rounded": props.rounded,
        "base-button--loading": props.loading,
        "base-button--disabled": props.disabled,
    },
]);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.base-button {
    --button-py: #{functions.rem(16)};
    --button-px: #{functions.rem(28)};
    --button-fz: #{functions.rem(16)};
    --button-gap: #{functions.rem(10)};
    --btn-ink: transparent;
    --btn-ink-label: currentColor;
    --btn-ink-x: 50%;
    --btn-ink-y: 50%;
    --btn-ink-dur: 680ms;
    --button-h: var(--control-height);

    display: inline-grid;
    grid-template-columns: 1fr;
    min-height: var(--button-h);
    border-radius: var(--pill-radius);
    font-family: var(--font);
    font-size: var(--button-fz);
    font-weight: var(--font-weight-medium);
    line-height: 1.2;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    user-select: none;

    &:focus-visible {
        outline: functions.rem(2) solid var(--primary-color);
        outline-offset: functions.rem(4);
    }

    &--small {
        --button-py: #{functions.rem(12)};
        --button-px: #{functions.rem(20)};
        --button-fz: #{functions.rem(14)};
        --button-h: var(--control-height-sm);
    }

    &--fullwidth {
        width: 100%;
    }

    &--rounded {
        border-radius: var(--pill-radius);
    }

    &--primary {
        --btn-ink: var(--brand-rose);

        background-color: var(--brand-red);
        color: var(--white);
    }

    &--secondary {
        --btn-ink: var(--surface-warm);

        background-color: var(--surface-mute);
        color: var(--ink);
    }

    &--outline-light {
        --btn-ink: var(--ink);
        --btn-ink-label: var(--surface-warm);
        --btn-border: var(--ink);

        color: var(--ink);
    }

    &--outline-dark {
        --btn-ink: var(--white);
        --btn-ink-label: var(--surface-ink);
        --btn-border: var(--white);

        color: var(--white);

        &:focus-visible {
            outline-color: var(--white);
        }
    }

    &--ghost {
        --button-px: 0;
        --btn-ink-label: var(--primary-color);
        --button-h: auto;

        color: var(--ink);
        border-radius: 0;
    }

    &--primary-pill {
        --button-py: #{functions.rem(6)};
        --button-px-left: #{functions.rem(28)};
        --button-px-right: #{functions.rem(6)};
        --chip-size: #{functions.rem(44)};
        --chip-icon-size: #{functions.rem(20)};
        --button-gap: #{functions.rem(16)};
        --btn-ink: var(--brand-rose);

        background-color: var(--brand-red);
        color: var(--white);

        @include bp.down("mobile") {
            --button-px-left: #{functions.rem(20)};
            --chip-size: #{functions.rem(40)};
            --chip-icon-size: #{functions.rem(18)};
            --button-gap: #{functions.rem(12)};
        }
    }

    &--primary-pill#{&}--small {
        --button-py: #{functions.rem(4)};
        --chip-size: #{functions.rem(36)};
        --chip-icon-size: #{functions.rem(16)};
        --button-px-left: #{functions.rem(20)};
        --button-gap: #{functions.rem(12)};
    }

    &--icon {
        --button-py: 0;
        --button-px: 0;
        --button-h: var(--interactive-height);
        --icon-size: var(--icon-size-md);
        --btn-ink: var(--primary-color);
        --btn-ink-label: var(--white);
        --btn-ink-dur: var(--dur-state);

        width: var(--interactive-height);
        height: var(--interactive-height);
        flex-shrink: 0;
        color: var(--ink);
        background-color: var(--surface-mute);
        border-radius: 50%;
    }

    &--disabled,
    &--loading {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &--icon#{&}--disabled {
        opacity: 1;
        color: var(--ink-40);
    }

    &__face {
        grid-area: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--button-gap);
        padding: var(--button-py) var(--button-px);
        border: functions.rem(2) solid var(--btn-border, transparent);
        border-radius: inherit;
        color: inherit;
    }

    &__face--ink {
        background-color: var(--btn-ink);
        border-color: var(--btn-ink-border, var(--btn-border, transparent));
        color: var(--btn-ink-label);
        clip-path: circle(0% at var(--btn-ink-x) var(--btn-ink-y));
        pointer-events: none;
        transition: clip-path var(--btn-ink-dur) var(--ease-decel);

        @include bp.reduced-motion {
            transition: none;
        }
    }

    &:hover:not(:disabled) &__face--ink,
    &:focus-visible &__face--ink {
        clip-path: circle(150% at var(--btn-ink-x) var(--btn-ink-y));
    }

    &--disabled &__face--ink,
    &--loading &__face--ink {
        visibility: hidden;
    }

    &--primary-pill &__face {
        padding: var(--button-py) var(--button-px-right) var(--button-py) var(--button-px-left);
    }

    &--fullwidth &__face {
        justify-content: space-between;
    }

    @include bp.touch {
        &__face--ink {
            clip-path: none;
            opacity: 0;
            transition: opacity var(--dur-state) var(--ease-decel);

            @include bp.reduced-motion {
                transition: none;
            }
        }

        &:hover:not(:disabled) &__face--ink,
        &:focus-visible &__face--ink,
        &:active &__face--ink {
            clip-path: none;
            opacity: 1;
        }
    }

    &__spinner {
        width: functions.rem(16);
        height: functions.rem(16);
        border: functions.rem(2) solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: base-button-spin 700ms linear infinite;

        @include bp.reduced-motion {
            animation: none;
        }
    }

    &__label {
        display: inline-flex;
        align-items: center;
        gap: functions.rem(8);
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
    }

    &--fullwidth &__label {
        flex-grow: 1;
        justify-content: space-between;
    }

    &__chip {
        --icon-size: var(--chip-icon-size);

        width: var(--chip-size);
        height: var(--chip-size);
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: var(--white);
        color: var(--brand-red);
        border-radius: 50%;
        transition: transform 240ms var(--ease-decel);

        @include bp.reduced-motion {
            transition: none;
        }
    }

    &--primary-pill:hover &__chip {
        transform: translateX(#{functions.rem(2)});
    }
}

@keyframes base-button-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
