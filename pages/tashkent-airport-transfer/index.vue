<template>
    <article class="page-transfer">
        <TransferHero />
        <TransferRoutes />
        <TransferFeatures />
        <TransferHowItWorks />
        <TransferAirportGuide />
        <FaqSection page="transfer" bg="warm" />
        <BookingCtaBand context-kind="transfer" />
    </article>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl;
const brand = useAppConfig().brand;

const { items: faqItems } = useFaq("transfer");

useSeo({
    title: t("seo.transfer-title"),
    description: t("seo.transfer-description"),
});

const pageUrl = computed(() => `${siteUrl}${localePath("/tashkent-airport-transfer/")}`);

const jsonLd = useJsonLd();
jsonLd.breadcrumbList([
    { name: t("nav.home"), url: `${siteUrl}${localePath("/")}` },
    { name: t("nav.transfer"), url: pageUrl.value },
]);

jsonLd.taxiService({
    name: t("transfer.title"),
    description: t("seo.transfer-description"),
    url: pageUrl.value,
    provider: brand.name,
    areaServed: "Tashkent",
});

jsonLd.faqPage(faqItems.value);
</script>

<style scoped lang="scss">
.page-transfer {
    flex: 1;
}
</style>
