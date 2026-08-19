<template>
    <svg
        :style="iconStyle"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path
            d="M21.93 4.64 18.5 20.5c-.26 1.16-.94 1.45-1.9.9l-5.26-3.87-2.54 2.44c-.28.28-.52.52-1.06.52l.38-5.36 9.76-8.82c.42-.38-.09-.59-.66-.22L5.16 12.7l-5.2-1.63c-1.13-.35-1.15-1.13.24-1.67l20.32-7.83c.94-.35 1.76.22 1.41 1.07z"
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
