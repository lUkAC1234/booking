<template>
    <NuxtLayout>
        <AppNotFound
            :code="statusCode"
            :title="title"
            :description="description"
            :primary-label="primaryLabel"
            :secondary-label="secondaryLabel"
            :on-primary="handlePrimary"
            :on-secondary="handleSecondary"
            :show-links="isNotFound"
        />
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();

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
const primaryLabel = computed(() =>
    isNotFound.value ? t("error404.back-home") : t("error-boundary.go-home"),
);
const secondaryLabel = computed(() =>
    isNotFound.value ? t("error404.go-back") : t("error-boundary.reload"),
);

const handlePrimary = () => clearError({ redirect: localePath("/") });

const handleSecondary = () => {
    if (isNotFound.value) {
        if (window.history.length > 1) {
            router.back();
            return;
        }
        handlePrimary();
        return;
    }
    window.location.reload();
};

useSeoMeta({
    title: () => pageTitle.value,
    robots: "noindex,nofollow",
});
</script>
