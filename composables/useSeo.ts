import type { MaybeRefOrGetter } from "vue";

interface SeoInput {
    title: MaybeRefOrGetter<string>;
    description: MaybeRefOrGetter<string>;
    keywords?: MaybeRefOrGetter<string | string[] | undefined>;
    image?: MaybeRefOrGetter<string | undefined>;
    type?: "website" | "article" | "profile";
    noindex?: boolean;
}

const DEFAULT_OG_IMAGE = "/og-default.png";

export const useSeo = (input: SeoInput) => {
    const route = useRoute();
    const config = useRuntimeConfig();
    const { brand } = useAppConfig();
    const siteUrl = config.public.siteUrl;

    const canonical = computed(() => {
        const path = route.path.endsWith("/") ? route.path : `${route.path}/`;
        return `${siteUrl}${path}`;
    });

    const title = computed(() => toValue(input.title));
    const description = computed(() => toValue(input.description));

    const keywords = computed(() => {
        const raw = toValue(input.keywords);
        const list = Array.isArray(raw) ? raw : (raw ?? "").split(",");
        const cleaned = list.map((item) => item.trim()).filter((item) => item.length > 0);
        return cleaned.length > 0 ? cleaned.join(", ") : undefined;
    });

    const resolvedImage = computed(() => {
        const raw = toValue(input.image);
        const path = raw && raw.length > 0 ? raw : DEFAULT_OG_IMAGE;
        if (path.startsWith("http://") || path.startsWith("https://")) return path;
        return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
    });

    const imageType = computed(() =>
        resolvedImage.value.endsWith(".png") ? "image/png" : "image/jpeg",
    );

    useSeoMeta({
        title: () => title.value,
        description: () => description.value,
        keywords: () => keywords.value,
        ogTitle: () => title.value,
        ogDescription: () => description.value,
        ogType: input.type ?? "website",
        ogImage: () => resolvedImage.value,
        ogImageType: () => imageType.value,
        ogImageWidth: 1200,
        ogImageHeight: 630,
        ogImageAlt: () => title.value,
        ogUrl: () => canonical.value,
        // og:locale intentionally omitted: @nuxtjs/i18n emits it as en_US / ru_RU.
        // Setting it here overwrote that with the bare locale code ("en"), which is invalid OG.
        ogSiteName: brand.name,
        twitterCard: "summary_large_image",
        twitterTitle: () => title.value,
        twitterDescription: () => description.value,
        twitterImage: () => resolvedImage.value,
        robots: input.noindex ? "noindex,nofollow" : "index,follow",
    });

    useHead({
        link: [{ rel: "canonical", href: () => canonical.value }],
    });

    return { canonical, ogImage: resolvedImage };
};
