<template>
    <AppNotFound
        :code="404"
        :title="title"
        :description="description"
        :primary-label="primaryLabel"
        :secondary-label="secondaryLabel"
        :on-primary="handlePrimary"
        :on-secondary="handleSecondary"
        show-links
    />
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();

const event = useRequestEvent();
if (event) {
    setResponseStatus(event, 404, "Page not found");
}

const pageTitle = computed(() => t("error404.page-title"));
const title = computed(() => t("error404.title"));
const description = computed(() => t("error404.description"));
const primaryLabel = computed(() => t("error404.back-home"));
const secondaryLabel = computed(() => t("error404.go-back"));

const handlePrimary = () => navigateTo(localePath("/"));

const handleSecondary = () => {
    if (window.history.length > 1) {
        router.back();
        return;
    }
    handlePrimary();
};

useSeoMeta({
    title: () => pageTitle.value,
    robots: "noindex,nofollow",
});
</script>
