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

const releaseMinHeight = (el: Element) => {
    const main = el.parentElement;
    if (main) main.style.minHeight = "";
};

const pageTransition = {
    name: "page-fade",
    mode: "out-in" as const,

    onBeforeLeave(el: Element) {
        const main = el.parentElement;
        if (main && lastMainHeight.value > 0) {
            main.style.minHeight = `${lastMainHeight.value}px`;
        }
    },

    onAfterEnter(el: Element) {
        const main = el.parentElement;
        if (!main) return;
        main.style.minHeight = "";
        main.focus();
    },

    onLeaveCancelled(el: Element) {
        releaseMinHeight(el);
    },

    onEnterCancelled(el: Element) {
        releaseMinHeight(el);
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
    if (box) {
        lastMainHeight.value = box.blockSize;
        return;
    }
    if (entry.target instanceof HTMLElement) {
        lastMainHeight.value = entry.target.offsetHeight;
    }
});

useHead(() => ({
    ...localeHead.value,
    htmlAttrs: { ...localeHead.value.htmlAttrs, lang: locale.value },
}));

useSeoMeta({
    ogSiteName: () => appConfig.brand?.name ?? "Brand",
    ogType: "website",
    twitterCard: "summary_large_image",
});
</script>
