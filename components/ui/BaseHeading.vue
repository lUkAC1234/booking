<template>
    <component :is="level" :class="['base-heading', `base-heading--${visual ?? level}`]">
        <slot />
    </component>
</template>

<script setup lang="ts">
interface Props {
    level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    visual?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

withDefaults(defineProps<Props>(), { level: "h2", visual: undefined });
</script>

<style scoped lang="scss">
.base-heading {
    margin: 0;
    color: var(--text-color);
    line-height: var(--lh-snug);
    letter-spacing: var(--ls-heading);
    text-wrap: balance;
}
</style>
