import type { MaybeRefOrGetter } from "vue";

export type BookingKind = "general" | "apartment" | "tour" | "transfer";

export const useBookingLink = (
    kind: MaybeRefOrGetter<BookingKind> = "general",
    itemTitle?: MaybeRefOrGetter<string | undefined>,
) => {
    const { t } = useI18n();
    const contact = useAppConfig().contact;

    const message = computed(() => {
        const resolvedKind = toValue(kind);
        const title = toValue(itemTitle);
        if (resolvedKind === "general" || !title) return t("booking.message.general");
        return t(`booking.message.${resolvedKind}`, { item: title });
    });

    const whatsappHref = computed(
        () => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message.value)}`,
    );

    const telegramHref = computed(() => `https://t.me/+${contact.telegram}`);

    return { message, whatsappHref, telegramHref };
};
