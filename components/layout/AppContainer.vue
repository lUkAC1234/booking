<template>
    <component :is="tag" :class="['app-container', `app-container--${size}`]">
        <slot />
    </component>
</template>

<script setup lang="ts">
interface Props {
    tag?: string;
    size?: "narrow" | "default" | "wide" | "full";
}

withDefaults(defineProps<Props>(), { tag: "div", size: "default" });
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.app-container {
    width: 100%;
    margin-inline: auto;
    padding-inline: functions.rem(24);

    &--narrow {
        max-width: functions.rem(880);
    }

    &--default {
        max-width: functions.rem(1280);
    }

    &--wide {
        max-width: functions.rem(1600);
    }

    &--full {
        max-width: none;
    }

    @include bp.down("mobile") {
        padding-inline: functions.rem(16);
    }
}
</style>
