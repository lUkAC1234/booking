<template>
    <section class="about-services" :aria-labelledby="headingId">
        <AppContainer size="wide" class="about-services__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('about.services.title')"
                :lead="t('about.services.lead')"
                :split="false"
            />

            <div v-reveal.stagger class="about-services__grid">
                <article v-for="service in services" :key="service.id" class="about-services__item">
                    <span class="about-services__icon" aria-hidden="true">
                        <component :is="service.icon" />
                    </span>
                    <BaseHeading level="h3" class="about-services__title">
                        {{ service.title }}
                    </BaseHeading>
                    <p class="about-services__text">{{ service.text }}</p>
                    <BaseButton :to="service.to" variant="ghost" class="about-services__link">
                        {{ service.link }}
                        <SvgArrowRight />
                    </BaseButton>
                </article>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import { markRaw } from "vue";
import SvgBuilding from "~/components/svg/SvgBuilding.vue";
import SvgMountain from "~/components/svg/SvgMountain.vue";
import SvgPlane from "~/components/svg/SvgPlane.vue";

const { t } = useI18n();
const headingId = useId();

const SERVICE_ENTRIES = [
    { id: "apartments", to: "/tashkent-city-center-apartments/", icon: markRaw(SvgBuilding) },
    { id: "tours", to: "/tashkent-tours-amirsoy-chimgan/", icon: markRaw(SvgMountain) },
    { id: "transfer", to: "/tashkent-airport-transfer/", icon: markRaw(SvgPlane) },
] as const;

const services = computed(() =>
    SERVICE_ENTRIES.map((entry) => ({
        id: entry.id,
        to: entry.to,
        icon: entry.icon,
        title: t(`about.services.items.${entry.id}.title`),
        text: t(`about.services.items.${entry.id}.text`),
        link: t(`about.services.items.${entry.id}.link`),
    })),
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.about-services {
    background-color: var(--surface);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: functions.rem(32);
    }

    &__item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: functions.rem(16);
        padding: functions.rem(32);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface-warm);
    }

    &__icon {
        --icon-size: var(--icon-size-lg);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: functions.rem(56);
        height: functions.rem(56);
        border-radius: 50%;
        background-color: var(--primary-color);
        color: var(--white);
    }

    &__title {
        margin: 0;
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__text {
        margin: 0;
        flex: 1;
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-80);
    }

    &__link {
        --icon-size: var(--icon-size-sm);

        margin-top: functions.rem(4);
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
