<template>
    <section
        v-for="group in groups"
        :key="group.category"
        class="tours-group"
        :class="`tours-group--${group.tone}`"
        :aria-labelledby="group.headingId"
    >
        <AppContainer size="wide" class="tours-group__inner">
            <SectionHeader
                :heading-id="group.headingId"
                :title="group.title"
                :lead="group.lead"
                :split="false"
            />

            <div
                v-reveal.stagger
                class="tours-group__grid"
                :class="`tours-group__grid--cols-${group.columns}`"
            >
                <OfferCard
                    v-for="tour in group.tours"
                    :key="tour.id"
                    :title="tour.title"
                    :description="tour.summary"
                    :facts="tour.facts"
                    :photo-brief="tour.photoBrief"
                    context-kind="tour"
                >
                    <ul class="tours-group__highlights" role="list">
                        <li v-for="highlight in tour.highlights" :key="highlight">
                            {{ highlight }}
                        </li>
                    </ul>
                </OfferCard>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { items } = useTours();

const headingIds = TOUR_CATEGORIES.map(() => useId());

const groups = computed(() =>
    TOUR_CATEGORIES.map((category, index) => {
        const tours = items.value.filter((tour) => tour.category === category);
        return {
            category,
            tours,
            columns: Math.min(tours.length, 4),
            headingId: headingIds[index],
            tone: index % 2 === 0 ? "surface" : "warm",
            title: t(`tours.categories.${category}`),
            lead: t(`tours.groups.${category}`),
        };
    }),
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.tours-group {
    padding-block: var(--section-py);

    &--surface {
        background-color: var(--surface);
    }

    &--warm {
        background-color: var(--surface-warm);
    }

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__grid {
        display: grid;
        gap: functions.rem(24);

        &--cols-1 {
            grid-template-columns: minmax(0, #{functions.rem(520)});
        }

        &--cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        &--cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        &--cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }
    }

    &__highlights {
        list-style: none;
        margin: functions.rem(4) 0 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: functions.rem(8);

        li {
            position: relative;
            padding-left: functions.rem(18);
            font-size: var(--fz-body-sm);
            line-height: var(--lh-base);
            color: var(--ink-80);

            &::before {
                content: "";
                position: absolute;
                top: functions.rem(8);
                left: 0;
                width: functions.rem(8);
                height: functions.rem(2);
                background-color: var(--primary-color);
            }
        }
    }

    @include bp.down("notebook") {
        &__grid--cols-3,
        &__grid--cols-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }

        &__grid {
            grid-template-columns: 1fr;
        }

        &__grid--cols-1,
        &__grid--cols-2,
        &__grid--cols-3,
        &__grid--cols-4 {
            grid-template-columns: 1fr;
        }
    }
}
</style>
