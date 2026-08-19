<template>
    <nav
        class="app-breadcrumbs"
        :class="{
            'app-breadcrumbs--on-dark': onDark,
            'app-breadcrumbs--center': center,
        }"
        :aria-label="resolvedLabel"
    >
        <ol class="app-breadcrumbs__list">
            <li
                v-for="(item, index) in items"
                :key="item.label"
                class="app-breadcrumbs__item"
            >
                <NuxtLink
                    v-if="item.to && index !== items.length - 1"
                    :to="localePath(item.to)"
                    class="app-breadcrumbs__link"
                >
                    {{ item.label }}
                </NuxtLink>
                <span
                    v-else
                    class="app-breadcrumbs__current"
                    :aria-current="index === items.length - 1 ? 'page' : undefined"
                >
                    {{ item.label }}
                </span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
    label: string;
    to?: string;
}

interface Props {
    items: BreadcrumbItem[];
    onDark?: boolean;
    center?: boolean;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    onDark: false,
    center: false,
    ariaLabel: "",
});

const { t } = useI18n();
const localePath = useLocalePath();

const resolvedLabel = computed(() => props.ariaLabel || t("common.breadcrumb"));
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;

.app-breadcrumbs {
    --crumb-color: var(--ink-60);
    --crumb-color-hover: var(--primary-color);
    --crumb-current: var(--ink);
    --crumb-sep: var(--ink-40);

    &--on-dark {
        --crumb-color: rgba(255, 255, 255, 0.62);
        --crumb-color-hover: var(--white);
        --crumb-current: var(--white);
        --crumb-sep: rgba(255, 255, 255, 0.32);
    }

    &__list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: functions.rem(6) 0;
        font-size: functions.rem(14);
        font-weight: var(--font-weight-medium);
        line-height: 1.2;
    }

    &--center &__list {
        justify-content: center;
        text-align: center;
    }

    &__item {
        display: inline-flex;
        align-items: center;
        min-width: 0;

        &:not(:first-child)::before {
            content: "/";
            margin-inline: functions.rem(10);
            color: var(--crumb-sep);
            font-weight: var(--font-weight-regular);
        }
    }

    &__link {
        color: var(--crumb-color);
        text-decoration: none;
        transition: color 200ms var(--ease-decel);

        &:hover,
        &:focus-visible {
            color: var(--crumb-color-hover);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--crumb-color-hover);
            outline-offset: functions.rem(2);
        }
    }

    &__current {
        color: var(--crumb-current);
    }
}
</style>
