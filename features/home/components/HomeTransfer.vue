<template>
    <section class="home-transfer" :aria-labelledby="headingId">
        <AppContainer size="wide" class="home-transfer__inner">
            <div class="home-transfer__copy">
                <SectionHeader
                    :heading-id="headingId"
                    :title="t('transfer.section-title')"
                    :lead="t('transfer.section-lead')"
                    :split="false"
                />

                <CheckList :items="featureLabels" />

                <div v-reveal class="home-transfer__actions">
                    <BookButton context-kind="transfer" />
                    <BaseButton :to="'/tashkent-airport-transfer/'" variant="outline-light">
                        {{ t("transfer.all-link") }}
                    </BaseButton>
                </div>
            </div>

            <div class="home-transfer__routes">
                <h3 class="home-transfer__routes-title">{{ t("transfer.routes-title") }}</h3>
                <ul v-reveal.stagger class="home-transfer__route-list" role="list">
                    <li v-for="route in routes" :key="route.id" class="home-transfer__route">
                        <span class="home-transfer__route-path">
                            <span class="home-transfer__route-endpoint">{{ route.from }}</span>
                            <span class="home-transfer__route-arrow" aria-hidden="true">
                                <SvgArrowRight />
                            </span>
                            <span class="home-transfer__route-endpoint">{{ route.to }}</span>
                        </span>
                        <span class="home-transfer__route-meta">
                            <span class="home-transfer__route-note">{{ route.note }}</span>
                            <span class="home-transfer__route-price">{{ t("common.price-on-request") }}</span>
                        </span>
                    </li>
                </ul>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { routes, features } = useTransferRoutes();
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
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: functions.rem(72);
        align-items: start;
    }

    &__copy {
        display: flex;
        flex-direction: column;
        gap: functions.rem(32);
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(16);
    }

    &__routes {
        padding: functions.rem(32);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface);
    }

    &__routes-title {
        margin: 0 0 functions.rem(20);
        font-size: var(--fz-caption);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--ls-caps);
        text-transform: uppercase;
        color: var(--ink-60);
    }

    &__route-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    &__route {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(24);
        padding-block: functions.rem(18);
        border-top: functions.rem(2) solid var(--border-color);

        &:first-child {
            border-top: 0;
            padding-top: 0;
        }

        &:last-child {
            padding-bottom: 0;
        }
    }

    &__route-path {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: center;
        gap: functions.rem(10);
        font-size: var(--fz-body-sm);
        font-weight: var(--font-weight-medium);
        color: var(--ink);
    }

    &__route-arrow {
        display: inline-flex;
        flex-shrink: 0;
        color: var(--brand-red);
    }

    &__route-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: functions.rem(4);
        flex-shrink: 0;
        text-align: right;
    }

    &__route-note {
        font-size: var(--fz-body-sm);
        color: var(--ink-60);
        white-space: nowrap;
    }

    &__route-price {
        font-size: var(--fz-caption);
        color: var(--ink-60);
        white-space: nowrap;
    }

    @include bp.down("laptop") {
        &__inner {
            grid-template-columns: 1fr;
            gap: functions.rem(48);
        }
    }

    @include bp.down("mobile") {
        &__routes {
            padding: functions.rem(20);
        }

        &__route {
            flex-direction: column;
            align-items: flex-start;
            gap: functions.rem(8);
        }

        &__route-meta {
            align-items: flex-start;
            text-align: left;
        }

        &__actions {
            flex-direction: column;
            align-items: stretch;
        }
    }
}
</style>
