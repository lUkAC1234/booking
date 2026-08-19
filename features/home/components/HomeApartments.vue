<template>
    <section class="home-apartments" :aria-labelledby="headingId">
        <AppContainer size="wide" class="home-apartments__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('apartments.title')"
                :lead="t('apartments.section-lead')"
            >
                <template #action>
                    <BaseButton :to="'/tashkent-city-center-apartments/'" variant="ghost">
                        {{ t("apartments.all-link") }}
                        <SvgArrowRight />
                    </BaseButton>
                </template>
            </SectionHeader>

            <div v-reveal.stagger class="home-apartments__grid">
                <OfferCard
                    v-for="apartment in items"
                    :key="apartment.id"
                    :title="apartment.title"
                    :description="apartment.summary"
                    :facts="apartment.facts"
                    :photo-brief="apartment.photoBrief"
                    context-kind="apartment"
                />
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { items } = useApartments();
const headingId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.home-apartments {
    background-color: var(--surface);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: functions.rem(32);
    }

    @include bp.down("tablet") {
        &__inner {
            gap: functions.rem(40);
        }

        &__grid {
            grid-template-columns: 1fr;
            gap: functions.rem(24);
        }
    }
}
</style>
