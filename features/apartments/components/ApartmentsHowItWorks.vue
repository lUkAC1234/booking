<template>
    <section class="apartments-how" :aria-labelledby="headingId">
        <AppContainer size="wide" class="apartments-how__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('apartments.how-it-works.title')"
                :lead="t('apartments.how-it-works.lead')"
                :split="false"
            />

            <StepList :steps="steps" />
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();

const STEP_IDS = ["message", "confirm", "checkin"] as const;

const steps = computed(() =>
    STEP_IDS.map((id) => ({
        id,
        title: t(`apartments.how-it-works.steps.${id}.title`),
        text: t(`apartments.how-it-works.steps.${id}.text`),
    })),
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.apartments-how {
    background-color: var(--surface-warm);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }
    }
}
</style>
