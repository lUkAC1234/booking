<template>
    <article class="page-tours">
        <ToursHero />
        <ToursGroups />
        <ToursPractical />
        <FaqSection page="tours" bg="surface" />
        <BookingCtaBand context-kind="tour" />
    </article>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl;

const { items } = useTours();
const { items: faqItems } = useFaq("tours");

useSeo({
    title: t("seo.tours-title"),
    description: t("seo.tours-description"),
});

const pageUrl = computed(() => `${siteUrl}${localePath("/tashkent-tours-amirsoy-chimgan/")}`);

const jsonLd = useJsonLd();
jsonLd.breadcrumbList([
    { name: t("nav.home"), url: `${siteUrl}${localePath("/")}` },
    { name: t("nav.tours"), url: pageUrl.value },
]);

jsonLd.touristTripList(
    items.value.map((tour) => ({
        name: tour.title,
        description: tour.summary,
        url: pageUrl.value,
        itinerary: tour.highlights,
    })),
    t("tours.title"),
);

jsonLd.faqPage(faqItems.value);
</script>

<style scoped lang="scss">
.page-tours {
    flex: 1;
}
</style>
