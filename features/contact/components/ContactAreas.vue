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
                <li v-for="area in areas" :key="area.id" class="contact-areas__tile">
                    <span class="contact-areas__tile-icon" aria-hidden="true">
                        <SvgIcon :name="area.icon" />
                    </span>
                    <span class="contact-areas__tile-label">{{ area.label }}</span>
                </li>
            </ul>

            <div v-reveal class="contact-areas__links">
                <BaseButton v-for="link in links" :key="link.to" :to="link.to" variant="outline-light">
                    <SvgIcon :name="link.icon" />
                    {{ link.label }}
                </BaseButton>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();

const AREA_ENTRIES = [
    { id: "center", icon: "building" },
    { id: "city", icon: "pin" },
    { id: "old", icon: "heart" },
    { id: "airport", icon: "plane" },
    { id: "mountains", icon: "mountain" },
    { id: "trips", icon: "car" },
] as const;

const LINK_ENTRIES = [
    { to: "/tashkent-city-center-apartments/", label: "contact.areas.link-apartments", icon: "building" },
    { to: "/tashkent-tours-amirsoy-chimgan/", label: "contact.areas.link-tours", icon: "mountain" },
    { to: "/tashkent-airport-transfer/", label: "contact.areas.link-transfer", icon: "car" },
    { to: "/about-us/", label: "contact.areas.link-about", icon: "users" },
] as const;

const areas = computed(() =>
    AREA_ENTRIES.map((entry) => ({
        id: entry.id,
        icon: entry.icon,
        label: t(`contact.areas.items.${entry.id}`),
    })),
);

const links = computed(() => LINK_ENTRIES.map((entry) => ({ to: entry.to, icon: entry.icon, label: t(entry.label) })));
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
        gap: functions.rem(24);
    }

    &__tile {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: functions.rem(20);
        padding: functions.rem(28);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface);
    }

    &__tile-icon {
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

    &__tile-label {
        font-size: var(--fz-body);
        font-weight: var(--font-weight-medium);
        line-height: var(--lh-base);
        color: var(--ink);
        text-wrap: balance;
    }

    &__links {
        --icon-size: var(--icon-size-sm);

        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(16);
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
            grid-template-columns: minmax(0, 1fr);
            gap: functions.rem(16);
        }

        &__tile {
            flex-direction: row;
            align-items: center;
            gap: functions.rem(16);
            padding: functions.rem(20);
        }

        &__tile-icon {
            width: functions.rem(44);
            height: functions.rem(44);
        }

        &__links {
            flex-direction: column;
            align-items: stretch;
        }
    }
}
</style>
