<template>
    <section class="about-principles" :aria-labelledby="headingId">
        <AppContainer size="wide" class="about-principles__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('about.principles.title')"
                :lead="t('about.principles.lead')"
                :split="false"
            />

            <div v-reveal.stagger class="about-principles__grid">
                <article
                    v-for="principle in principles"
                    :key="principle.id"
                    class="about-principles__item"
                >
                    <span class="about-principles__icon" aria-hidden="true">
                        <component :is="principle.icon" />
                    </span>
                    <BaseHeading level="h3" class="about-principles__title">
                        {{ principle.title }}
                    </BaseHeading>
                    <p class="about-principles__text">{{ principle.text }}</p>
                </article>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import { markRaw } from "vue";
import SvgPin from "~/components/svg/SvgPin.vue";
import SvgWhatsApp from "~/components/svg/SvgWhatsApp.vue";
import SvgCheck from "~/components/svg/SvgCheck.vue";
import SvgHeart from "~/components/svg/SvgHeart.vue";

const { t } = useI18n();
const headingId = useId();

const PRINCIPLE_ENTRIES = [
    { id: "local", icon: markRaw(SvgPin) },
    { id: "thread", icon: markRaw(SvgWhatsApp) },
    { id: "honest", icon: markRaw(SvgCheck) },
    { id: "fees", icon: markRaw(SvgHeart) },
] as const;

const principles = computed(() =>
    PRINCIPLE_ENTRIES.map((entry) => ({
        id: entry.id,
        icon: entry.icon,
        title: t(`about.principles.items.${entry.id}.title`),
        text: t(`about.principles.items.${entry.id}.text`),
    })),
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.about-principles {
    @include mixins.on-dark;

    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: functions.rem(32);
    }

    &__item {
        display: flex;
        flex-direction: column;
        gap: functions.rem(16);
        padding: functions.rem(32);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface);
    }

    &__icon {
        --icon-size: var(--icon-size-lg);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: functions.rem(56);
        height: functions.rem(56);
        border-radius: 50%;
        background-color: var(--surface-mute);
        color: var(--text-color);
    }

    &__title {
        margin: 0;
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--text-color);
    }

    &__text {
        margin: 0;
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    @include bp.down("tablet") {
        &__grid {
            grid-template-columns: 1fr;
            gap: functions.rem(24);
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }

        &__item {
            padding: functions.rem(20);
        }
    }
}
</style>
