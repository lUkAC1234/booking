<template>
    <section class="about-stats" :aria-labelledby="headingId">
        <AppContainer size="wide" class="about-stats__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('about.stats.title')"
                :lead="t('about.stats.lead')"
                :split="false"
            />

            <StatBand :stats="stats" />
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();

const stats = computed(() => [
    { id: "apartments", label: t("about.stats.items.apartments"), value: 2 },
    { id: "tours", label: t("about.stats.items.tours"), value: 5 },
    { id: "years", label: t("about.stats.items.years"), value: 6 },
    { id: "languages", label: t("about.stats.items.languages"), value: 3 },
]);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.about-stats {
    background-color: var(--surface-warm);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(48);
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(32);
        }
    }
}
</style>
