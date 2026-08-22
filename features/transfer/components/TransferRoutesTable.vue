<template>
    <div class="routes-table">
        <h3 v-if="title" :id="titleId" class="routes-table__title">{{ title }}</h3>

        <table class="routes-table__table" :aria-labelledby="title ? titleId : undefined">
            <thead>
                <tr>
                    <th scope="col">{{ t("transfer.table.route") }}</th>
                    <th scope="col">{{ t("transfer.table.duration") }}</th>
                    <th scope="col">{{ t("transfer.table.price") }}</th>
                </tr>
            </thead>
            <tbody v-reveal.stagger>
                <tr v-for="route in routes" :key="route.id" class="routes-table__row">
                    <th scope="row" class="routes-table__route">
                        <span class="routes-table__route-icon" aria-hidden="true">
                            <SvgIcon :name="route.icon" />
                        </span>
                        <span class="routes-table__route-path">
                            <span>{{ route.from }}</span>
                            <span class="routes-table__route-arrow" aria-hidden="true">
                                <SvgArrowRight />
                            </span>
                            <span>{{ route.to }}</span>
                        </span>
                    </th>
                    <td class="routes-table__duration">{{ route.note }}</td>
                    <td class="routes-table__price">
                        {{ t("common.price-on-request") }}
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="$slots.actions" class="routes-table__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: "" });

defineSlots<{ actions?(): unknown }>();

const { t } = useI18n();
const { routes } = useTransferRoutes();
const titleId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.routes-table {
    overflow: hidden;
    padding: functions.rem(8);
    border: functions.rem(2) solid var(--border-color);
    border-radius: var(--inner-radius);
    background-color: var(--surface);

    &__title {
        margin: functions.rem(16) 0 functions.rem(28);
        padding-inline: functions.rem(16);
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            text-align: left;
            padding: functions.rem(20) functions.rem(16);
            vertical-align: middle;
        }

        thead th {
            padding-block: 0 functions.rem(12);
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
        transition: background-color var(--dur-state) var(--ease-decel);

        &:last-child {
            border-bottom: 0;
        }

        &:hover {
            background-color: var(--surface-warm);
        }
    }

    &__route {
        font-weight: var(--font-weight-medium);
        font-size: var(--fz-body);
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
        transition: background-color var(--dur-state) var(--ease-decel);
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
        transition: transform var(--dur-state) var(--ease-decel);
    }

    &__row:hover &__route-icon {
        background-color: var(--surface);
    }

    &__row:hover &__route-arrow {
        transform: translateX(functions.rem(2));
    }

    &__duration {
        font-size: var(--fz-body-sm);
        color: var(--ink-60);
        white-space: nowrap;
    }

    &__price {
        font-size: var(--fz-body-sm);
        font-weight: var(--font-weight-medium);
        color: var(--ink);
        white-space: nowrap;
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: functions.rem(16);
        padding: functions.rem(24) functions.rem(16) functions.rem(16);
        border-top: functions.rem(2) solid var(--border-color);
    }

    @include bp.down("laptop") {
        &__title {
            margin: functions.rem(12) 0 functions.rem(20);
            padding-inline: functions.rem(12);
        }

        &__table {
            th,
            td {
                padding: functions.rem(16) functions.rem(12);
            }
        }

        &__route,
        &__duration {
            white-space: normal;
        }

        &__route-icon {
            width: functions.rem(40);
            height: functions.rem(40);
            margin-right: functions.rem(12);
        }

        &__actions {
            padding: functions.rem(20) functions.rem(12) functions.rem(12);
        }
    }

    @include bp.down("tablet") {
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

            tbody td:last-child {
                text-align: left;
            }
        }

        &__row {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: functions.rem(10) functions.rem(12);
            padding: functions.rem(20) functions.rem(12);
        }

        &__row &__route {
            flex: 1 0 100%;
            display: flex;
            align-items: flex-start;
            gap: functions.rem(12);
        }

        &__route-icon {
            margin-right: 0;
        }

        &__route-path {
            flex-direction: column;
            align-items: flex-start;
            gap: functions.rem(6);
            line-height: var(--lh-snug);
        }

        &__route-arrow {
            transform: rotate(90deg);
        }

        &__duration {
            margin-left: functions.rem(52);
        }

        &__price {
            margin-left: auto;
        }

        &__row:hover &__route-arrow {
            transform: rotate(90deg);
        }
    }

    @include bp.down("mobile") {
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
