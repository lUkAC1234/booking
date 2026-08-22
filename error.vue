<template>
    <NuxtLayout>
        <AppNotFound
            :code="statusCode"
            :title="title"
            :description="description"
            :action-label="actionLabel"
            :on-action="handleAction"
        />
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const { t } = useI18n();
const localePath = useLocalePath();

const isNotFound = computed(() => props.error?.statusCode === 404);
const statusCode = computed(() => props.error?.statusCode ?? 404);

const pageTitle = computed(() =>
    isNotFound.value ? t("error404.page-title") : t("error-boundary.page-title"),
);
const title = computed(() =>
    isNotFound.value ? t("error404.title") : t("error-boundary.title"),
);
const description = computed(() =>
    isNotFound.value ? t("error404.description") : t("error-boundary.description"),
);
const actionLabel = computed(() =>
    isNotFound.value ? t("error404.back-home") : t("error-boundary.go-home"),
);

const handleAction = () => clearError({ redirect: localePath("/") });

useSeoMeta({
    title: () => pageTitle.value,
    robots: "noindex,nofollow",
});
</script>
