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
        <path d="M4 21V6.5L11 3v18" />
        <path d="M11 9h6.5a1.5 1.5 0 0 1 1.5 1.5V21" />
        <path d="M2.5 21h19" />
        <path d="M7 9.5h.01M7 13.5h.01M7 17.5h.01M14.5 13h.01M14.5 17h.01" />
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
