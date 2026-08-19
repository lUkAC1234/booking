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
        <path d="M3 12.5h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z" />
        <path d="M6 12.5V6a2 2 0 0 1 3.6-1.2" />
        <path d="M8.8 6.6h2.6" />
        <path d="M7 18.5 6 21M17 18.5 18 21" />
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
