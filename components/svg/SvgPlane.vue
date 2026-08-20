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
        <path d="M12 2c1.1 0 2 .9 2 2v5l7 4v2.5l-7-2v4l2.5 2V21L12 19.5 7.5 21v-1.5L10 17.5v-4l-7 2V13l7-4V4c0-1.1.9-2 2-2Z" />
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
