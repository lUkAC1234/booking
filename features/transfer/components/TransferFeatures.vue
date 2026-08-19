<template>
    <section class="transfer-features" :aria-labelledby="headingId">
        <AppContainer size="wide" class="transfer-features__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('transfer.features-title')"
                :lead="t('transfer.features-lead')"
                :split="false"
            />

            <div class="transfer-features__grid">
                <CheckList :items="featureLabels" />
                <MediaPlaceholder
                    v-reveal.scale
                    class="transfer-features__media"
                    :brief="t('transfer.hero.photo')"
                    ratio="16 / 10"
                    tone="dark"
                />
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { features } = useTransferRoutes();
const headingId = useId();

const featureLabels = computed(() => features.value.map((feature) => feature.label));
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.transfer-features {
    @include mixins.on-dark;

    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: functions.rem(64);
        align-items: center;
    }

    @include bp.down("laptop") {
        &__inner {
            gap: functions.rem(40);
        }

        &__grid {
            grid-template-columns: 1fr;
            gap: functions.rem(40);
        }

        &__media {
            max-width: functions.rem(640);
        }
    }
}
</style>
