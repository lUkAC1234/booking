<template>
    <article class="page-contact">
        <ContactHero />
        <ContactChannels />
        <ContactHours />
        <ContactAreas />
        <FaqSection page="contact" bg="surface" />
        <BookingCtaBand />
    </article>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const appContact = useAppConfig().contact;
const siteUrl = config.public.siteUrl;

const { items: faqItems } = useFaq("contact");

useSeo({ title: t("seo.contact-title"), description: t("seo.contact-description") });

const pageUrl = computed(() => `${siteUrl}${localePath("/contact-us/")}`);

const jsonLd = useJsonLd();
jsonLd.contactPage({
    url: pageUrl.value,
    name: t("contact.title"),
    description: t("seo.contact-description"),
    inLanguage: locale.value === "ru" ? "ru-RU" : "en-US",
    telephone: [`+${appContact.whatsapp}`, `+${appContact.telegram}`],
});
jsonLd.localBusiness({
    description: t("seo.contact-description"),
    telephone: [`+${appContact.whatsapp}`, `+${appContact.telegram}`],
    addressLocality: appContact.city,
    addressRegion: appContact.region,
    addressCountry: appContact.country,
    areaServed: ["Tashkent", "Amirsoy", "Chimgan", "Charvak", "Beldersay"],
});
jsonLd.breadcrumbList([
    { name: t("nav.home"), url: `${siteUrl}${localePath("/")}` },
    { name: t("nav.contact"), url: pageUrl.value },
]);
jsonLd.faqPage(faqItems.value);
</script>

<style scoped lang="scss">
.page-contact {
    flex: 1;
}
</style>
