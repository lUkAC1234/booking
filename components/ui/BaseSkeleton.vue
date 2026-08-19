<template>
    <span class="base-skeleton" :style="style" aria-hidden="true" />
</template>

<script setup lang="ts">
interface Props {
    width?: string;
    height?: string;
    radius?: string;
    circle?: boolean;
}
const props = defineProps<Props>();

const style = computed(() => {
    const s: Record<string, string> = {};
    if (props.width) s.width = props.width;
    if (props.height) s.height = props.height;
    if (props.circle) s.borderRadius = "50%";
    else if (props.radius) s.borderRadius = props.radius;
    return s;
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.base-skeleton {
    display: block;
    background-color: var(--surface-mute);
    border-radius: functions.rem(8);
    animation: base-skeleton-pulse 1400ms var(--ease-decel) infinite;

    @include bp.reduced-motion {
        animation: none;
    }
}

@keyframes base-skeleton-pulse {
    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>
