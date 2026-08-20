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

            <BaseCarousel v-reveal :items="featured">
                <template #default="{ item }">
                    <OfferCard
                        :title="item.title"
                        :description="item.summary"
                        :facts="item.facts"
                        :photo-brief="item.photoBrief"
                        context-kind="tour"
                        tone="dark"
                    />
                </template>
            </BaseCarousel>
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

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }
    }
}
</style>
