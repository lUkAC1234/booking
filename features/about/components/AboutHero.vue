<template>
    <PageHero :title="t('about.title')" :lead="t('about.lead')" :crumbs="crumbs" :chips="chips">
        <template #actions>
            <BookButton />
            <BaseButton :to="'/contact-us/'" variant="outline-light">
                {{ t("about.story.link-contact") }}
            </BaseButton>
        </template>
    </PageHero>
</template>

<script setup lang="ts">
import type { CardFact } from "~/types/models";

const { t } = useI18n();

const crumbs = computed(() => [{ label: t("nav.home"), to: "/" }, { label: t("nav.about") }]);

const chips = computed<CardFact[]>(() => [
    { label: t("about.hero.chips.since"), icon: "calendar" },
    { label: t("about.hero.chips.apartments"), icon: "building" },
    { label: t("about.hero.chips.tours"), icon: "mountain" },
    { label: t("about.hero.chips.languages"), icon: "users" },
]);
</script>
