<template>
    <svg
        :style="iconStyle"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
    >
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 19a6 6 0 0 1 12 0" />
        <path d="M15.6 5.2a3.2 3.2 0 0 1 0 5.6" />
        <path d="M17.2 13.4a6 6 0 0 1 3.8 5.6" />
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
