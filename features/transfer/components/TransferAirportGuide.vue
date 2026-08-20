<template>
    <section class="transfer-guide" :aria-labelledby="headingId">
        <AppContainer size="wide" class="transfer-guide__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('transfer.guide.title')"
                :lead="t('transfer.guide.lead')"
                :split="false"
            />

            <div v-reveal.stagger class="transfer-guide__grid">
                <article v-for="item in items" :key="item.id" class="transfer-guide__item">
                    <span class="transfer-guide__icon" aria-hidden="true">
                        <SvgIcon :name="item.icon" />
                    </span>
                    <BaseHeading level="h3" class="transfer-guide__title">{{ item.title }}</BaseHeading>
                    <p class="transfer-guide__text">{{ item.text }}</p>
                </article>
            </div>

            <div v-reveal class="transfer-guide__links">
                <BaseButton :to="'/tashkent-city-center-apartments/'" variant="ghost">
                    {{ t("apartments.all-link") }}
                    <SvgArrowRight />
                </BaseButton>
                <BaseButton :to="'/contact-us/'" variant="ghost">
                    {{ t("home.contacts.contact-link") }}
                    <SvgArrowRight />
                </BaseButton>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();

const GUIDE_ENTRIES = [
    { id: "arrivals", icon: "plane" },
    { id: "sim", icon: "wifi" },
    { id: "money", icon: "document" },
    { id: "drive", icon: "pin" },
    { id: "luggage", icon: "users" },
    { id: "departure", icon: "clock" },
] as const;

const items = computed(() =>
    GUIDE_ENTRIES.map((entry) => ({
        id: entry.id,
        icon: entry.icon,
        title: t(`transfer.guide.items.${entry.id}.title`),
        text: t(`transfer.guide.items.${entry.id}.text`),
    })),
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.transfer-guide {
    background-color: var(--surface);
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
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-80);
    }

    &__links {
        --icon-size: var(--icon-size-sm);

        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(32);
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

        &__links {
            flex-direction: column;
            gap: functions.rem(16);
        }
    }
}
</style>
