<template>
    <div class="media-placeholder" :class="`media-placeholder--${tone}`" :style="rootStyle" role="img" :aria-label="brief">
        <span class="media-placeholder__frame" aria-hidden="true" />
        <span class="media-placeholder__body">
            <span class="media-placeholder__label">{{ label ?? t("common.photo-brief") }}</span>
            <template v-if="!compact">
                <span class="media-placeholder__brief">{{ brief }}</span>
                <span class="media-placeholder__ratio">{{ ratio }}</span>
            </template>
        </span>
    </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";

interface Props {
    brief: string;
    ratio?: string;
    tone?: "warm" | "dark";
    label?: string;
    compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    ratio: "16 / 10",
    tone: "warm",
    label: undefined,
    compact: false,
});

const { t } = useI18n();

const rootStyle = computed<CSSProperties>(() => ({ aspectRatio: props.ratio }));
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.media-placeholder {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: functions.rem(32);
    border-radius: var(--outer-radius);
    overflow: hidden;

    &--warm {
        background-color: var(--surface-mute);
        color: var(--ink-60);
    }

    &--dark {
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--on-dark-text-muted);
    }

    &__frame {
        position: absolute;
        inset: functions.rem(12);
        border: functions.rem(2) dashed currentColor;
        border-radius: calc(var(--outer-radius) - #{functions.rem(12)});
        opacity: 0.32;
        pointer-events: none;
    }

    &__body {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: functions.rem(10);
        max-width: functions.rem(420);
        text-align: center;
        text-wrap: balance;
    }

    &__label {
        font-size: var(--fz-caption);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--ls-caps);
        text-transform: uppercase;
    }

    &__brief {
        font-size: var(--fz-body-sm);
        line-height: var(--lh-base);
    }

    &__ratio {
        font-size: var(--fz-caption);
        font-variant-numeric: tabular-nums;
    }

    @include bp.down("mobile") {
        padding: functions.rem(20);

        &__frame {
            inset: functions.rem(8);
        }
    }
}
</style>
