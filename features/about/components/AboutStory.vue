<template>
    <section class="about-story" :aria-labelledby="headingId">
        <AppContainer size="wide" class="about-story__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('about.story.title')"
                :lead="t('about.story.lead')"
                :split="false"
            />

            <div v-reveal class="about-story__prose">
                <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
            </div>

            <div v-reveal class="about-story__links">
                <BaseButton :to="'/tashkent-city-center-apartments/'" variant="ghost">
                    {{ t("about.story.link-apartments") }}
                    <SvgArrowRight />
                </BaseButton>
                <BaseButton :to="'/contact-us/'" variant="ghost">
                    {{ t("about.story.link-contact") }}
                    <SvgArrowRight />
                </BaseButton>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();

const PARAGRAPH_IDS = ["start", "second", "third", "fourth", "fifth", "sixth", "seventh"] as const;

const paragraphs = computed(() => PARAGRAPH_IDS.map((id) => t(`about.story.paragraphs.${id}`)));
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
        gap: functions.rem(48);
    }

    &__prose {
        display: flex;
        flex-direction: column;
        gap: functions.rem(24);
        max-width: functions.rem(760);

        p {
            margin: 0;
            font-size: var(--fz-body);
            line-height: var(--lh-relaxed);
            color: var(--ink-80);
        }
    }

    &__links {
        --icon-size: var(--icon-size-sm);

        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(32);
    }

    @include bp.down("tablet") {
        &__inner {
            gap: functions.rem(32);
        }
    }

    @include bp.down("mobile") {
        &__links {
            flex-direction: column;
            gap: functions.rem(16);
        }
    }
}
</style>
