<template>
    <PageHero
        :title="t('tours.title')"
        :lead="t('tours.lead')"
        :crumbs="crumbs"
        :chips="chips"
        :photo="photo"
    >
        <template #actions>
            <BookButton context-kind="tour" />
            <BaseButton :to="'/tashkent-city-center-apartments/'" variant="outline-dark">
                {{ t("apartments.all-link") }}
            </BaseButton>
        </template>
    </PageHero>
</template>

<script setup lang="ts">
import type { CardFact } from "~/types/models";

const PHOTO_WIDTH = 1672;
const PHOTO_HEIGHT = 941;

const { t } = useI18n();

const crumbs = computed(() => [{ label: t("nav.home"), to: "/" }, { label: t("nav.tours") }]);

const chips = computed<CardFact[]>(() => [
    { label: t("tours.hero.chips.count"), icon: "mountain" },
    { label: t("tours.hero.chips.pickup"), icon: "pin" },
    { label: t("tours.hero.chips.drive"), icon: "clock" },
    { label: t("tours.hero.chips.car"), icon: "car" },
]);

const photo = computed(() => ({
    desktop: "/images/excursions/heroImage.webp",
    mobile: "/images/excursions/heroImageMobile.webp",
    alt: t("tours.hero.photo"),
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
}));
</script>
