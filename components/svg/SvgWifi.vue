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
        <path d="M2.5 9a15 15 0 0 1 19 0" />
        <path d="M5.5 12.5a10.5 10.5 0 0 1 13 0" />
        <path d="M8.5 16a6 6 0 0 1 7 0" />
        <path d="M12 19.5h.01" />
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
