<template>
    <PageHero
        :title="t('transfer.title')"
        :lead="t('transfer.lead')"
        :crumbs="crumbs"
        :chips="chips"
        :photo-brief="t('transfer.hero.photo')"
    >
        <template #actions>
            <BookButton context-kind="transfer" />
            <BaseButton :to="'/tashkent-tours-amirsoy-chimgan/'" variant="outline-light">
                {{ t("tours.all-link") }}
            </BaseButton>
        </template>
    </PageHero>
</template>

<script setup lang="ts">
import type { CardFact } from "~/types/models";

const { t } = useI18n();

const crumbs = computed(() => [{ label: t("nav.home"), to: "/" }, { label: t("nav.transfer") }]);

const chips = computed<CardFact[]>(() => [
    { label: t("transfer.hero.chips.meet"), icon: "users" },
    { label: t("transfer.hero.chips.tracking"), icon: "plane" },
    { label: t("transfer.hero.chips.waiting"), icon: "clock" },
    { label: t("transfer.hero.chips.night"), icon: "car" },
]);
</script>
