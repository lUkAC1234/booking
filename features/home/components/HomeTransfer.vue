<template>
    <section class="home-transfer" :aria-labelledby="headingId">
        <AppContainer size="wide" class="home-transfer__inner">
            <div class="home-transfer__intro">
                <SectionHeader
                    :heading-id="headingId"
                    :title="t('transfer.section-title')"
                    :lead="t('transfer.section-lead')"
                    :split="false"
                />
                <CheckList :items="featureLabels" />
            </div>

            <TransferRoutesTable v-reveal :title="t('transfer.routes-title')">
                <template #actions>
                    <BookButton context-kind="transfer" />
                    <BaseButton :to="'/tashkent-airport-transfer/'" variant="outline-light">
                        {{ t("transfer.all-link") }}
                    </BaseButton>
                </template>
            </TransferRoutesTable>
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

.home-transfer {
    background-color: var(--surface-warm);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__intro {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
        gap: functions.rem(72);
        align-items: start;
    }

    @include bp.down("laptop") {
        &__inner {
            gap: functions.rem(40);
        }

        &__intro {
            grid-template-columns: 1fr;
            gap: functions.rem(40);
        }
    }
}
</style>
