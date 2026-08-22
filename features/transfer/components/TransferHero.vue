<template>
    <PageHero
        :title="t('transfer.title')"
        :lead="t('transfer.lead')"
        :crumbs="crumbs"
        :chips="chips"
        :photo="photo"
    >
        <template #actions>
            <BookButton context-kind="transfer" />
            <BaseButton :to="'/tashkent-tours-amirsoy-chimgan/'" variant="outline-dark">
                {{ t("tours.all-link") }}
            </BaseButton>
        </template>
    </PageHero>
</template>

<script setup lang="ts">
import type { CardFact } from "~/types/models";

const PHOTO_WIDTH = 1672;
const PHOTO_HEIGHT = 941;

const { t } = useI18n();

const crumbs = computed(() => [{ label: t("nav.home"), to: "/" }, { label: t("nav.transfer") }]);

const chips = computed<CardFact[]>(() => [
    { label: t("transfer.hero.chips.meet"), icon: "users" },
    { label: t("transfer.hero.chips.tracking"), icon: "plane" },
    { label: t("transfer.hero.chips.waiting"), icon: "clock" },
    { label: t("transfer.hero.chips.night"), icon: "car" },
]);

const photo = computed(() => ({
    desktop: "/images/airport/heroImage.webp",
    mobile: "/images/airport/heroImageMobile.webp",
    alt: t("transfer.hero.photo"),
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
}));
</script>
