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
        <path d="M3 18v-8" />
        <path d="M3 13.5h18V18" />
        <path d="M21 18v2M3 18v2" />
        <path d="M6.5 13.5v-3h5.5a2.5 2.5 0 0 1 2.5 2.5v.5" />
        <circle cx="7.5" cy="8" r="1.6" />
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
