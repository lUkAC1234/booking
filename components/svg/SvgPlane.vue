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
        <path d="M21 15.5 3 10V7l2 .6 1.5 1.8 4.5 1.3V4.6a1.3 1.3 0 0 1 2.6 0v7.9l7.4 2.1v1Z" />
        <path d="M6.5 18.5h11" />
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
