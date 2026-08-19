<template>
    <svg
        :style="iconStyle"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M2.5 19h19L14.5 6 11 12l-2.5-3.5L2.5 19Z" />
        <path d="m12.2 9.8 2.3-3.8 2.6 4.5-2.4 1.2-2.5-1.9Z" fill="currentColor" stroke="none" opacity="0.25" />
    </svg>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";

const iconStyle: CSSProperties = {
    width: "var(--icon-size)",
    height: "var(--icon-size)",
    minWidth: "var(--icon-size)",
};
</script>
