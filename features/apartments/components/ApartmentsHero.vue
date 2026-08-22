<template>
    <PageHero
        :title="t('apartments.title')"
        :lead="t('apartments.lead')"
        :crumbs="crumbs"
        :chips="chips"
    >
        <template #actions>
            <BookButton context-kind="apartment" />
            <BaseButton :to="'/tashkent-airport-transfer/'" variant="outline-light">
                {{ t("transfer.all-link") }}
            </BaseButton>
        </template>
    </PageHero>
</template>

<script setup lang="ts">
import type { CardFact } from "~/types/models";

const { t } = useI18n();

const crumbs = computed(() => [{ label: t("nav.home"), to: "/" }, { label: t("nav.apartments") }]);

const chips = computed<CardFact[]>(() => [
    { label: t("apartments.hero.chips.walk"), icon: "train" },
    { label: t("apartments.hero.chips.checkin"), icon: "key" },
    { label: t("apartments.hero.chips.stay"), icon: "bed" },
    { label: t("apartments.hero.chips.reply"), icon: "clock" },
]);
</script>
