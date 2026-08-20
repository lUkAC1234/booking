<template>
    <section class="reviews-marquee" :aria-labelledby="headingId">
        <AppContainer size="wide">
            <SectionHeader
                :heading-id="headingId"
                :title="t('reviews.title')"
                :lead="t('reviews.lead')"
                :split="false"
            />
        </AppContainer>

        <div class="reviews-marquee__rows">
            <div
                v-for="(row, rowIndex) in rows"
                :key="rowIndex"
                class="reviews-marquee__row"
                :class="`reviews-marquee__row--${rowIndex === 0 ? 'left' : 'right'}`"
            >
                <ul class="reviews-marquee__track" role="list">
                    <li v-for="review in row" :key="review.id" class="reviews-marquee__cell">
                        <ReviewCard :review="review" />
                    </li>
                </ul>
                <ul class="reviews-marquee__track" aria-hidden="true">
                    <li v-for="review in row" :key="`echo-${review.id}`" class="reviews-marquee__cell">
                        <ReviewCard :review="review" />
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { items, rowOne, rowTwo } = useReviews();
const headingId = useId();

const rows = computed(() => [rowOne.value, rowTwo.value]);

if (REVIEWS_ARE_VERIFIED) {
    useJsonLd().reviewCollection(items.value.map((review) => ({ author: review.name, body: review.quote })));
}
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.reviews-marquee {
    @include mixins.on-dark;

    padding-block: var(--section-py);
    overflow: hidden;

    &__rows {
        display: flex;
        flex-direction: column;
        gap: functions.rem(24);
        margin-top: functions.rem(56);
    }

    &__row {
        display: flex;
        width: max-content;
        gap: functions.rem(24);

        &:hover,
        &:focus-within {
            .reviews-marquee__track {
                animation-play-state: paused;
            }
        }
    }

    &__track {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: functions.rem(24);
        flex-shrink: 0;
        animation-duration: 72s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
    }

    &__row--left &__track {
        animation-name: reviews-marquee-left;
    }

    &__row--right &__track {
        animation-name: reviews-marquee-right;
        animation-duration: 88s;
    }

    &__cell {
        width: functions.rem(400);
        flex-shrink: 0;
        display: flex;
    }

    @include bp.down("mobile") {
        &__rows {
            margin-top: functions.rem(32);
        }

        &__cell {
            width: functions.rem(300);
        }
    }

    @include bp.reduced-motion {
        &__rows {
            gap: functions.rem(16);
        }

        &__row {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: functions.rem(16);
            width: auto;
            padding-inline: functions.rem(24);
        }

        &__track {
            display: contents;
            animation: none;
        }

        &__track[aria-hidden="true"] {
            display: none;
        }

        &__cell {
            width: auto;
        }

        @include bp.down("tablet") {
            &__row {
                grid-template-columns: 1fr;
            }
        }
    }
}

@keyframes reviews-marquee-left {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        transform: translate3d(calc(-100% - #{functions.rem(24)}), 0, 0);
    }
}

@keyframes reviews-marquee-right {
    from {
        transform: translate3d(calc(-100% - #{functions.rem(24)}), 0, 0);
    }

    to {
        transform: translate3d(0, 0, 0);
    }
}
</style>
