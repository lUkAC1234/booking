<template>
    <svg
        :style="iconStyle"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M12 20.84s-7.34-4.46-9.36-9.17C1.18 7.96 3.27 4.6 6.95 4.6c2 0 3.79.97 4.55 2.52.04.09.16.09.2 0 .76-1.55 2.55-2.52 4.55-2.52 3.68 0 5.77 3.36 4.31 7.07-2.02 4.71-9.36 9.17-9.36 9.17z" />
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
