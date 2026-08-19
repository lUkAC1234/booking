<template>
    <svg
        :style="iconStyle"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path
            d="M23.5 6.2a3 3 0 0 0-2.11-2.13C19.51 3.55 12 3.55 12 3.55s-7.51 0-9.39.52A3 3 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3 3 0 0 0 2.11 2.13c1.88.52 9.39.52 9.39.52s7.51 0 9.39-.52A3 3 0 0 0 23.5 17.8C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.27 3.6L9.6 15.6z"
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
