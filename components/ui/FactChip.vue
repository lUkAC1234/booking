<template>
    <span class="fact-chip">
        <span v-if="$slots.icon" class="fact-chip__icon" aria-hidden="true">
            <slot name="icon" />
        </span>
        <span class="fact-chip__label">
            <slot />
        </span>
    </span>
</template>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;

.fact-chip {
    --icon-size: var(--icon-size-sm);

    display: inline-flex;
    align-items: center;
    gap: functions.rem(8);
    padding: functions.rem(10) functions.rem(18);
    border-radius: var(--pill-radius);
    background-color: var(--surface-mute);
    color: var(--ink-80);
    font-size: var(--fz-body-sm);
    font-weight: var(--font-weight-medium);
    line-height: 1.2;
    white-space: nowrap;

    &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
    }

    &__label {
        font-size: inherit;
        font-weight: inherit;
    }
}
</style>
