<template>
    <p class="base-lead">
        <slot />
    </p>
</template>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;

.base-lead {
    margin: 0;
    color: var(--ink-60);
    font-size: var(--fz-lead);
    line-height: var(--lh-relaxed);
    max-width: functions.rem(680);
}
</style>
