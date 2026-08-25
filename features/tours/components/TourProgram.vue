<template>
    <section
        class="tour-program"
        :class="[`tour-program--${tone}`, { 'tour-program--reverse': reverse }]"
        :aria-labelledby="headingId"
    >
        <AppContainer size="wide" class="tour-program__inner">
            <SectionHeader :heading-id="headingId" :title="tour.title" :lead="tour.summary" :split="false" />

            <div class="tour-program__body">
                <div v-reveal.scale class="tour-program__media">
                    <MediaGallery :photos="tour.photos" sizes="90vw md:46vw xxl:44vw" />
                </div>

                <div class="tour-program__panel">
                    <ul class="tour-program__facts" role="list">
                        <li v-for="fact in tour.facts" :key="fact.label">
                            <FactChip :icon="fact.icon">{{ fact.label }}</FactChip>
                        </li>
                    </ul>

                    <h3 class="tour-program__heading">{{ t("tours.program-title") }}</h3>

                    <CheckList ordered :items="tour.program" />

                    <p class="tour-program__note">{{ t("tours.program-note") }}</p>

                    <div class="tour-program__actions">
                        <BookButton context-kind="tour" :item-title="tour.title" />
                    </div>
                </div>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { Tour } from "~/features/tours/composables/useTours";

interface Props {
    tour: Tour;
    tone?: "surface" | "warm";
    reverse?: boolean;
}

withDefaults(defineProps<Props>(), { tone: "surface", reverse: false });

const { t } = useI18n();
const headingId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.tour-program {
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

    &__body {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-items: start;
        gap: functions.rem(48);
    }

    &--reverse &__media {
        order: 2;
    }

    &__panel {
        display: flex;
        flex-direction: column;
        gap: functions.rem(20);
    }

    &__facts {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(8);
    }

    &__heading {
        margin: 0;
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--text-color);
    }

    &__note {
        margin: 0;
        font-size: var(--fz-body-sm);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(16);
        margin-top: functions.rem(4);
    }

    @include bp.down("tablet") {
        &__body {
            grid-template-columns: minmax(0, 1fr);
            gap: functions.rem(32);
        }

        &--reverse &__media {
            order: 0;
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }

        &__actions {
            align-self: stretch;
        }
    }
}
</style>
