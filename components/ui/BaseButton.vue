<template>
    <component
        :is="tag"
        :to="to ? localePath(to) : undefined"
        :href="href"
        :type="tag === 'button' ? type : undefined"
        :disabled="disabled || loading"
        :class="rootClass"
        :aria-busy="loading ? 'true' : undefined"
    >
        <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
        <span class="base-button__label">
            <slot />
        </span>
        <span v-if="hasChip" class="base-button__chip" aria-hidden="true">
            <slot name="icon">
                <SvgArrowRight />
            </slot>
        </span>
    </component>
</template>

<script setup lang="ts">
type Variant =
    | "primary"
    | "secondary"
    | "outline-light"
    | "outline-dark"
    | "ghost"
    | "primary-pill"
    | "icon";
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

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: functions.rem(10);
    padding: var(--button-py) var(--button-px);
    border: functions.rem(2) solid transparent;
    border-radius: var(--pill-radius);
    font-family: var(--font);
    font-size: var(--button-fz);
    font-weight: var(--font-weight-medium);
    line-height: 1.2;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    user-select: none;
    transition:
        background-color 240ms var(--ease-decel),
        color 240ms var(--ease-decel),
        border-color 240ms var(--ease-decel);

    @include bp.reduced-motion {
        transition: none;
    }

    &:focus-visible {
        outline: functions.rem(2) solid var(--primary-color);
        outline-offset: functions.rem(4);
    }

    &--small {
        --button-py: #{functions.rem(12)};
        --button-px: #{functions.rem(20)};
        --button-fz: #{functions.rem(14)};
    }

    &--fullwidth {
        width: 100%;
    }

    &--rounded {
        border-radius: var(--pill-radius);
    }

    &--primary {
        background-color: var(--brand-red);
        color: var(--white);

        &:hover {
            background-color: var(--brand-rose);
        }
    }

    &--secondary {
        background-color: var(--surface-mute);
        color: var(--ink);

        &:hover {
            background-color: var(--surface-warm);
        }
    }

    &--outline-light {
        background-color: transparent;
        color: var(--ink);
        border-color: var(--ink);

        &:hover {
            background-color: var(--ink);
            color: var(--surface-warm);
        }
    }

    &--outline-dark {
        background-color: transparent;
        color: var(--white);
        border-color: var(--white);

        &:hover {
            background-color: var(--white);
            color: var(--surface-ink);
        }

        &:focus-visible {
            outline-color: var(--white);
        }
    }

    &--ghost {
        --button-px: 0;

        background-color: transparent;
        color: var(--ink);
        border-radius: 0;

        &:hover {
            color: var(--primary-color);
        }
    }

    &--primary-pill {
        --button-py: #{functions.rem(8)};
        --button-px-left: #{functions.rem(28)};
        --button-px-right: #{functions.rem(8)};
        --chip-size: #{functions.rem(44)};
        --chip-icon-size: #{functions.rem(20)};

        gap: functions.rem(16);
        padding: var(--button-py) var(--button-px-right) var(--button-py) var(--button-px-left);
        background-color: var(--brand-red);
        color: var(--white);

        &:hover {
            background-color: var(--brand-rose);
        }

        @include bp.down("mobile") {
            --button-px-left: #{functions.rem(20)};
            --chip-size: #{functions.rem(40)};
            --chip-icon-size: #{functions.rem(18)};

            gap: functions.rem(12);
        }
    }

    &--icon {
        --button-py: 0;
        --button-px: 0;
        --icon-size: var(--icon-size-md);

        width: var(--interactive-height);
        height: var(--interactive-height);
        flex-shrink: 0;
        background-color: transparent;
        color: var(--ink);
        border-color: var(--border-color);
        border-radius: 50%;

        &:hover:not(:disabled) {
            background-color: var(--surface-mute);
            border-color: var(--light-primary-color);
        }
    }

    &--disabled,
    &--loading {
        opacity: 0.6;
        cursor: not-allowed;
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
