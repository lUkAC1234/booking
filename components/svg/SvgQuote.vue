<template>
    <svg
        :style="iconStyle"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path
            d="M9.5 6C5.92 6 3 8.92 3 12.5v1.4c0 3.95 3.04 7.43 7 8.45v-3.1c-1.95-.83-3.4-2.7-3.65-4.85H8.5c1.93 0 3.5-1.57 3.5-3.5V9.5C12 7.57 10.43 6 8.5 6h-.5l1.5 0zm15 0c-3.58 0-6.5 2.92-6.5 6.5v1.4c0 3.95 3.04 7.43 7 8.45v-3.1c-1.95-.83-3.4-2.7-3.65-4.85h2.15c1.93 0 3.5-1.57 3.5-3.5V9.5c0-1.93-1.57-3.5-3.5-3.5h-.5l1.5 0z"
        />
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
