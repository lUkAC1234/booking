<template>
    <ul v-reveal.stagger class="check-list" :class="{ 'check-list--columns': columns }" role="list">
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
    columns?: boolean;
}

withDefaults(defineProps<Props>(), { columns: false });
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.check-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: functions.rem(14);

    &--columns {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: functions.rem(16) functions.rem(40);

        @include bp.down("laptop") {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: functions.rem(14) functions.rem(32);
        }

        @include bp.down("mobile") {
            grid-template-columns: minmax(0, 1fr);
        }
    }

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
