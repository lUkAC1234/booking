<template>
    <article class="page-home">
        <HomeHero />
        <HomeApartments />
        <HomeTours />
        <HomeTransfer />
        <HomeContacts />
        <LazyReviewsMarquee />
    </article>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const appContact = useAppConfig().contact;
const siteUrl = config.public.siteUrl;

useSeo({
    title: t("seo.home-title"),
    description: t("seo.home-description"),
    type: "website",
});

const jsonLd = useJsonLd();

jsonLd.website();

jsonLd.localBusiness({
    description: t("seo.home-description"),
    telephone: [`+${appContact.whatsapp}`, `+${appContact.telegram}`],
    addressLocality: appContact.city,
    addressRegion: appContact.region,
    addressCountry: appContact.country,
    areaServed: ["Tashkent", "Amirsoy", "Chimgan", "Charvak", "Beldersay", "Samarkand", "Bukhara"],
});

jsonLd.itemList(
    [
        {
            name: t("apartments.title"),
            url: `${siteUrl}${localePath("/tashkent-city-center-apartments/")}`,
            description: t("seo.apartments-description"),
        },
        {
            name: t("tours.title"),
            url: `${siteUrl}${localePath("/tashkent-tours-amirsoy-chimgan/")}`,
            description: t("seo.tours-description"),
        },
        {
            name: t("transfer.title"),
            url: `${siteUrl}${localePath("/tashkent-airport-transfer/")}`,
            description: t("seo.transfer-description"),
        },
    ],
    t("home.services-title"),
);
</script>

<style scoped lang="scss">
.page-home {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>
