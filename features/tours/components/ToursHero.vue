<template>
    <PageHero
        :title="t('tours.title')"
        :lead="t('tours.lead')"
        :crumbs="crumbs"
        :chips="chips"
        :photo-brief="t('tours.hero.photo')"
    >
        <template #actions>
            <BookButton context-kind="tour" />
            <BaseButton :to="'/tashkent-city-center-apartments/'" variant="outline-light">
                {{ t("apartments.all-link") }}
            </BaseButton>
        </template>
    </PageHero>
</template>

<script setup lang="ts">
const { t } = useI18n();

const crumbs = computed(() => [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.tours") },
]);

const chips = computed(() => [
    t("tours.hero.chips.count"),
    t("tours.hero.chips.pickup"),
    t("tours.hero.chips.drive"),
    t("tours.hero.chips.guide"),
]);
</script>
