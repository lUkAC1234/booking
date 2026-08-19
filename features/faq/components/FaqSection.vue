<template>
    <section
        v-if="resolvedItems.length"
        class="faq-section"
        :class="`faq-section--bg-${bg}`"
        :aria-labelledby="headingId"
    >
        <AppContainer size="wide" class="faq-section__inner">
            <header class="faq-section__header">
                <BaseHeading :id="headingId" v-reveal.text level="h2" class="faq-section__title">
                    {{ resolvedTitle }}
                </BaseHeading>
                <BaseLead v-if="lead" v-reveal class="faq-section__lead">
                    {{ lead }}
                </BaseLead>
            </header>

            <div v-reveal.stagger class="faq-section__list">
                <BaseAccordion
                    v-for="(item, idx) in resolvedItems"
                    :key="item.id"
                    :title="item.question"
                    :default-open="idx === defaultOpenIndex"
                >
                    <p>{{ item.answer }}</p>
                </BaseAccordion>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { FaqItem, FaqPage } from "~/types/models";

interface Props {
    page?: FaqPage;
    items?: FaqItem[];
    title?: string;
    lead?: string;
    bg?: "surface" | "warm";
    defaultOpenIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
    page: undefined,
    items: undefined,
    title: undefined,
    lead: "",
    bg: "surface",
    defaultOpenIndex: 0,
});

const { t, te } = useI18n();
const { items: faqItems } = useFaq(props.page);

const resolvedItems = computed<FaqItem[]>(() => props.items ?? faqItems.value);

const resolvedTitle = computed(() => props.title ?? (te("faq.title") ? t("faq.title") : ""));

const headingId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.faq-section {
    padding-block: var(--section-py);

    &--bg-surface {
        background-color: var(--surface);
    }

    &--bg-warm {
        background-color: var(--surface-warm);
    }

    &__inner {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
        gap: functions.rem(80);
        align-items: start;

        @include bp.down("laptop") {
            grid-template-columns: 1fr;
            gap: functions.rem(48);
        }
    }

    &__header {
        display: flex;
        flex-direction: column;
        gap: functions.rem(16);
        position: sticky;
        top: functions.rem(96);

        @include bp.down("laptop") {
            position: static;
        }
    }

    &__title {
        margin: 0;
        font-size: var(--fz-section-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__lead {
        margin: 0;
        color: var(--ink-80);
    }

    &__list {
        display: flex;
        flex-direction: column;

        & > :last-child {
            border-bottom: functions.rem(2) solid var(--ink-20);
        }
    }
}
</style>
