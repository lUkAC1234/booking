<template>
    <PageHero
        :title="t('apartments.title')"
        :lead="t('apartments.lead')"
        :crumbs="crumbs"
        :chips="chips"
        :photo-brief="t('apartments.hero.photo')"
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
const { t } = useI18n();

const crumbs = computed(() => [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.apartments") },
]);

const chips = computed(() => [
    t("apartments.hero.chips.walk"),
    t("apartments.hero.chips.checkin"),
    t("apartments.hero.chips.stay"),
    t("apartments.hero.chips.reply"),
]);
</script>
