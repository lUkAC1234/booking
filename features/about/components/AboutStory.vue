<template>
    <section class="about-story" :aria-labelledby="headingId">
        <AppContainer size="wide" class="about-story__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('about.story.title')"
                :lead="t('about.story.lead')"
                :split="false"
            />

            <div class="about-story__parts">
                <article v-for="part in parts" :key="part.id" v-reveal class="about-story__part">
                    <div class="about-story__part-head">
                        <span class="about-story__part-icon" aria-hidden="true">
                            <SvgIcon :name="part.icon" />
                        </span>
                        <BaseHeading level="h3" class="about-story__part-title">
                            {{ part.title }}
                        </BaseHeading>
                    </div>

                    <p class="about-story__part-text">{{ part.text }}</p>
                </article>
            </div>

            <div v-reveal class="about-story__links">
                <BaseButton :to="'/tashkent-city-center-apartments/'" variant="primary">
                    {{ t("about.story.link-apartments") }}
                </BaseButton>
                <BaseButton :to="'/contact-us/'" variant="outline-light">
                    {{ t("about.story.link-contact") }}
                </BaseButton>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { IconName } from "~/types/models";

const PART_ENTRIES: ReadonlyArray<{ id: string; icon: IconName }> = [
    { id: "start", icon: "building" },
    { id: "second", icon: "key" },
    { id: "third", icon: "mountain" },
    { id: "fourth", icon: "plane" },
    { id: "fifth", icon: "whatsapp" },
    { id: "sixth", icon: "users" },
    { id: "seventh", icon: "heart" },
];

const { t } = useI18n();
const headingId = useId();

const parts = computed(() =>
    PART_ENTRIES.map((entry) => ({
        id: entry.id,
        icon: entry.icon,
        title: t(`about.story.titles.${entry.id}`),
        text: t(`about.story.paragraphs.${entry.id}`),
    })),
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.about-story {
    background-color: var(--surface);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__parts {
        display: flex;
        flex-direction: column;
    }

    &__part {
        display: grid;
        grid-template-columns: minmax(0, 0.32fr) minmax(0, 0.68fr);
        gap: functions.rem(64);
        padding-block: functions.rem(40);
        border-top: functions.rem(2) solid var(--border-color);

        &:first-child {
            padding-top: 0;
            border-top: 0;
        }

        &:last-child {
            padding-bottom: 0;
        }
    }

    &__part-head {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: functions.rem(20);
    }

    &__part-icon {
        --icon-size: var(--icon-size-lg);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(48);
        height: functions.rem(48);
        border-radius: var(--pill-radius);
        background-color: var(--surface-mute);
        color: var(--primary-color);
    }

    &__part-title {
        margin: 0;
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
        text-wrap: balance;
    }

    &__part-text {
        margin: 0;
        max-width: functions.rem(820);
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-80);
    }

    &__links {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: functions.rem(16);
    }

    @include bp.down("laptop") {
        &__part {
            gap: functions.rem(40);
        }
    }

    @include bp.down("tablet") {
        &__inner {
            gap: functions.rem(40);
        }

        &__part {
            grid-template-columns: minmax(0, 1fr);
            gap: functions.rem(20);
            padding-block: functions.rem(32);
        }

        &__part-head {
            flex-direction: row;
            align-items: center;
            gap: functions.rem(16);
        }

        &__part-icon {
            width: functions.rem(44);
            height: functions.rem(44);
        }
    }

    @include bp.down("mobile") {
        &__links {
            flex-direction: column;
            align-items: stretch;
        }
    }
}
</style>
