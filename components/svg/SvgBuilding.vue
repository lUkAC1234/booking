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
        <path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h7A1.5 1.5 0 0 1 15 4.5V21" />
        <path d="M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21" />
        <path d="M3 21h18" />
        <path d="M8 7h.01M11.5 7h.01M8 11h.01M11.5 11h.01M8 15h.01M11.5 15h.01" />
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
