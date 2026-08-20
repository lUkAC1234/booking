<template>
    <section class="tours-practical" :aria-labelledby="headingId">
        <AppContainer size="wide" class="tours-practical__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('tours.practical.title')"
                :lead="t('tours.practical.lead')"
                :split="false"
            />

            <div class="tours-practical__grid">
                <div v-reveal class="tours-practical__block tours-practical__block--wide">
                    <h3 class="tours-practical__block-title">
                        {{ t("tours.practical.season-title") }}
                    </h3>
                    <table class="tours-practical__table">
                        <caption class="tours-practical__caption">
                            {{
                                t("tours.practical.season-caption")
                            }}
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">{{ t("tours.practical.season-head.place") }}</th>
                                <th scope="col">{{ t("tours.practical.season-head.best") }}</th>
                                <th scope="col">{{ t("tours.practical.season-head.note") }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in seasons" :key="row.id">
                                <th scope="row">{{ row.place }}</th>
                                <td>{{ row.best }}</td>
                                <td>{{ row.note }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-for="list in iconLists" :key="list.id" class="tours-practical__block">
                    <h3 class="tours-practical__block-title">{{ list.title }}</h3>
                    <ul v-reveal.stagger class="tours-practical__list" role="list">
                        <li v-for="entry in list.entries" :key="entry" class="tours-practical__item">
                            <span class="tours-practical__item-icon" aria-hidden="true">
                                <SvgIcon :name="list.icon" />
                            </span>
                            {{ entry }}
                        </li>
                    </ul>
                </div>

                <div class="tours-practical__block">
                    <h3 class="tours-practical__block-title">
                        {{ t("tours.practical.bring-title") }}
                    </h3>
                    <CheckList :items="bring" />
                </div>

                <div class="tours-practical__block">
                    <h3 class="tours-practical__block-title">
                        {{ t("tours.practical.car-title") }}
                    </h3>
                    <p class="tours-practical__prose">{{ t("tours.practical.car-lead") }}</p>
                    <CheckList :items="carFeatures" />
                </div>

                <div v-reveal class="tours-practical__block tours-practical__block--wide">
                    <h3 class="tours-practical__block-title">
                        {{ t("tours.practical.pickup-title") }}
                    </h3>
                    <p class="tours-practical__prose">{{ t("tours.practical.pickup") }}</p>
                    <div class="tours-practical__links">
                        <BaseButton :to="'/tashkent-city-center-apartments/'" variant="ghost">
                            {{ t("tours.practical.pickup-link-apartments") }}
                            <SvgArrowRight />
                        </BaseButton>
                        <BaseButton :to="'/tashkent-airport-transfer/'" variant="ghost">
                            {{ t("tours.practical.pickup-link-transfer") }}
                            <SvgArrowRight />
                        </BaseButton>
                    </div>
                </div>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { IconName } from "~/types/models";

const { t } = useI18n();
const headingId = useId();

const SEASON_IDS = ["amirsoy", "chimgan", "charvak", "gondola", "chinorkent", "metro", "plov"] as const;
const SCHEDULE_IDS = ["pickup", "drive", "arrival", "lunch", "return", "limit", "city"] as const;
const DRIVE_IDS = ["amirsoy", "chimgan", "charvak", "chinorkent", "gazalkent"] as const;
const BRING_IDS = ["layers", "shoes", "sun", "cash", "water", "documents"] as const;
const CAR_IDS = ["seats", "climate", "boot", "driver"] as const;

const seasons = computed(() =>
    SEASON_IDS.map((id) => ({
        id,
        place: t(`tours.practical.season.${id}.place`),
        best: t(`tours.practical.season.${id}.best`),
        note: t(`tours.practical.season.${id}.note`),
    })),
);

const iconLists = computed<Array<{ id: string; title: string; icon: IconName; entries: string[] }>>(() => [
    {
        id: "schedule",
        title: t("tours.practical.schedule-title"),
        icon: "clock",
        entries: SCHEDULE_IDS.map((id) => t(`tours.practical.schedule.${id}`)),
    },
    {
        id: "drive",
        title: t("tours.practical.drive-title"),
        icon: "pin",
        entries: DRIVE_IDS.map((id) => t(`tours.practical.drive.${id}`)),
    },
]);

const bring = computed(() => BRING_IDS.map((id) => t(`tours.practical.bring.${id}`)));
const carFeatures = computed(() => CAR_IDS.map((id) => t(`tours.practical.car.${id}`)));
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.tours-practical {
    @include mixins.on-dark;

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

    &__block {
        display: flex;
        flex-direction: column;
        gap: functions.rem(20);
        padding: functions.rem(32);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface);

        &--wide {
            grid-column: span 2;
        }
    }

    &__block-title {
        margin: 0;
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--text-color);
    }

    &__table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--fz-body-sm);
        line-height: var(--lh-base);
        text-align: left;

        th,
        td {
            padding: functions.rem(14) functions.rem(16) functions.rem(14) 0;
            border-bottom: functions.rem(2) solid var(--border-color);
            vertical-align: top;
        }

        thead th {
            font-size: var(--fz-caption);
            font-weight: var(--font-weight-medium);
            letter-spacing: var(--ls-caps);
            text-transform: uppercase;
            color: var(--ink-60);
        }

        tbody th {
            font-weight: var(--font-weight-medium);
            color: var(--text-color);
        }

        tbody td {
            color: var(--ink-60);
        }

        tbody tr:last-child th,
        tbody tr:last-child td {
            border-bottom: 0;
        }
    }

    &__caption {
        @include mixins.visually-hidden;
    }

    &__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: functions.rem(14);
    }

    &__item {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: flex-start;
        gap: functions.rem(12);
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    &__item-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(24);
        height: functions.rem(24);
        margin-top: functions.rem(2);
        color: var(--primary-color);
    }

    &__prose {
        margin: 0;
        max-width: functions.rem(920);
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    &__links {
        --icon-size: var(--icon-size-sm);

        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(32);
        color: var(--text-color);
    }

    @include bp.down("tablet") {
        &__grid {
            grid-template-columns: 1fr;
        }

        &__block--wide {
            grid-column: auto;
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }

        &__block {
            padding: functions.rem(20);
        }

        &__table {
            th,
            td {
                padding: functions.rem(12) functions.rem(10) functions.rem(12) 0;
            }
        }

        &__links {
            flex-direction: column;
            gap: functions.rem(16);
        }
    }
}
</style>
