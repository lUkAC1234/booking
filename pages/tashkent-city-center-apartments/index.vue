<template>
    <article class="page-apartments">
        <ApartmentsHero />
        <ApartmentsList />
        <LazyApartmentsLocation :hydrate-on-visible="{ rootMargin: '800px' }" />
        <LazyApartmentsHowItWorks :hydrate-on-visible="{ rootMargin: '800px' }" />
        <LazyFaqSection page="apartments" bg="surface" :hydrate-on-visible="{ rootMargin: '800px' }" />
        <LazyBookingCtaBand context-kind="apartment" :hydrate-on-visible="{ rootMargin: '800px' }" />
    </article>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl;

const { items } = useApartments();
const { items: faqItems } = useFaq("apartments");

useSeo({
    title: t("seo.apartments-title"),
    description: t("seo.apartments-description"),
});

const pageUrl = computed(() => `${siteUrl}${localePath("/tashkent-city-center-apartments/")}`);

const jsonLd = useJsonLd();
jsonLd.breadcrumbList([
    { name: t("nav.home"), url: `${siteUrl}${localePath("/")}` },
    { name: t("nav.apartments"), url: pageUrl.value },
]);

jsonLd.apartmentList(
    items.value.map((apartment) => ({
        name: apartment.title,
        description: apartment.summary,
        url: pageUrl.value,
        floorSize: apartment.floorSize,
        numberOfRooms: apartment.rooms,
        numberOfBedrooms: apartment.bedrooms,
        numberOfBathroomsTotal: apartment.bathrooms,
        amenities: apartment.amenities,
    })),
    t("apartments.title"),
);

jsonLd.faqPage(faqItems.value);
</script>

<style scoped lang="scss">
.page-apartments {
    flex: 1;
}
</style>
