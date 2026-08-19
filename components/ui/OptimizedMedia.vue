<template>
    <NuxtImg
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        :sizes="sizes"
        :fit="fit"
        :loading="loading"
        :fetchpriority="fetchPriority"
        :format="format"
        :quality="quality"
        :preset="preset"
        :class="['optimized-media', { 'optimized-media--cover': objectFit === 'cover' }]"
        :style="aspectRatio ? { aspectRatio } : undefined"
        decoding="async"
    />
</template>

<script setup lang="ts">
interface Props {
    src: string;
    alt: string;
    width: number | string;
    height: number | string;
    sizes?: string;
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
    loading?: "eager" | "lazy";
    fetchPriority?: "high" | "low" | "auto";
    format?: string;
    quality?: number;
    preset?: string;
    objectFit?: "cover" | "contain" | "fill";
    aspectRatio?: string;
}

withDefaults(defineProps<Props>(), {
    sizes: undefined,
    fit: undefined,
    loading: "lazy",
    fetchPriority: "auto",
    format: "webp",
    quality: 80,
    preset: undefined,
    objectFit: "cover",
    aspectRatio: undefined,
});
</script>

<style scoped lang="scss">
.optimized-media {
    display: block;
    max-width: 100%;
    height: auto;

    &--cover {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
}
</style>
