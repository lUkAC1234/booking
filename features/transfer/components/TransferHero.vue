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
const { t } = useI18n();

const crumbs = computed(() => [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.transfer") },
]);

const chips = computed(() => [
    t("transfer.hero.chips.meet"),
    t("transfer.hero.chips.tracking"),
    t("transfer.hero.chips.waiting"),
    t("transfer.hero.chips.night"),
]);
</script>
