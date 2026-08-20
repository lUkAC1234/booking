<template>
    <article class="offer-card" :class="`offer-card--${tone}`">
        <MediaPlaceholder
            class="offer-card__media"
            :brief="photoBrief"
            :ratio="photoRatio"
            :tone="tone === 'dark' ? 'dark' : 'warm'"
            compact
        />

        <div class="offer-card__body">
            <BaseHeading level="h3" class="offer-card__title">{{ title }}</BaseHeading>
            <p v-if="description" class="offer-card__description">{{ description }}</p>

            <ul v-if="chips.length" class="offer-card__facts" role="list">
                <li v-for="chip in chips" :key="chip.label">
                    <FactChip :icon="chip.icon">{{ chip.label }}</FactChip>
                </li>
            </ul>

            <ul v-if="highlights.length" class="offer-card__highlights" role="list">
                <li v-for="highlight in highlights" :key="highlight">{{ highlight }}</li>
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
import type { CardFact } from "~/types/models";

interface Props {
    title: string;
    description?: string;
    facts?: Array<string | CardFact>;
    highlights?: string[];
    photoBrief: string;
    photoRatio?: string;
    contextKind?: BookingKind;
    tone?: "light" | "dark";
}

const props = withDefaults(defineProps<Props>(), {
    description: "",
    facts: () => [],
    highlights: () => [],
    photoRatio: "16 / 10",
    contextKind: "general",
    tone: "light",
});

const { t } = useI18n();

const chips = computed(() =>
    props.facts.map((fact) => (typeof fact === "string" ? { label: fact, icon: undefined } : fact)),
);
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
    transition:
        border-color 240ms var(--ease-decel),
        background-color 240ms var(--ease-decel);

    &--light {
        background-color: var(--surface);
    }

    &--dark {
        background-color: rgba(255, 255, 255, 0.04);
    }

    &:hover {
        border-color: var(--light-primary-color);
    }

    &--dark:hover {
        background-color: var(--on-dark-surface-hover);
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
        transition: color 240ms var(--ease-decel);
    }

    &:hover &__title {
        color: var(--primary-color);
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

        &__title {
            transition: none;
        }
    }
}
</style>
