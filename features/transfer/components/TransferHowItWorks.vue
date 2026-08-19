<template>
    <section class="transfer-how" :aria-labelledby="headingId">
        <AppContainer size="wide" class="transfer-how__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('transfer.how-it-works.title')"
                :lead="t('transfer.how-it-works.lead')"
                :split="false"
            />

            <StepList :steps="steps" />
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();

const STEP_IDS = ["send", "confirm", "meet"] as const;

const steps = computed(() =>
    STEP_IDS.map((id) => ({
        id,
        title: t(`transfer.how-it-works.steps.${id}.title`),
        text: t(`transfer.how-it-works.steps.${id}.text`),
    })),
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.transfer-how {
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
