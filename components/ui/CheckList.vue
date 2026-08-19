<template>
    <ul v-reveal.stagger class="check-list" role="list">
        <li v-for="item in items" :key="item" class="check-list__item">
            <span class="check-list__marker" aria-hidden="true">
                <SvgCheck />
            </span>
            {{ item }}
        </li>
    </ul>
</template>

<script setup lang="ts">
interface Props {
    items: string[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;

.check-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: functions.rem(14);

    &__item {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: flex-start;
        gap: functions.rem(12);
        font-size: var(--fz-body);
        line-height: var(--lh-relaxed);
        color: var(--ink-80);
    }

    &__marker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(24);
        height: functions.rem(24);
        margin-top: functions.rem(2);
        border-radius: 50%;
        background-color: var(--primary-color);
        color: var(--white);
    }
}
</style>
