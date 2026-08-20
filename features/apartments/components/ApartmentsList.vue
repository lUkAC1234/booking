<template>
    <section class="apartments-list" :aria-labelledby="headingId">
        <AppContainer size="wide" class="apartments-list__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('apartments.list.title')"
                :lead="t('apartments.list.lead')"
                :split="false"
            />

            <article
                v-for="apartment in items"
                :key="apartment.id"
                class="apartments-list__entry"
            >
                <div v-reveal.scale class="apartments-list__media">
                    <MediaPlaceholder :brief="apartment.photoBrief" />
                </div>

                <div class="apartments-list__body">
                    <BaseHeading level="h3" class="apartments-list__title">
                        {{ apartment.title }}
                    </BaseHeading>

                    <ul v-reveal.stagger class="apartments-list__facts" role="list">
                        <li v-for="fact in apartment.facts" :key="fact.label">
                            <FactChip :icon="fact.icon">{{ fact.label }}</FactChip>
                        </li>
                    </ul>

                    <div v-reveal class="apartments-list__prose">
                        <p v-for="paragraph in apartment.paragraphs" :key="paragraph">
                            {{ paragraph }}
                        </p>
                    </div>

                    <div class="apartments-list__columns">
                        <div class="apartments-list__column">
                            <h4 class="apartments-list__column-title">
                                {{ t("apartments.amenities-title") }}
                            </h4>
                            <CheckList :items="apartment.amenities" />
                        </div>

                        <div class="apartments-list__column">
                            <h4 class="apartments-list__column-title">
                                {{ t("apartments.nearby-title") }}
                            </h4>
                            <ul v-reveal.stagger class="apartments-list__nearby" role="list">
                                <li
                                    v-for="place in apartment.nearby"
                                    :key="place"
                                    class="apartments-list__nearby-item"
                                >
                                    <span class="apartments-list__nearby-icon" aria-hidden="true">
                                        <SvgPin />
                                    </span>
                                    {{ place }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-reveal class="apartments-list__footer">
                        <span class="apartments-list__price">{{ t("common.price-on-request") }}</span>
                        <BookButton context-kind="apartment" :item-title="apartment.title" />
                    </div>
                </div>
            </article>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { items } = useApartments();
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
        gap: functions.rem(80);
    }

    &__entry {
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        gap: functions.rem(56);
        align-items: start;

        &:nth-child(odd) .apartments-list__media {
            order: 2;
        }
    }

    &__media {
        position: sticky;
        top: functions.rem(120);
        border-radius: var(--outer-radius);
        overflow: hidden;
    }

    &__body {
        display: flex;
        flex-direction: column;
        gap: functions.rem(24);
    }

    &__title {
        margin: 0;
        font-size: var(--fz-section-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__facts {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(8);
    }

    &__prose {
        display: flex;
        flex-direction: column;
        gap: functions.rem(16);

        p {
            margin: 0;
            font-size: var(--fz-body);
            line-height: var(--lh-relaxed);
            color: var(--ink-80);
        }
    }

    &__columns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: functions.rem(32);
        padding-top: functions.rem(8);
    }

    &__column {
        display: flex;
        flex-direction: column;
        gap: functions.rem(16);
    }

    &__column-title {
        margin: 0;
        font-size: var(--fz-caption);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--ls-caps);
        text-transform: uppercase;
        color: var(--ink-60);
    }

    &__nearby {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: functions.rem(14);
    }

    &__nearby-item {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: flex-start;
        gap: functions.rem(12);
        font-size: var(--fz-body);
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
        margin-top: functions.rem(2);
        color: var(--primary-color);
    }

    &__footer {
        display: flex;
        align-items: center;
        gap: functions.rem(24);
        padding-top: functions.rem(24);
        border-top: functions.rem(2) solid var(--border-color);
    }

    &__price {
        font-size: var(--fz-body-sm);
        color: var(--ink-60);
    }

    @include bp.down("laptop") {
        &__inner {
            gap: functions.rem(56);
        }

        &__entry {
            grid-template-columns: 1fr;
            gap: functions.rem(32);

            &:nth-child(odd) .apartments-list__media {
                order: 0;
            }
        }

        &__media {
            position: static;
        }
    }

    @include bp.down("mobile") {
        &__columns {
            grid-template-columns: 1fr;
            gap: functions.rem(24);
        }

        &__footer {
            flex-direction: column;
            align-items: stretch;
            gap: functions.rem(16);
        }
    }
}
</style>
