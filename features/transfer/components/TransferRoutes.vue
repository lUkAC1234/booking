<template>
    <section class="transfer-routes" :aria-labelledby="headingId">
        <AppContainer size="wide" class="transfer-routes__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('transfer.routes-title')"
                :lead="t('transfer.routes-lead')"
            >
                <template #action>
                    <BookButton context-kind="transfer" />
                </template>
            </SectionHeader>

            <ul v-reveal.stagger class="transfer-routes__list" role="list">
                <li v-for="route in routes" :key="route.id" class="transfer-routes__item">
                    <span class="transfer-routes__path">
                        <span class="transfer-routes__endpoint">{{ route.from }}</span>
                        <span class="transfer-routes__arrow" aria-hidden="true">
                            <SvgArrowRight />
                        </span>
                        <span class="transfer-routes__endpoint">{{ route.to }}</span>
                    </span>
                    <span class="transfer-routes__meta">
                        <span class="transfer-routes__note">{{ route.note }}</span>
                        <span class="transfer-routes__price">{{ t("common.price-on-request") }}</span>
                    </span>
                </li>
            </ul>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { routes } = useTransferRoutes();
const headingId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.transfer-routes {
    background-color: var(--surface);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(48);
    }

    &__list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    &__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(32);
        padding-block: functions.rem(24);
        border-bottom: functions.rem(2) solid var(--border-color);

        &:first-child {
            border-top: functions.rem(2) solid var(--border-color);
        }
    }

    &__path {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: functions.rem(12);
        font-size: var(--fz-subsection-title);
        font-weight: var(--font-weight-medium);
        line-height: var(--lh-snug);
        color: var(--ink);
    }

    &__arrow {
        display: inline-flex;
        flex-shrink: 0;
        color: var(--primary-color);
    }

    &__meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: functions.rem(4);
        flex-shrink: 0;
        text-align: right;
    }

    &__note {
        font-size: var(--fz-body);
        color: var(--ink-80);
    }

    &__price {
        font-size: var(--fz-body-sm);
        color: var(--ink-60);
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(32);
        }

        &__item {
            flex-direction: column;
            align-items: flex-start;
            gap: functions.rem(10);
        }

        &__meta {
            align-items: flex-start;
            text-align: left;
        }
    }
}
</style>
