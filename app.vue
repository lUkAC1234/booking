<template>
    <NuxtLayout>
        <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
</template>

<script setup lang="ts">
const localeHead = useLocaleHead({
    dir: true,
    lang: true,
    seo: true,
});

const pageTransition = {
    name: "page-fade",
    mode: "out-in" as const,

    onBeforeLeave(el: Element) {
        const main = (el as HTMLElement).parentElement;
        if (main instanceof HTMLElement && lastMainHeight.value > 0) {
            main.style.minHeight = `${lastMainHeight.value}px`;
        }
    },

    onAfterEnter(el: Element) {
        const main = (el as HTMLElement).parentElement;
        if (main instanceof HTMLElement) {
            main.style.minHeight = "";
            main.focus();
        }
    },

    onLeaveCancelled(el: Element) {
        const main = (el as HTMLElement).parentElement;
        if (main instanceof HTMLElement) {
            main.style.minHeight = "";
        }
    },

    onEnterCancelled(el: Element) {
        const main = (el as HTMLElement).parentElement;
        if (main instanceof HTMLElement) {
            main.style.minHeight = "";
        }
    },
};

const { locale } = useI18n();
const appConfig = useAppConfig();

const lastMainHeight = ref(0);
const mainEl = ref<HTMLElement | null>(null);
onMounted(() => {
    mainEl.value = document.getElementById("main");
});
useResizeObserver(mainEl, (entries) => {
    const entry = entries[0];
    if (!entry) return;
    const box = entry.borderBoxSize?.[0];
    lastMainHeight.value = box ? box.blockSize : (entry.target as HTMLElement).offsetHeight;
});

const headInput = computed(() => {
    const head = localeHead.value;
    return {
        htmlAttrs: {
            ...(head?.htmlAttrs ?? {}),
            lang: locale.value,
        },
        link: (head?.link as unknown[] | undefined) ?? [],
        meta: (head?.meta as unknown[] | undefined) ?? [],
    };
});

useHead(headInput as never);

useSeoMeta({
    ogSiteName: () => appConfig.brand?.name ?? "Brand",
    ogType: "website",
    twitterCard: "summary_large_image",
});
</script>
