<template>
    <figure class="review-card">
        <span class="review-card__mark" aria-hidden="true">
            <SvgQuote />
        </span>
        <blockquote class="review-card__quote">{{ review.quote }}</blockquote>
        <figcaption class="review-card__meta">
            <span class="review-card__name">{{ review.name }}</span>
            <span class="review-card__origin">
                {{ review.country }} · {{ t(`reviews.services.${review.service}`) }}
            </span>
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
import type { Review } from "~/features/reviews/composables/useReviews";

defineProps<{ review: Review }>();

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.review-card {
    --icon-size: #{functions.rem(28)};

    display: flex;
    flex-direction: column;
    gap: functions.rem(20);
    width: 100%;
    margin: 0;
    padding: functions.rem(28);
    border: functions.rem(2) solid var(--border-color);
    border-radius: var(--outer-radius);
    background-color: var(--surface);

    &__mark {
        display: inline-flex;
        color: var(--light-primary-color);
    }

    &__quote {
        flex: 1;
        margin: 0;
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--text-color);
        text-wrap: pretty;
    }

    &__meta {
        display: flex;
        flex-direction: column;
        gap: functions.rem(4);
        padding-top: functions.rem(16);
        border-top: functions.rem(2) solid var(--border-color);
    }

    &__name {
        font-size: var(--fz-body);
        font-weight: var(--font-weight-medium);
        color: var(--text-color);
    }

    &__origin {
        font-size: var(--fz-body-sm);
        color: var(--ink-60);
    }

    @include bp.down("mobile") {
        padding: functions.rem(20);
        gap: functions.rem(16);
    }
}
</style>
