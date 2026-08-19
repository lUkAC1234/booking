<template>
    <ol v-reveal.stagger class="step-list">
        <li v-for="(step, index) in steps" :key="step.id" class="step-list__item">
            <span class="step-list__number" aria-hidden="true">{{ index + 1 }}</span>
            <span class="step-list__body">
                <BaseHeading level="h3" class="step-list__title">{{ step.title }}</BaseHeading>
                <span class="step-list__text">{{ step.text }}</span>
            </span>
        </li>
    </ol>
</template>

<script setup lang="ts">
export interface StepListItem {
    id: string;
    title: string;
    text: string;
}

interface Props {
    steps: StepListItem[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.step-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: functions.rem(32);

    &__item {
        display: flex;
        flex-direction: column;
        gap: functions.rem(20);
        padding: functions.rem(28);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
    }

    &__number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: functions.rem(48);
        height: functions.rem(48);
        border-radius: 50%;
        background-color: var(--surface-mute);
        color: var(--ink);
        font-size: var(--fz-body);
        font-weight: var(--font-weight-bold);
        font-variant-numeric: tabular-nums;
    }

    &__body {
        display: flex;
        flex-direction: column;
        gap: functions.rem(10);
    }

    &__title {
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__text {
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    @include bp.down("laptop") {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: functions.rem(24);
    }

    @include bp.down("mobile") {
        grid-template-columns: 1fr;

        &__item {
            padding: functions.rem(20);
            gap: functions.rem(16);
        }
    }
}
</style>
