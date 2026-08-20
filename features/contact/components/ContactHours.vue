<template>
    <section class="contact-hours" :aria-labelledby="headingId">
        <AppContainer size="wide" class="contact-hours__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('contact.hours.title')"
                :lead="t('contact.hours.lead')"
                :split="false"
            />

            <ul v-reveal.stagger class="contact-hours__rows" role="list">
                <li v-for="row in rows" :key="row.id" class="contact-hours__row">
                    <span class="contact-hours__row-icon" aria-hidden="true">
                        <SvgIcon :name="row.icon" />
                    </span>
                    {{ row.label }}
                </li>
            </ul>

            <h3 class="contact-hours__steps-title">{{ t("contact.hours.include-title") }}</h3>
            <StepList :steps="steps" />
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const headingId = useId();

const ROW_ENTRIES = [
    { id: "hours", icon: "clock" },
    { id: "reply", icon: "whatsapp" },
    { id: "languages", icon: "users" },
    { id: "night", icon: "plane" },
] as const;

const STEP_IDS = ["dates", "flight", "plans"] as const;

const rows = computed(() =>
    ROW_ENTRIES.map((entry) => ({
        id: entry.id,
        icon: entry.icon,
        label: t(`contact.hours.rows.${entry.id}`),
    })),
);

const steps = computed(() =>
    STEP_IDS.map((id) => ({
        id,
        title: t(`contact.hours.steps.${id}.title`),
        text: t(`contact.hours.steps.${id}.text`),
    })),
);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.contact-hours {
    @include mixins.on-dark;

    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(40);
    }

    &__rows {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: functions.rem(16) functions.rem(48);
    }

    &__row {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: center;
        gap: functions.rem(12);
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--text-color);
    }

    &__row-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(24);
        height: functions.rem(24);
        color: var(--primary-color);
    }

    &__steps-title {
        margin: functions.rem(16) 0 0;
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--text-color);
    }

    @include bp.down("tablet") {
        &__rows {
            grid-template-columns: 1fr;
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(28);
        }
    }
}
</style>
