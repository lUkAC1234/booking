<template>
    <section class="contact-areas" :aria-labelledby="headingId">
        <AppContainer size="wide" class="contact-areas__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('contact.areas.title')"
                :lead="t('contact.areas.lead')"
                :split="false"
            />

            <ul v-reveal.stagger class="contact-areas__grid" role="list">
                <li v-for="area in areas" :key="area" class="contact-areas__item">
                    <span class="contact-areas__icon" aria-hidden="true">
                        <SvgPin />
                    </span>
                    {{ area }}
                </li>
            </ul>

            <div v-reveal class="contact-areas__links">
                <BaseButton v-for="link in links" :key="link.to" :to="link.to" variant="ghost">
                    {{ link.label }}
                    <SvgArrowRight />
                </BaseButton>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();

const AREA_IDS = ["center", "city", "old", "airport", "mountains", "trips"] as const;

const LINK_ENTRIES = [
    { to: "/tashkent-city-center-apartments/", label: "contact.areas.link-apartments" },
    { to: "/tashkent-tours-amirsoy-chimgan/", label: "contact.areas.link-tours" },
    { to: "/tashkent-airport-transfer/", label: "contact.areas.link-transfer" },
    { to: "/about-us/", label: "contact.areas.link-about" },
] as const;

const areas = computed(() => AREA_IDS.map((id) => t(`contact.areas.items.${id}`)));

const links = computed(() => LINK_ENTRIES.map((entry) => ({ to: entry.to, label: t(entry.label) })));
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.contact-areas {
    background-color: var(--surface-warm);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(48);
    }

    &__grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: functions.rem(16) functions.rem(32);
    }

    &__item {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: center;
        gap: functions.rem(12);
        padding: functions.rem(18) functions.rem(20);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--inner-radius);
        background-color: var(--surface);
        font-size: var(--fz-body-sm);
        line-height: var(--lh-base);
        color: var(--ink-80);
    }

    &__icon {
        display: inline-flex;
        flex-shrink: 0;
        color: var(--primary-color);
    }

    &__links {
        --icon-size: var(--icon-size-sm);

        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(32);
    }

    @include bp.down("laptop") {
        &__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(32);
        }

        &__grid {
            grid-template-columns: 1fr;
        }

        &__links {
            flex-direction: column;
            gap: functions.rem(16);
        }
    }
}
</style>
