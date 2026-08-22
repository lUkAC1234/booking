<template>
    <picture class="hero-media">
        <source :media="MOBILE_MEDIA" type="image/webp" :srcset="mobileSrcset" sizes="100vw" />
        <source type="image/webp" :srcset="desktopSrcset" sizes="100vw" />
        <img
            class="hero-media__image"
            :src="fallbackSrc"
            :srcset="fallbackSrcset"
            sizes="100vw"
            :alt="alt"
            :width="width"
            :height="height"
            fetchpriority="high"
            decoding="async"
        />
    </picture>
</template>

<script setup lang="ts">
interface Props {
    desktopSrc: string;
    mobileSrc: string;
    alt: string;
    width: number;
    height: number;
}

const MOBILE_MEDIA = "(max-width: 639px)";
const DESKTOP_WIDTHS = [640, 960, 1280, 1672];
const MOBILE_WIDTHS = [360, 480, 640, 941];
const FALLBACK_WIDTH = 1280;
const QUALITY = 70;

const props = defineProps<Props>();

const img = useImage();

const url = (src: string, format: string, width: number) =>
    img(src, { format, quality: QUALITY, width, fit: "cover" });

const srcset = (src: string, format: string, widths: number[]) =>
    widths.map((width) => `${url(src, format, width)} ${width}w`).join(", ");

const mobileSrcset = computed(() => srcset(props.mobileSrc, "webp", MOBILE_WIDTHS));
const desktopSrcset = computed(() => srcset(props.desktopSrc, "webp", DESKTOP_WIDTHS));
const fallbackSrc = computed(() => url(props.desktopSrc, "jpeg", FALLBACK_WIDTH));
const fallbackSrcset = computed(() => srcset(props.desktopSrc, "jpeg", DESKTOP_WIDTHS));
</script>

<style scoped lang="scss">
.hero-media {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: block;

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
}
</style>
