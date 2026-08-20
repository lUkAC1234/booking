<template>
    <nav class="app-bottom-nav" :aria-label="t('nav.primary')">
        <NuxtLink
            v-for="item in leadingItems"
            :key="item.path"
            :to="localePath(item.path)"
            class="app-bottom-nav__item"
            :class="{ 'app-bottom-nav__item--active': isActive(item.path) }"
            :aria-current="isActive(item.path) ? 'page' : undefined"
        >
            <span class="app-bottom-nav__icon" aria-hidden="true">
                <SvgNavHome v-if="item.icon === 'home'" />
                <SvgNavApartments v-else />
            </span>
            <span class="app-bottom-nav__label">{{ t(item.label) }}</span>
        </NuxtLink>

        <a
            :href="whatsappHref"
            class="app-bottom-nav__book"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('common.book-on-whatsapp')"
        >
            <span class="app-bottom-nav__book-chip" aria-hidden="true">
                <SvgWhatsApp />
            </span>
            <span class="app-bottom-nav__label">{{ t("common.book") }}</span>
        </a>

        <NuxtLink
            :to="localePath(TOURS_PATH)"
            class="app-bottom-nav__item"
            :class="{ 'app-bottom-nav__item--active': isActive(TOURS_PATH) }"
            :aria-current="isActive(TOURS_PATH) ? 'page' : undefined"
        >
            <span class="app-bottom-nav__icon" aria-hidden="true">
                <SvgNavTours />
            </span>
            <span class="app-bottom-nav__label">{{ t("nav.tours") }}</span>
        </NuxtLink>

        <button
            type="button"
            class="app-bottom-nav__item"
            :aria-label="t('nav.more')"
            :aria-haspopup="true"
            :aria-expanded="mobileMenu.isOpen"
            aria-controls="app-mobile-menu"
            @click="mobileMenu.open"
        >
            <span class="app-bottom-nav__icon" aria-hidden="true">
                <SvgBurger />
            </span>
            <span class="app-bottom-nav__label">{{ t("nav.more") }}</span>
        </button>
    </nav>
</template>

<script setup lang="ts">
const TOURS_PATH = "/tashkent-tours-amirsoy-chimgan/";

const leadingItems = [
    { path: HOME_LINK.path, label: HOME_LINK.label, icon: "home" },
    { path: "/tashkent-city-center-apartments/", label: "nav.apartments", icon: "apartments" },
] as const;

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const mobileMenu = useMobileMenuStore();
const { whatsappHref } = useBookingLink();

const isActive = (path: string) => isNavPathActive(route.path, path, localePath(path));
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.app-bottom-nav {
    display: none;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--z-layout);
    background-color: var(--surface);
    border-top: functions.rem(2) solid var(--border-color);
    padding: functions.rem(8) functions.rem(6) max(functions.rem(8), env(safe-area-inset-bottom));
    align-items: flex-start;

    @include bp.down("mobile") {
        display: flex;
    }

    &__item,
    &__book {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: functions.rem(4);
        padding: functions.rem(4);
        min-height: functions.rem(44);
        text-decoration: none;
        font-family: var(--font);
        font-size: functions.rem(12);
        font-weight: var(--font-weight-medium);
        line-height: 1.2;
        background-color: transparent;
        border: 0;
        cursor: pointer;
        appearance: none;
    }

    &__item {
        --icon-size: var(--icon-size-lg);

        color: var(--ink-60);
        transition: color 220ms var(--ease-decel, cubic-bezier(0.22, 1, 0.36, 1));

        &:not(&--active):hover,
        &:not(&--active):focus-visible {
            color: var(--ink);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(2);
        }

        &--active {
            color: var(--primary-color);
        }
    }

    &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: currentColor;
        width: functions.rem(36);
        height: functions.rem(36);
        border-radius: 50%;
        background-color: transparent;
        transition: background-color 220ms var(--ease-decel, cubic-bezier(0.22, 1, 0.36, 1));
    }

    &__item--active &__icon {
        background-color: var(--surface-mute);
    }

    &__book {
        --icon-size: var(--icon-size-lg);

        color: var(--ink);

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(2);
        }
    }

    &__book-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: functions.rem(56);
        height: functions.rem(56);
        margin-top: functions.rem(-20);
        border: functions.rem(4) solid var(--surface);
        border-radius: 50%;
        background-color: var(--primary-color);
        color: var(--white);
        transition: background-color 220ms var(--ease-decel, cubic-bezier(0.22, 1, 0.36, 1));
    }

    &__book:hover &__book-chip,
    &__book:focus-visible &__book-chip {
        background-color: var(--light-primary-color);
    }

    &__label {
        display: block;
        letter-spacing: 0;
        text-align: center;
    }

    @include bp.reduced-motion {
        .app-bottom-nav__item,
        .app-bottom-nav__icon,
        .app-bottom-nav__book-chip {
            transition: none;
        }
    }
}
</style>
