<template>
    <ToursShowcase tone="dark" :title="t('tours.section-title')" :lead="t('tours.section-lead')">
        <template #action>
            <BaseButton :to="'/tashkent-tours-amirsoy-chimgan/'" variant="outline-dark">
                {{ t("tours.all-link") }}
            </BaseButton>
        </template>
    </ToursShowcase>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>
