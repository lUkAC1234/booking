<template>
    <PageHero :title="t('contact.title')" :lead="t('contact.lead')" :crumbs="crumbs" :chips="chips">
        <template #actions>
            <BookButton />
            <BaseButton
                :href="telegramHref"
                variant="outline-light"
                target="_blank"
                rel="noopener noreferrer"
            >
                <SvgTelegram />
                {{ t("common.message-on-telegram") }}
            </BaseButton>
        </template>
    </PageHero>
</template>

<script setup lang="ts">
import type { CardFact } from "~/types/models";

const { t } = useI18n();
const { telegramHref } = useBookingLink();

const crumbs = computed(() => [{ label: t("nav.home"), to: "/" }, { label: t("nav.contact") }]);

const chips = computed<CardFact[]>(() => [
    { label: t("contact.hero.chips.reply"), icon: "clock" },
    { label: t("contact.hero.chips.hours"), icon: "calendar" },
    { label: t("contact.hero.chips.languages"), icon: "users" },
    { label: t("contact.hero.chips.night"), icon: "plane" },
]);
</script>
