<template>
    <article class="offer-card" :class="`offer-card--${tone}`">
        <MediaPlaceholder
            class="offer-card__media"
            :brief="photoBrief"
            :ratio="photoRatio"
            :tone="tone === 'dark' ? 'dark' : 'warm'"
        />

        <div class="offer-card__body">
            <BaseHeading level="h3" class="offer-card__title">{{ title }}</BaseHeading>
            <p v-if="description" class="offer-card__description">{{ description }}</p>

            <ul v-if="facts.length" class="offer-card__facts" role="list">
                <li v-for="fact in facts" :key="fact">
                    <FactChip>{{ fact }}</FactChip>
                </li>
            </ul>

            <slot />
        </div>

        <footer class="offer-card__footer">
            <span class="offer-card__price">{{ t("common.price-on-request") }}</span>
            <BookButton
                :context-kind="contextKind"
                :item-title="title"
                :variant="tone === 'dark' ? 'outline-dark' : 'primary'"
                size="small"
                :label="t('common.book')"
            />
        </footer>
    </article>
</template>

<script setup lang="ts">
import type { BookingKind } from "~/features/booking/composables/useBookingLink";

interface Props {
    title: string;
    description?: string;
    facts?: string[];
    photoBrief: string;
    photoRatio?: string;
    contextKind?: BookingKind;
    tone?: "light" | "dark";
}

withDefaults(defineProps<Props>(), {
    description: "",
    facts: () => [],
    photoRatio: "16 / 10",
    contextKind: "general",
    tone: "light",
});

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.offer-card {
    display: flex;
    flex-direction: column;
    gap: functions.rem(20);
    padding: functions.rem(24);
    border: functions.rem(2) solid var(--border-color);
    border-radius: var(--outer-radius);
    transition: border-color 240ms var(--ease-decel);

    &--light {
        background-color: var(--surface);
    }

    &--dark {
        background-color: rgba(255, 255, 255, 0.04);
    }

    &:hover {
        border-color: var(--light-primary-color);
    }

    &__media {
        border-radius: var(--inner-radius);
    }

    &__body {
        display: flex;
        flex-direction: column;
        gap: functions.rem(12);
        flex: 1;
    }

    &__title {
        font-size: var(--fz-subsection-title);
        color: var(--ink);
    }

    &__description {
        margin: 0;
        font-size: var(--fz-body-sm);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    &__facts {
        list-style: none;
        margin: functions.rem(4) 0 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(8);
    }

    &__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(16);
        padding-top: functions.rem(20);
        border-top: functions.rem(2) solid var(--border-color);
    }

    &__price {
        font-size: var(--fz-body-sm);
        color: var(--ink-60);
    }

    @include bp.down("mobile") {
        padding: functions.rem(16);
        gap: functions.rem(16);

        &__footer {
            flex-direction: column;
            align-items: stretch;
            gap: functions.rem(12);
        }

        &__price {
            text-align: center;
        }
    }

    @include bp.reduced-motion {
        transition: none;
    }
}
</style>
