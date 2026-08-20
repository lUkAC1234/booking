<template>
    <section class="about-stay" :aria-labelledby="headingId">
        <AppContainer size="wide" class="about-stay__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('about.stay.title')"
                :lead="t('about.stay.lead')"
                :split="false"
            />

            <div v-reveal.stagger class="about-stay__grid">
                <div class="about-stay__card">
                    <BaseHeading level="h3" class="about-stay__card-title">
                        {{ t("about.stay.rules-title") }}
                    </BaseHeading>

                    <dl class="about-stay__rules">
                        <div v-for="rule in rules" :key="rule.id" class="about-stay__rule">
                            <span class="about-stay__rule-icon" aria-hidden="true">
                                <SvgIcon :name="rule.icon" />
                            </span>
                            <dt class="about-stay__rule-term">{{ rule.term }}</dt>
                            <dd class="about-stay__rule-text">{{ rule.text }}</dd>
                        </div>
                    </dl>
                </div>

                <div class="about-stay__card">
                    <BaseHeading level="h3" class="about-stay__card-title">
                        {{ t("about.stay.extras-title") }}
                    </BaseHeading>
                    <p class="about-stay__note">{{ t("about.stay.extras-lead") }}</p>

                    <CheckList :items="extras" />

                    <BaseButton
                        :to="'/tashkent-city-center-apartments/'"
                        variant="ghost"
                        class="about-stay__link"
                    >
                        {{ t("about.stay.extras-link") }}
                        <SvgArrowRight />
                    </BaseButton>
                </div>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { IconName } from "~/types/models";

const { t } = useI18n();
const headingId = useId();

const RULE_ENTRIES: ReadonlyArray<{ id: string; icon: IconName }> = [
    { id: "hours", icon: "clock" },
    { id: "keys", icon: "key" },
    { id: "registration", icon: "document" },
    { id: "guests", icon: "users" },
    { id: "building", icon: "building" },
];

const EXTRA_IDS = ["delivery", "bicycle", "car", "transfer", "tours", "languages"] as const;

const rules = computed(() =>
    RULE_ENTRIES.map((entry) => ({
        id: entry.id,
        icon: entry.icon,
        term: t(`about.stay.rules.${entry.id}.term`),
        text: t(`about.stay.rules.${entry.id}.text`),
    })),
);

const extras = computed(() => EXTRA_IDS.map((id) => t(`about.stay.extras.${id}`)));
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.about-stay {
    background-color: var(--surface-warm);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__grid {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
        gap: functions.rem(32);
        align-items: start;
    }

    &__card {
        display: flex;
        flex-direction: column;
        gap: functions.rem(20);
        padding: functions.rem(32);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface);
    }

    &__card-title {
        margin: 0;
        font-size: var(--fz-subsection-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__note {
        margin: 0;
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    &__rules {
        width: 100%;
        margin: 0;
    }

    &__rule {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        column-gap: functions.rem(16);
        row-gap: functions.rem(6);
        padding-block: functions.rem(20);
        border-top: functions.rem(2) solid var(--border-color);
    }

    &__rule-icon {
        --icon-size: var(--icon-size-lg);

        grid-row: span 2;
        align-self: start;
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

    &__rule-term {
        font-size: var(--fz-body);
        font-weight: var(--font-weight-medium);
        line-height: var(--lh-snug);
        color: var(--ink);
    }

    &__rule-text {
        margin: 0;
        font-size: var(--fz-body-sm);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    &__link {
        --icon-size: var(--icon-size-sm);

        align-self: flex-start;
        margin-top: functions.rem(4);
    }

    @include bp.down("laptop") {
        &__grid {
            grid-template-columns: 1fr;
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }

        &__grid {
            gap: functions.rem(24);
        }

        &__card {
            padding: functions.rem(20);
        }

        &__rule {
            column-gap: functions.rem(12);
        }

        &__rule-icon {
            width: functions.rem(40);
            height: functions.rem(40);
        }
    }
}
</style>
