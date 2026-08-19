<template>
    <section class="home-tours" :aria-labelledby="headingId">
        <AppContainer size="wide" class="home-tours__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('tours.section-title')"
                :lead="t('tours.section-lead')"
            >
                <template #action>
                    <BaseButton :to="'/tashkent-tours-amirsoy-chimgan/'" variant="outline-dark">
                        {{ t("tours.all-link") }}
                    </BaseButton>
                </template>
            </SectionHeader>

            <div v-reveal.stagger class="home-tours__grid">
                <OfferCard
                    v-for="tour in featured"
                    :key="tour.id"
                    :title="tour.title"
                    :description="tour.summary"
                    :facts="tour.facts"
                    :photo-brief="tour.photoBrief"
                    context-kind="tour"
                    tone="dark"
                />
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { featured } = useTours();
const headingId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.home-tours {
    @include mixins.on-dark;

    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: functions.rem(24);
    }

    @include bp.down("notebook") {
        &__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }

        &__grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
