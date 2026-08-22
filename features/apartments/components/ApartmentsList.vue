<template>
    <section class="apartments-list" :aria-labelledby="headingId">
        <AppContainer size="wide" class="apartments-list__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('apartments.list.title')"
                :lead="t('apartments.list.lead')"
                :split="false"
            />

            <div class="apartments-list__grid">
                <article v-for="apartment in items" :key="apartment.id" v-reveal class="apartments-list__entry">
                    <MediaGallery :photos="apartment.photos" sizes="92vw md:46vw xl:46vw xxl:42vw" />

                    <div class="apartments-list__body">
                        <div class="apartments-list__head">
                            <BaseHeading level="h3" class="apartments-list__title">
                                {{ apartment.title }}
                            </BaseHeading>
                            <p class="apartments-list__summary">{{ apartment.summary }}</p>
                        </div>

                        <ul class="apartments-list__specs" role="list">
                            <li v-for="fact in apartment.facts" :key="fact.label" class="apartments-list__spec">
                                <span class="apartments-list__spec-icon" aria-hidden="true">
                                    <SvgIcon :name="fact.icon" />
                                </span>
                                <span class="apartments-list__spec-label">{{ fact.label }}</span>
                            </li>
                        </ul>

                        <div class="apartments-list__nearby-block">
                            <h4 class="apartments-list__block-title">{{ t("apartments.nearby-title") }}</h4>
                            <dl class="apartments-list__nearby">
                                <div
                                    v-for="place in apartment.nearby"
                                    :key="place.name"
                                    class="apartments-list__nearby-row"
                                >
                                    <dt class="apartments-list__nearby-name">
                                        <span class="apartments-list__nearby-icon" aria-hidden="true">
                                            <SvgPin />
                                        </span>
                                        {{ place.name }}
                                    </dt>
                                    <dd class="apartments-list__nearby-distance">{{ place.distance }}</dd>
                                </div>
                            </dl>
                        </div>

                        <div class="apartments-list__footer">
                            <span class="apartments-list__price">{{ t("common.price-on-request") }}</span>
                            <BookButton context-kind="apartment" :item-title="apartment.title" />
                        </div>
                    </div>
                </article>
            </div>

            <div v-reveal class="apartments-list__included">
                <BaseHeading level="h3" class="apartments-list__block-title">
                    {{ t("apartments.amenities-title") }}
                </BaseHeading>
                <CheckList :items="amenities" columns />
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { items, amenities } = useApartments();
const headingId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.apartments-list {
    background-color: var(--surface);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(48);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: functions.rem(32);
        align-items: stretch;
    }

    &__entry {
        display: flex;
        flex-direction: column;
        gap: functions.rem(24);
        padding: functions.rem(20);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--card-cream);
    }

    &__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: functions.rem(24);
        padding-inline: functions.rem(12);
        padding-bottom: functions.rem(12);
    }

    &__head {
        display: flex;
        flex-direction: column;
        gap: functions.rem(10);
    }

    &__title {
        margin: 0;
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__summary {
        margin: 0;
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-80);
        text-wrap: pretty;
    }

    &__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(16);
        margin-top: auto;
        padding-top: functions.rem(20);
        border-top: functions.rem(2) solid var(--border-color);
    }

    &__price {
        font-size: var(--fz-body-sm);
        color: var(--ink-60);
    }

    &__specs {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--inner-radius);
        background-color: var(--surface);
        overflow: hidden;
    }

    &__spec {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: center;
        gap: functions.rem(10);
        padding: functions.rem(14) functions.rem(16);

        &:not(:nth-child(2n)) {
            border-right: functions.rem(2) solid var(--border-color);
        }

        &:not(:nth-last-child(-n + 2)) {
            border-bottom: functions.rem(2) solid var(--border-color);
        }
    }

    &__spec-icon {
        display: inline-flex;
        flex-shrink: 0;
        color: var(--primary-color);
    }

    &__spec-label {
        font-size: var(--fz-body-sm);
        font-weight: var(--font-weight-medium);
        line-height: var(--lh-base);
        color: var(--ink);
    }

    &__nearby-block {
        display: flex;
        flex-direction: column;
        gap: functions.rem(20);
    }

    &__block-title {
        margin: 0;
        padding-bottom: functions.rem(12);
        border-bottom: functions.rem(2) solid var(--ink-20);
        font-size: var(--fz-caption);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--ls-caps);
        text-transform: uppercase;
        color: var(--ink-60);
    }

    &__nearby {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: functions.rem(12);
    }

    &__nearby-row {
        display: flex;
        align-items: flex-start;
        gap: functions.rem(16);
    }

    &__nearby-name {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: flex-start;
        gap: functions.rem(12);
        font-size: var(--fz-body-sm);
        line-height: var(--lh-relaxed);
        color: var(--ink-80);
    }

    &__nearby-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(24);
        height: functions.rem(24);
        border-radius: 50%;
        background-color: var(--surface-mute);
        color: var(--primary-color);
    }

    &__nearby-distance {
        margin: 0 0 0 auto;
        font-size: var(--fz-body-sm);
        font-weight: var(--font-weight-medium);
        line-height: var(--lh-relaxed);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        color: var(--ink);
    }

    &__included {
        display: flex;
        flex-direction: column;
        gap: functions.rem(24);
        padding: functions.rem(40);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--card-cream);
    }

    @include bp.down("tablet") {
        &__grid {
            grid-template-columns: minmax(0, 1fr);
            gap: functions.rem(24);
        }

        &__included {
            padding: functions.rem(28);
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(32);
        }

        &__entry {
            gap: functions.rem(24);
            padding: functions.rem(12);
        }

        &__body {
            gap: functions.rem(24);
            padding-inline: functions.rem(8);
            padding-bottom: functions.rem(8);
        }

        &__footer {
            flex-direction: column;
            align-items: stretch;
            gap: functions.rem(12);
        }

        &__specs {
            grid-template-columns: minmax(0, 1fr);
        }

        &__spec {
            &:not(:nth-child(2n)) {
                border-right: 0;
            }

            &:not(:nth-last-child(-n + 2)) {
                border-bottom: 0;
            }

            &:not(:last-child) {
                border-bottom: functions.rem(2) solid var(--border-color);
            }
        }

        &__included {
            padding: functions.rem(20);
        }
    }
}
</style>
