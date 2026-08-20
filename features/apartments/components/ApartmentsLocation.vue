<template>
    <section class="apartments-location" :aria-labelledby="headingId">
        <AppContainer size="wide" class="apartments-location__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('apartments.location.title')"
                :lead="t('apartments.location.lead')"
                :split="false"
            />

            <div v-reveal.stagger class="apartments-location__grid">
                <article v-for="place in places" :key="place.id" class="apartments-location__place">
                    <BaseHeading level="h3" class="apartments-location__place-title">
                        {{ place.title }}
                    </BaseHeading>
                    <p class="apartments-location__place-text">{{ place.text }}</p>
                    <BaseButton :to="place.to" variant="ghost" class="apartments-location__place-link">
                        {{ place.linkLabel }}
                        <SvgArrowRight />
                    </BaseButton>
                </article>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();

const PLACE_LINKS = [
    { id: "metro", to: "/tashkent-tours-amirsoy-chimgan/", label: "apartments.location.link-tours" },
    { id: "plov", to: "/tashkent-tours-amirsoy-chimgan/", label: "apartments.location.link-tours" },
    { id: "bazaars", to: "/contact-us/", label: "apartments.location.link-contact" },
    { id: "host", to: "/contact-us/", label: "apartments.location.link-contact" },
    { id: "mountains", to: "/tashkent-tours-amirsoy-chimgan/", label: "apartments.location.link-tours" },
    { id: "airport", to: "/tashkent-airport-transfer/", label: "apartments.location.link-transfer" },
] as const;

const places = computed(() =>
    PLACE_LINKS.map((entry) => ({
        id: entry.id,
        to: entry.to,
        linkLabel: t(entry.label),
        title: t(`apartments.location.items.${entry.id}.title`),
        text: t(`apartments.location.items.${entry.id}.text`),
    })),
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.apartments-location {
    @include mixins.on-dark;

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

    &__place {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: functions.rem(14);
        padding: functions.rem(28);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface);
    }

    &__place-title {
        margin: 0;
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--text-color);
    }

    &__place-text {
        margin: 0;
        flex: 1;
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    &__place-link {
        --icon-size: var(--icon-size-sm);

        margin-top: functions.rem(4);
        color: var(--text-color);
    }

    @include bp.down("laptop") {
        &__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: functions.rem(24);
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }

        &__grid {
            grid-template-columns: 1fr;
        }

        &__place {
            padding: functions.rem(20);
        }
    }
}
</style>
