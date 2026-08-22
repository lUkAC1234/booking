<template>
    <section class="contact-hours" :aria-labelledby="headingId">
        <AppContainer size="wide" class="contact-hours__inner">
            <div class="contact-hours__top">
                <SectionHeader
                    :heading-id="headingId"
                    :title="t('contact.hours.title')"
                    :lead="t('contact.hours.lead')"
                    :split="false"
                />

                <ul v-reveal class="contact-hours__panel" role="list">
                    <li v-for="row in rows" :key="row.id" class="contact-hours__row">
                        <span class="contact-hours__row-icon" aria-hidden="true">
                            <SvgIcon :name="row.icon" />
                        </span>
                        <span class="contact-hours__row-label">{{ row.label }}</span>
                    </li>
                </ul>
            </div>

            <div class="contact-hours__steps">
                <BaseHeading level="h3" class="contact-hours__steps-title">
                    {{ t("contact.hours.include-title") }}
                </BaseHeading>

                <StepList :steps="steps" />
            </div>
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
        gap: functions.rem(72);
    }

    &__top {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
        gap: functions.rem(64);
        align-items: start;
    }

    &__panel {
        list-style: none;
        margin: 0;
        padding: functions.rem(8);
        display: flex;
        flex-direction: column;
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface);
    }

    &__row {
        display: flex;
        align-items: center;
        gap: functions.rem(16);
        padding: functions.rem(20);

        &:not(:last-child) {
            border-bottom: functions.rem(2) solid var(--border-color);
        }
    }

    &__row-icon {
        --icon-size: var(--icon-size-md);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(44);
        height: functions.rem(44);
        border-radius: var(--pill-radius);
        background-color: var(--surface-mute);
        color: var(--primary-color);
    }

    &__row-label {
        font-size: var(--fz-body);
        line-height: var(--lh-base);
        color: var(--text-color);
        text-wrap: balance;
    }

    &__steps {
        display: flex;
        flex-direction: column;
        gap: functions.rem(40);
    }

    &__steps-title {
        margin: 0;
        padding-bottom: functions.rem(24);
        border-bottom: functions.rem(2) solid var(--border-color);
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--text-color);
    }

    @include bp.down("laptop") {
        &__inner {
            gap: functions.rem(56);
        }

        &__top {
            grid-template-columns: minmax(0, 1fr);
            gap: functions.rem(40);
        }

        &__steps {
            gap: functions.rem(32);
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }

        &__row {
            padding: functions.rem(16);
            gap: functions.rem(12);
        }

        &__steps-title {
            padding-bottom: functions.rem(16);
        }
    }
}
</style>
