import { fileURLToPath } from "node:url";

const GTM_ID = process.env.NUXT_PUBLIC_GTM_ID || "";
const GA_ID = process.env.NUXT_PUBLIC_GA_ID || "";
const IS_DEV = process.env.NODE_ENV === "development";
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || "https://tashkentapartmentstours.com";
const SITE_NAME = process.env.NUXT_PUBLIC_SITE_NAME || "City Center Apartments";

const GA_HEAD_SCRIPTS =
    GA_ID && !IS_DEV
        ? [
              {
                  tagPosition: "head" as const,
                  innerHTML:
                      "window.dataLayer=window.dataLayer||[];" +
                      "function gtag(){dataLayer.push(arguments);}" +
                      "gtag('js',new Date());" +
                      `gtag('config','${GA_ID}');`,
              },
          ]
        : [];

const LOCALE_NAMESPACES = [
    "common",
    "nav",
    "footer",
    "seo",
    "booking",
    "home",
    "apartments",
    "tours",
    "transfer",
    "about",
    "contact",
    "reviews",
    "faq",
    "social-proof",
    "alert",
    "error-boundary",
    "error404",
];

const localeFiles = (code: string) => LOCALE_NAMESPACES.map((ns) => `${code}/${ns}.json`);

const PAGE_PATHS = [
    "/",
    "/tashkent-city-center-apartments/",
    "/tashkent-tours-amirsoy-chimgan/",
    "/tashkent-airport-transfer/",
    "/about-us/",
    "/contact-us/",
];

const PRERENDER_ROUTES = [
    ...PAGE_PATHS,
    ...PAGE_PATHS.map((path) => (path === "/" ? "/ru/" : `/ru${path}`)),
];

export default defineNuxtConfig({
    compatibilityDate: "2026-05-01",
    ssr: true,

    modules: [
        "@nuxt/eslint",
        "@nuxtjs/i18n",
        "@nuxtjs/sitemap",
        "@nuxtjs/robots",
        "@nuxt/image",
        "@vueuse/nuxt",
        "@pinia/nuxt",
    ],

    runtimeConfig: {
        public: {
            siteUrl: SITE_URL,
            defaultLocale: "en",
            gtmId: GTM_ID,
            gaId: GA_ID,
        },
    },

    app: {
        head: {
            htmlAttrs: {
                lang: "en",
            },
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
            meta: [
                { name: "theme-color", content: "#F5EEE7" },
                { name: "format-detection", content: "telephone=no" },
                { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
            ],
            script: [
                {
                    tagPosition: "head",
                    tagPriority: "critical",
                    innerHTML:
                        ";(function(){try{var d=document.documentElement;d.classList.add('js');var v=window.innerWidth||d.clientWidth||0;d.setAttribute('data-tier',v&&v<=639?'mobile':v<=1023?'tablet':v<=1279?'laptop':v<=1365?'notebook':'desktop');}catch(e){}})();",
                },
                ...GA_HEAD_SCRIPTS,
            ],
            link: [
                { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
                {
                    rel: "preload",
                    as: "font",
                    type: "font/woff2",
                    href: "/fonts/onest/Onest-Latin.woff2",
                    crossorigin: "anonymous",
                    fetchpriority: "high",
                },
                {
                    rel: "preload",
                    as: "font",
                    type: "font/woff2",
                    href: "/fonts/onest/Onest-Cyrillic.woff2",
                    crossorigin: "anonymous",
                    fetchpriority: "high",
                },
            ],
            noscript: GTM_ID
                ? [
                      {
                          tagPosition: "bodyOpen",
                          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe>`,
                      },
                  ]
                : [],
        },
        pageTransition: false,
        layoutTransition: false,
    },

    css: ["~/assets/styles/style.scss"],

    components: [
        { path: "~/components", pathPrefix: false },
        { path: "~/features", pattern: "**/components/*.vue", pathPrefix: false },
    ],

    imports: {
        dirs: [
            "composables",
            "composables/**",
            "stores",
            "utils",
            "features/*/composables",
            "features/*/stores",
        ],
    },

    i18n: {
        strategy: "prefix_except_default",
        defaultLocale: "en",
        trailingSlash: true,
        lazy: true,
        langDir: "locales/",
        locales: [
            {
                code: "en",
                language: "en-US",
                name: "English",
                files: localeFiles("en"),
            },
            {
                code: "ru",
                language: "ru-RU",
                name: "Русский",
                files: localeFiles("ru"),
            },
        ],
        baseUrl: SITE_URL,
        detectBrowserLanguage: false,
        bundle: {
            optimizeTranslationDirective: false,
        },
    },

    site: {
        url: SITE_URL,
        name: SITE_NAME,
        trailingSlash: true,
    },

    sitemap: {
        zeroRuntime: true,
        autoLastmod: true,
        xsl: false,
        defaults: {
            changefreq: "weekly",
            priority: 0.7,
        },
    },

    robots: {
        sitemap: "/sitemap_index.xml",
        groups: [{ userAgent: "*", allow: "/" }],
    },

    image: {
        formats: ["avif", "webp", "jpg"],
        quality: 75,
        densities: [1, 2],
        screens: {
            xs: 360,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1920,
        },
        provider: "ipx",
    },

    nitro: {
        preset: "static",
        compressPublicAssets: {
            brotli: true,
            gzip: true,
        },
        prerender: {
            crawlLinks: true,
            failOnError: false,
            routes: PRERENDER_ROUTES,
            ignore: [/\?/],
        },
        routeRules: {
            "/**": { prerender: true },
        },
        rollupConfig: {
            onwarn(warning, defaultHandler) {
                if (typeof warning.message === "string" && warning.message.includes("cache-driver")) {
                    return;
                }
                defaultHandler(warning);
            },
        },
    },

    vite: {
        resolve: {
            alias: {
                "~": fileURLToPath(new URL("./", import.meta.url)),
                "@": fileURLToPath(new URL("./", import.meta.url)),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ["legacy-js-api", "import", "global-builtin"],
                },
            },
        },
        build: {
            cssCodeSplit: false,
            target: "es2020",
        },
        optimizeDeps: {
            exclude: ["#app-manifest", "#build/app-manifest"],
        },
    },

    typescript: {
        strict: true,
        typeCheck: false,
    },

    features: {
        inlineStyles: false,
    },

    experimental: {
        payloadExtraction: false,
        renderJsonPayloads: true,
        viewTransition: false,
        appManifest: true,
    },

    build: {
        transpile: ["gsap"],
    },

    devtools: { enabled: false },
});
