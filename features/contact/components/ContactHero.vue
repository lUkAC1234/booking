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
                {{ t("common.message-on-telegram") }}
            </BaseButton>
        </template>
    </PageHero>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { telegramHref } = useBookingLink();

const crumbs = computed(() => [{ label: t("nav.home"), to: "/" }, { label: t("nav.contact") }]);

const chips = computed(() => [
    t("contact.hero.chips.reply"),
    t("contact.hero.chips.hours"),
    t("contact.hero.chips.languages"),
    t("contact.hero.chips.night"),
]);
</script>
