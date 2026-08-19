<template>
    <section class="booking-cta" :aria-labelledby="headingId">
        <AppContainer size="wide" class="booking-cta__inner">
            <div class="booking-cta__copy">
                <BaseHeading :id="headingId" v-reveal.text level="h2" class="booking-cta__title">
                    {{ title ?? t("booking.cta-title") }}
                </BaseHeading>
                <BaseLead v-reveal class="booking-cta__lead">
                    {{ lead ?? t("booking.cta-lead") }}
                </BaseLead>
            </div>

            <div v-reveal class="booking-cta__actions">
                <BookButton :context-kind="contextKind" :item-title="itemTitle" />
                <BaseButton :href="telegramHref" variant="outline-dark" target="_blank" rel="noopener noreferrer">
                    {{ t("common.message-on-telegram") }}
                </BaseButton>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { BookingKind } from "~/features/booking/composables/useBookingLink";

interface Props {
    title?: string;
    lead?: string;
    contextKind?: BookingKind;
    itemTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: undefined,
    lead: undefined,
    contextKind: "general",
    itemTitle: undefined,
});

const { t } = useI18n();
const { telegramHref } = useBookingLink(() => props.contextKind);
const headingId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.booking-cta {
    @include mixins.on-dark;

    padding-block: var(--section-py);

    &__inner {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: functions.rem(56);
    }

    &__copy {
        display: flex;
        flex-direction: column;
        gap: functions.rem(16);
        max-width: functions.rem(720);
    }

    &__title {
        font-size: var(--fz-section-title);
        line-height: var(--lh-snug);
        letter-spacing: var(--ls-heading);
    }

    &__lead {
        color: var(--ink-60);
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: functions.rem(16);
        flex-shrink: 0;
    }

    @include bp.down("laptop") {
        &__inner {
            flex-direction: column;
            align-items: flex-start;
            gap: functions.rem(32);
        }
    }

    @include bp.down("mobile") {
        &__actions {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
        }
    }
}
</style>
