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
        <path d="M2.5 19h19L14.5 6.5 11 12.5 8.5 9 2.5 19Z" />
        <path d="m12.5 10 2-3.5" />
        <circle cx="17.5" cy="6" r="2" />
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
