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

            <div v-reveal class="home-transfer__routes">
                <h3 :id="routesTitleId" class="home-transfer__routes-title">
                    {{ t("transfer.routes-title") }}
                </h3>

                <table class="home-transfer__table" :aria-labelledby="routesTitleId">
                    <thead>
                        <tr>
                            <th scope="col">{{ t("transfer.table.route") }}</th>
                            <th scope="col">{{ t("transfer.table.duration") }}</th>
                            <th scope="col">{{ t("transfer.table.price") }}</th>
                        </tr>
                    </thead>
                    <tbody v-reveal.stagger>
                        <tr v-for="route in routes" :key="route.id" class="home-transfer__row">
                            <th scope="row" class="home-transfer__route">
                                <span class="home-transfer__route-icon" aria-hidden="true">
                                    <SvgIcon :name="route.icon" />
                                </span>
                                <span class="home-transfer__route-path">
                                    <span>{{ route.from }}</span>
                                    <span class="home-transfer__route-arrow" aria-hidden="true">
                                        <SvgArrowRight />
                                    </span>
                                    <span>{{ route.to }}</span>
                                </span>
                            </th>
                            <td class="home-transfer__duration">{{ route.note }}</td>
                            <td class="home-transfer__price">
                                {{ t("common.price-on-request") }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-reveal class="home-transfer__actions">
                <BookButton context-kind="transfer" />
                <BaseButton :to="'/tashkent-airport-transfer/'" variant="outline-light">
                    {{ t("transfer.all-link") }}
                </BaseButton>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { routes, features } = useTransferRoutes();
const headingId = useId();
const routesTitleId = useId();

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

    &__routes {
        padding: functions.rem(32) functions.rem(16) functions.rem(16);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface);
    }

    &__routes-title {
        margin: 0 0 functions.rem(20);
        padding-inline: functions.rem(16);
        font-size: var(--fz-caption);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--ls-caps);
        text-transform: uppercase;
        color: var(--ink-60);
    }

    &__table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            text-align: left;
            padding: functions.rem(18) functions.rem(16);
            vertical-align: middle;
        }

        thead th {
            padding-block: 0 functions.rem(14);
            font-size: var(--fz-caption);
            font-weight: var(--font-weight-medium);
            letter-spacing: var(--ls-caps);
            text-transform: uppercase;
            color: var(--ink-60);
            white-space: nowrap;
            border-bottom: functions.rem(2) solid var(--border-color);
        }

        thead th:last-child,
        tbody td:last-child {
            text-align: right;
        }
    }

    &__row {
        border-bottom: functions.rem(2) solid var(--border-color);
        transition: background-color var(--dur-state, 240ms) var(--ease-decel);

        &:last-child {
            border-bottom: 0;
        }

        &:hover {
            background-color: var(--surface-warm);
        }
    }

    &__route {
        font-weight: var(--font-weight-medium);
        font-size: var(--fz-body-sm);
        color: var(--ink);
        white-space: nowrap;
    }

    &__route-icon {
        --icon-size: var(--icon-size-lg);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(44);
        height: functions.rem(44);
        margin-right: functions.rem(16);
        vertical-align: middle;
        border-radius: var(--pill-radius);
        background-color: var(--surface-mute);
        color: var(--primary-color);
        transition: background-color var(--dur-state, 240ms) var(--ease-decel);
    }

    &__route-path {
        display: inline-flex;
        align-items: center;
        gap: functions.rem(12);
        vertical-align: middle;
    }

    &__route-arrow {
        --icon-size: var(--icon-size-sm);

        display: inline-flex;
        flex-shrink: 0;
        color: var(--primary-color);
        transition: transform var(--dur-state, 240ms) var(--ease-decel);
    }

    &__row:hover &__route-icon {
        background-color: var(--surface);
    }

    &__row:hover &__route-arrow {
        transform: translateX(functions.rem(2));
    }

    &__duration {
        font-size: var(--fz-body-sm);
        color: var(--ink-80);
        white-space: nowrap;
    }

    &__price {
        font-size: var(--fz-body-sm);
        color: var(--ink-60);
        white-space: nowrap;
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(16);
    }

    @include bp.down("laptop") {
        &__inner {
            gap: functions.rem(40);
        }

        &__intro {
            grid-template-columns: 1fr;
            gap: functions.rem(40);
        }

        &__table {
            display: block;

            thead {
                display: none;
            }

            tbody {
                display: block;
            }

            th,
            td {
                display: block;
                padding: 0;
                text-align: left;
            }

            thead th:last-child,
            tbody td:last-child {
                text-align: left;
            }
        }

        &__row {
            display: block;
            padding: functions.rem(16) functions.rem(12);
        }

        &__route {
            white-space: normal;
        }

        &__route-icon {
            width: functions.rem(40);
            height: functions.rem(40);
            margin-right: functions.rem(12);
        }

        &__route-path {
            flex-wrap: wrap;
            gap: functions.rem(8);
        }

        &__duration {
            margin-top: functions.rem(10);
        }

        &__price {
            margin-top: functions.rem(2);
        }
    }

    @include bp.down("mobile") {
        &__routes {
            padding: functions.rem(24) functions.rem(8) functions.rem(8);
        }

        &__routes-title {
            padding-inline: functions.rem(12);
        }

        &__actions {
            flex-direction: column;
            align-items: stretch;
        }
    }

    @include bp.reduced-motion {
        &__row,
        &__route-icon,
        &__route-arrow {
            transition: none;
        }
    }
}
</style>
