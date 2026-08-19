<template>
    <div v-reveal.scale class="base-empty-state" :class="`base-empty-state--${tone}`">
        <div class="base-empty-state__icon" aria-hidden="true">
            <slot name="icon">
                <SvgEmptyInbox />
            </slot>
        </div>
        <div class="base-empty-state__copy">
            <component
                :is="level"
                class="base-empty-state__title"
            >
                {{ title }}
            </component>
            <p v-if="description" class="base-empty-state__description">
                {{ description }}
            </p>
        </div>
        <div v-if="$slots.actions" class="base-empty-state__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
type Tone = "muted" | "plain";
type Level = "h2" | "h3";

interface Props {
    title: string;
    description?: string;
    tone?: Tone;
    level?: Level;
}

withDefaults(defineProps<Props>(), {
    description: "",
    tone: "muted",
    level: "h3",
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.base-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: functions.rem(24);
    padding: functions.rem(64) functions.rem(48);
    border-radius: functions.rem(24);

    @include bp.down("mobile") {
        padding: functions.rem(48) functions.rem(28);
        gap: functions.rem(20);
    }

    &--muted {
        background-color: var(--surface-warm);
    }

    &--plain {
        background-color: transparent;
        padding-inline: 0;
    }

    &__icon {
        --icon-size: #{functions.rem(36)};

        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: functions.rem(80);
        height: functions.rem(80);
        border-radius: 50%;
        background-color: var(--surface);
        color: var(--primary-color);

        @include bp.down("mobile") {
            width: functions.rem(64);
            height: functions.rem(64);
            --icon-size: #{functions.rem(30)};
        }
    }

    &--plain &__icon {
        background-color: var(--surface-warm);
    }

    &__copy {
        display: flex;
        flex-direction: column;
        gap: functions.rem(10);
        max-width: functions.rem(520);
    }

    &__title {
        margin: 0;
        font-family: var(--font);
        font-size: var(--fz-subsection-title);
        font-weight: var(--font-weight-bold);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
        text-wrap: balance;
    }

    &__description {
        margin: 0;
        font-size: functions.rem(16);
        line-height: 1.55;
        color: var(--ink-60);
        text-wrap: pretty;
    }

    &__actions {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
        gap: functions.rem(16);
        margin-top: functions.rem(4);
    }
}
</style>
