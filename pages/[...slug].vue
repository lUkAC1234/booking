<template>
    <AppNotFound
        :code="404"
        :title="title"
        :description="description"
        :action-label="actionLabel"
        :on-action="handleAction"
    />
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const event = useRequestEvent();
if (event) {
    setResponseStatus(event, 404, "Page not found");
}

const pageTitle = computed(() => t("error404.page-title"));
const title = computed(() => t("error404.title"));
const description = computed(() => t("error404.description"));
const actionLabel = computed(() => t("error404.back-home"));

const handleAction = () => navigateTo(localePath("/"));

useSeoMeta({
    title: () => pageTitle.value,
    robots: "noindex,nofollow",
});
</script>
