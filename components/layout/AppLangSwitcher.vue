<template>
    <BaseDropdown
        ref="dropdownRef"
        class="app-lang-switcher"
        placement="auto"
        align="auto"
        :offset="10"
    >
        <template #default="{ toggle, isOpen, panelId }">
            <button
                type="button"
                class="app-lang-switcher__trigger"
                :class="{ 'app-lang-switcher__trigger--open': isOpen }"
                :aria-label="triggerAriaLabel"
                :aria-expanded="isOpen"
                aria-haspopup="listbox"
                :aria-controls="panelId"
                @click="toggle"
            >
                <span class="app-lang-switcher__code">{{ activeCode }}</span>
                <SvgChevronDown
                    class="app-lang-switcher__caret"
                    :class="{ 'app-lang-switcher__caret--up': isOpen }"
                />
            </button>
        </template>
        <template #panel="{ close }">
            <ul class="app-lang-switcher__list" role="listbox">
                <li v-for="loc in locales" :key="loc.code">
                    <NuxtLink
                        :to="switchLocalePath(loc.code) || '/'"
                        :class="[
                            'app-lang-switcher__option',
                            { 'app-lang-switcher__option--active': loc.code === currentLocale },
                        ]"
                        role="option"
                        :aria-selected="loc.code === currentLocale"
                        @click="close"
                    >
                        <span class="app-lang-switcher__option-name">{{ loc.name }}</span>
                        <span class="app-lang-switcher__option-code">{{ loc.code.toUpperCase() }}</span>
                    </NuxtLink>
                </li>
            </ul>
        </template>
    </BaseDropdown>
</template>

<script setup lang="ts">
import type { ComputedRef } from "vue";

const LOCALE_CODES = ["en", "ru"] as const;

type LocaleCode = (typeof LOCALE_CODES)[number];

const isLocaleCode = (value: string): value is LocaleCode =>
    LOCALE_CODES.some((code) => code === value);

interface DropdownExposed {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: boolean;
}

const { t, locale, locales: i18nLocales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const currentLocale = computed(() => locale.value);
const locales = computed(() => {
    const entries: Array<string | { code: string; name?: string }> = i18nLocales.value;
    return entries
        .map((entry) =>
            typeof entry === "string"
                ? { code: entry, name: entry.toUpperCase() }
                : { code: entry.code, name: entry.name ?? entry.code.toUpperCase() },
        )
        .filter((entry): entry is { code: LocaleCode; name: string } => isLocaleCode(entry.code));
});

const activeCode = computed(() => currentLocale.value.toUpperCase());
const activeLabel = computed(() => {
    const found = locales.value.find((l) => l.code === currentLocale.value);
    return found?.name ?? currentLocale.value.toUpperCase();
});
const triggerAriaLabel = computed(() => `${t("nav.language")}: ${activeLabel.value}`);

const headerHidden = inject<ComputedRef<boolean> | null>("appHeaderHidden", null);
const dropdownRef = ref<DropdownExposed | null>(null);
const wasOpenBeforeHide = ref(false);

if (headerHidden) {
    watch(headerHidden, (isHidden, wasHidden) => {
        const dd = dropdownRef.value;
        if (!dd) return;
        if (isHidden && !wasHidden) {
            if (dd.isOpen) {
                wasOpenBeforeHide.value = true;
                dd.close();
            }
        } else if (!isHidden && wasHidden && wasOpenBeforeHide.value) {
            wasOpenBeforeHide.value = false;
            dd.open();
        }
    });
}
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;

.app-lang-switcher {
    --icon-size: #{functions.rem(14)};

    &__trigger {
        display: inline-flex;
        align-items: center;
        gap: functions.rem(6);
        min-height: var(--control-height-sm);
        padding: functions.rem(10) functions.rem(18);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--pill-radius);
        background-color: transparent;
        color: var(--ink);
        font-family: var(--font);
        font-size: functions.rem(14);
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.02em;
        line-height: 1;
        cursor: pointer;
        transition:
            border-color 220ms var(--ease-decel),
            background-color 220ms var(--ease-decel);

        &:hover {
            border-color: currentColor;
            background-color: var(--surface-mute);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(2);
        }

        &--open {
            border-color: currentColor;
            background-color: var(--surface-mute);
        }
    }

    &__code {
        font-weight: var(--font-weight-bold);
        letter-spacing: 0.06em;
    }

    &__caret {
        transition: transform 220ms var(--ease-decel);

        &--up {
            transform: rotate(180deg);
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: functions.rem(2);
        margin: 0;
        padding: 0;
        list-style: none;
        min-width: functions.rem(192);
    }

    &__option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(16);
        padding: functions.rem(10) functions.rem(14);
        border-radius: functions.rem(8);
        text-decoration: none;
        color: var(--text-color);
        font-size: functions.rem(14);
        font-weight: var(--font-weight-medium);
        line-height: 1.2;
        transition:
            background-color 200ms var(--ease-decel),
            color 200ms var(--ease-decel);

        &:hover:not(&--active) {
            background-color: var(--surface-mute);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(-2);
        }

        &--active {
            background-color: var(--surface-warm);
            color: var(--primary-color);
            font-weight: var(--font-weight-bold);
            cursor: default;
        }
    }

    &__option-name {
        flex: 1;
    }

    &__option-code {
        font-size: functions.rem(12);
        font-weight: var(--font-weight-bold);
        letter-spacing: 0.06em;
        color: var(--text-color-secondary);
    }

    &__option--active &__option-code {
        color: var(--primary-color);
    }
}
</style>
