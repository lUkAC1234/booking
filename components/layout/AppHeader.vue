<template>
    <header
        class="app-header"
        :class="{
            'app-header--hidden': hidden,
            'app-header--scrolled': scrolled,
            'app-header--over-hero': overHero,
        }"
    >
        <AppContainer size="wide" tag="nav" class="app-header__nav" :aria-label="t('nav.primary')">
            <NuxtLink :to="localePath('/')" class="app-header__brand">
                <span class="app-header__wordmark">{{ brandName }}</span>
            </NuxtLink>

            <ul ref="menu" class="app-header__menu" :class="{ 'app-header__menu--ready': indicatorReady }">
                <li v-for="link in links" :key="link.path">
                    <NuxtLink
                        :to="localePath(link.path)"
                        class="app-header__link"
                        :class="{ 'app-header__link--active': isActive(link.path) }"
                    >
                        {{ t(link.label) }}
                    </NuxtLink>
                </li>
            </ul>

            <div class="app-header__controls">
                <BookButton variant="primary" size="small" class="app-header__cta" />
                <button
                    type="button"
                    class="app-header__burger"
                    :aria-label="t('nav.open-menu')"
                    :aria-expanded="mobileMenu.isOpen"
                    aria-controls="app-mobile-menu"
                    @click="mobileMenu.toggle"
                >
                    <SvgBurger />
                </button>
                <AppLangSwitcher class="app-header__lang" />
            </div>
        </AppContainer>
    </header>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const mobileMenu = useMobileMenuStore();
const brandName = useAppConfig().brand?.name ?? "Brand";

const links = NAV_LINKS;

const SCROLL_THRESHOLD = 80;

const { direction, scrollY } = useScrollDirection(8);
const scrolled = computed(() => scrollY.value > SCROLL_THRESHOLD);
const hidden = computed(() => direction.value === "down" && scrolled.value);

const overHero = computed(() => route.meta.darkHeader === true && !scrolled.value);

provide("appHeaderHidden", hidden);

const isActive = (path: string) => isNavPathActive(route.path, path, localePath(path));

const menu = ref<HTMLElement | null>(null);
const indicatorReady = ref(false);

const syncIndicator = () => {
    const element = menu.value;
    if (!element?.offsetWidth) return;

    const active = element.querySelector<HTMLElement>(".app-header__link--active");

    if (active) {
        element.style.setProperty("--nav-indicator-x", `${active.offsetLeft}px`);
        element.style.setProperty("--nav-indicator-scale", `${active.offsetWidth / element.offsetWidth}`);
    } else {
        element.style.setProperty("--nav-indicator-scale", "0");
    }

    indicatorReady.value = true;
};

watch(
    () => route.path,
    () => nextTick(syncIndicator),
);

useResizeObserver(menu, syncIndicator);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.app-header {
    --icon-size: #{functions.rem(24)};

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-layout);
    background-color: transparent;
    border-bottom: functions.rem(2) solid transparent;
    transition:
        transform 400ms var(--ease-decel),
        background-color 360ms var(--ease-decel),
        border-color 360ms var(--ease-decel);

    @include bp.reduced-motion {
        transition: none;
    }

    &--scrolled {
        background-color: var(--surface);
        border-bottom-color: var(--border-color);
    }

    &--over-hero {
        --ink: var(--white);
        --ink-80: rgba(255, 255, 255, 0.88);
        --ink-60: rgba(255, 255, 255, 0.78);
        --border-color: rgba(255, 255, 255, 0.4);
        --surface-mute: rgba(255, 255, 255, 0.16);
        --primary-color: var(--white);
    }

    &--hidden {
        transform: translateY(-100%);
    }

    &__nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(32);
        min-height: var(--app-header-height);
        padding-block: functions.rem(16);

        @include bp.down("mobile") {
            gap: functions.rem(12);
        }
    }

    &__brand {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
        text-decoration: none;
        color: var(--ink);

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(4);
        }
    }

    &__wordmark {
        display: block;
        max-width: functions.rem(200);
        font-family: var(--font);
        font-size: functions.rem(20);
        font-weight: var(--font-weight-bold);
        letter-spacing: var(--ls-heading);
        line-height: 1.05;
        color: var(--ink);

        @include bp.down("mobile") {
            max-width: functions.rem(140);
            font-size: functions.rem(16);
        }
    }

    &__menu {
        position: relative;
        display: flex;
        align-items: center;
        gap: functions.rem(24);
        margin: 0;
        padding: 0;
        list-style: none;

        &::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: functions.rem(2);
            background-color: var(--primary-color);
            transform: translate3d(var(--nav-indicator-x, 0), 0, 0) scaleX(var(--nav-indicator-scale, 0));
            transform-origin: left center;
            will-change: transform;
        }

        &--ready::after {
            transition: transform var(--dur-state) var(--ease-decel);
        }

        @include bp.down("laptop") {
            display: none;
        }

        @include bp.reduced-motion {
            &::after {
                transition: none;
            }
        }
    }

    &__link {
        display: inline-block;
        padding-block: functions.rem(4);
        font-size: functions.rem(16);
        font-weight: var(--font-weight-medium);
        color: var(--ink-80);
        text-decoration: none;
        white-space: nowrap;
        transition: color var(--dur-state) var(--ease-decel);

        &:not(&--active):hover {
            color: var(--ink);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(4);
        }

        &--active {
            color: var(--primary-color);
        }

        @include bp.reduced-motion {
            transition: none;
        }
    }

    &__controls {
        display: flex;
        align-items: center;
        gap: functions.rem(12);
    }

    &__lang {
        @include bp.down("laptop") {
            display: none;
        }
    }

    &__burger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: functions.rem(44);
        height: functions.rem(44);
        padding: 0;
        border: functions.rem(2) solid var(--border-color);
        border-radius: functions.rem(999);
        background-color: transparent;
        color: var(--ink);
        cursor: pointer;
        transition:
            border-color 220ms var(--ease-decel),
            color 220ms var(--ease-decel),
            background-color 220ms var(--ease-decel);

        &:hover {
            border-color: currentColor;
            background-color: var(--surface-mute);
        }

        @include bp.down("mobile") {
            display: none;
        }

        @include bp.up("notebook") {
            display: none;
        }
    }
}
</style>
