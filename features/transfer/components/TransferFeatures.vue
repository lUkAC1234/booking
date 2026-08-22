<template>
    <section class="transfer-features" :aria-labelledby="headingId">
        <AppContainer size="wide" class="transfer-features__inner">
            <div class="transfer-features__copy">
                <SectionHeader
                    :heading-id="headingId"
                    :title="t('transfer.features-title')"
                    :lead="t('transfer.features-lead')"
                    :split="false"
                />

                <CheckList :items="featureLabels" />
            </div>

            <div v-reveal.scale class="transfer-features__media">
                <OptimizedMedia
                    class="transfer-features__car"
                    src="/images/car/car.webp"
                    :alt="t('transfer.car-photo')"
                    :width="CAR_WIDTH"
                    :height="CAR_HEIGHT"
                    sizes="90vw xl:50vw"
                    object-fit="contain"
                />
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const CAR_WIDTH = 1672;
const CAR_HEIGHT = 941;

const { t } = useI18n();
const { features } = useTransferRoutes();
const headingId = useId();

const featureLabels = computed(() => features.value.map((feature) => feature.label));
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.transfer-features {
    background-color: var(--surface);
    padding-block: var(--section-py);

    &__inner {
        display: grid;
        grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
        gap: functions.rem(56);
        align-items: center;
    }

    &__copy {
        display: flex;
        flex-direction: column;
        gap: functions.rem(32);
    }

    &__car {
        width: 100%;
        height: auto;
    }

    @include bp.down("laptop") {
        &__inner {
            grid-template-columns: minmax(0, 1fr);
            gap: functions.rem(40);
        }

        &__media {
            max-width: functions.rem(720);
            margin-left: auto;
        }
    }

    @include bp.down("mobile") {
        &__copy {
            gap: functions.rem(24);
        }
    }
}
</style>
