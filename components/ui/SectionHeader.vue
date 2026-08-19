<template>
    <header class="section-header" :class="{ 'section-header--split': split }">
        <div class="section-header__main">
            <BaseHeading :id="headingId" v-reveal.text :level="level" class="section-header__title">
                {{ title }}
            </BaseHeading>
            <BaseLead v-if="lead" v-reveal class="section-header__lead">{{ lead }}</BaseLead>
        </div>
        <div v-if="$slots.action" v-reveal class="section-header__action">
            <slot name="action" />
        </div>
    </header>
</template>

<script setup lang="ts">
interface Props {
    title: string;
    lead?: string;
    level?: "h2" | "h3";
    split?: boolean;
    headingId?: string;
}

withDefaults(defineProps<Props>(), {
    lead: "",
    level: "h2",
    split: true,
    headingId: undefined,
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.section-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: functions.rem(48);

    &--split {
        flex-wrap: wrap;
    }

    &__main {
        display: flex;
        flex-direction: column;
        gap: functions.rem(16);
        max-width: functions.rem(760);
    }

    &__title {
        margin: 0;
        font-size: var(--fz-section-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__lead {
        margin: 0;
        font-size: var(--fz-lead);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    &__action {
        flex-shrink: 0;
    }

    @include bp.down("tablet") {
        flex-direction: column;
        align-items: flex-start;
        gap: functions.rem(24);
    }
}
</style>
