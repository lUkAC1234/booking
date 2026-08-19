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
        <path d="M12 2.5v19" />
        <path d="m3.8 7.2 16.4 9.6" />
        <path d="m20.2 7.2-16.4 9.6" />
        <path d="m9.5 4.5 2.5 2.5 2.5-2.5" />
        <path d="m9.5 19.5 2.5-2.5 2.5 2.5" />
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
