<template>
    <article class="page-about">
        <AboutHero />
        <AboutStory />
        <AboutStats />
        <AboutPrinciples />
        <AboutServices />
        <AboutStay />
        <BookingCtaBand />
    </article>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl;

useSeo({ title: t("seo.about-title"), description: t("seo.about-description") });

const jsonLd = useJsonLd();
jsonLd.aboutPage({
    url: `${siteUrl}${localePath("/about-us/")}`,
    name: t("about.title"),
    description: t("seo.about-description"),
    inLanguage: locale.value === "ru" ? "ru-RU" : "en-US",
});
jsonLd.breadcrumbList([
    { name: t("nav.home"), url: `${siteUrl}${localePath("/")}` },
    { name: t("nav.about"), url: `${siteUrl}${localePath("/about-us/")}` },
]);
</script>

<style scoped lang="scss">
.page-about {
    flex: 1;
}
</style>
