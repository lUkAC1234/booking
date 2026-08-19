<template>
    <BaseButton
        :href="whatsappHref"
        :variant="variant"
        :size="size"
        :fullwidth="fullwidth"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="ariaLabel"
    >
        {{ label ?? t("common.book-now") }}
    </BaseButton>
</template>

<script setup lang="ts">
import type { BookingKind } from "~/features/booking/composables/useBookingLink";

interface Props {
    contextKind?: BookingKind;
    itemTitle?: string;
    label?: string;
    variant?: "primary-pill" | "primary" | "outline-dark" | "outline-light";
    size?: "default" | "small";
    fullwidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    contextKind: "general",
    itemTitle: undefined,
    label: undefined,
    variant: "primary-pill",
    size: "default",
    fullwidth: false,
});

const { t } = useI18n();

const { whatsappHref } = useBookingLink(
    () => props.contextKind,
    () => props.itemTitle,
);

const ariaLabel = computed(() =>
    props.itemTitle
        ? `${t("common.book-on-whatsapp")} — ${props.itemTitle}`
        : t("common.book-on-whatsapp"),
);
</script>
