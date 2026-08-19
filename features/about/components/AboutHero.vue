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
const { t } = useI18n();

const crumbs = computed(() => [{ label: t("nav.home"), to: "/" }, { label: t("nav.about") }]);

const chips = computed(() => [
    t("about.hero.chips.since"),
    t("about.hero.chips.apartments"),
    t("about.hero.chips.tours"),
    t("about.hero.chips.languages"),
]);
</script>
