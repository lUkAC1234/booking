<template>
    <Teleport to="body">
        <Transition name="app-mobile-menu">
            <div v-if="store.isOpen" id="app-mobile-menu" ref="dialogRef" class="app-mobile-menu" role="dialog" aria-modal="true" tabindex="-1" :aria-label="t('nav.menu')">
                <div class="app-mobile-menu__backdrop" @click="store.close" />
                <div class="app-mobile-menu__panel">
                    <div class="app-mobile-menu__head">
                        <span class="app-mobile-menu__brand">{{ brandName }}</span>
                        <button
                            type="button"
                            class="app-mobile-menu__close"
                            :aria-label="t('nav.close-menu')"
                            @click="store.close"
                        >
                            <SvgClose />
                        </button>
                    </div>
                    <nav class="app-mobile-menu__nav">
                        <NuxtLink
                            v-for="link in links"
                            :key="link.path"
                            :to="localePath(link.path)"
                            class="app-mobile-menu__link"
                            :class="{ 'app-mobile-menu__link--active': isActive(link.path) }"
                            :aria-current="isActive(link.path) ? 'page' : undefined"
                            @click="store.close"
                        >
                            {{ t(link.label) }}
                        </NuxtLink>
                    </nav>
                    <div class="app-mobile-menu__foot">
                        <div class="app-mobile-menu__lang">
                            <span class="app-mobile-menu__lang-label">{{ t("nav.language") }}</span>
                            <AppLangSwitcher />
                        </div>
                        <BookButton context-kind="general" fullwidth @click="store.close" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const store = useMobileMenuStore();
const dialogRef = ref<HTMLElement | null>(null);
const brandName = useAppConfig().brand?.name ?? "Brand";

useFocusTrap(dialogRef, () => store.isOpen);

const links = [HOME_LINK, ...NAV_LINKS];

const isActive = (path: string) => isNavPathActive(route.path, path, localePath(path));

const scrollLocked = useScrollLock(import.meta.client ? document.documentElement : null);
watch(
    () => store.isOpen,
    (open) => {
        scrollLocked.value = open;
    },
);

const drawerEligible = useMediaQuery("(max-width: 1279px)");
watch(drawerEligible, (eligible) => {
    if (!eligible && store.isOpen) store.close();
});

onKeyStroke("Escape", () => {
    if (store.isOpen) store.close();
});

watch(() => route.fullPath, () => store.close());

onBeforeUnmount(() => {
    scrollLocked.value = false;
});
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/functions" as functions;

.app-mobile-menu {
    --icon-size: #{functions.rem(20)};

    position: fixed;
    inset: 0;
    z-index: var(--z-modal);

    &__backdrop {
        position: absolute;
        inset: 0;
        background-color: rgba(10, 10, 15, 0.5);
    }

    &__panel {
        position: absolute;
        top: 0;
        right: 0;
        width: min(100%, functions.rem(400));
        height: 100dvh;
        background-color: var(--surface);
        display: flex;
        flex-direction: column;
        border-left: functions.rem(2) solid var(--border-color);
    }

    &__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: functions.rem(20) functions.rem(24);
        border-bottom: functions.rem(2) solid var(--border-color);
    }

    &__brand {
        font-size: functions.rem(20);
        font-weight: var(--font-weight-bold);
        letter-spacing: -0.01em;
        color: var(--ink);
    }

    &__close {
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
            background-color 220ms var(--ease-decel);

        &:hover {
            border-color: currentColor;
            background-color: var(--surface-mute);
        }
    }

    &__nav {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: functions.rem(2);
        padding: functions.rem(16) functions.rem(16);
        overflow-y: auto;
    }

    &__link {
        display: flex;
        align-items: center;
        padding: functions.rem(14) functions.rem(16);
        border-radius: functions.rem(12);
        font-size: functions.rem(18);
        font-weight: var(--font-weight-medium);
        color: var(--text-color);
        text-decoration: none;
        transition:
            background-color 240ms var(--ease-decel),
            color 240ms var(--ease-decel);

        &:not(&--active):hover,
        &:not(&--active):focus-visible {
            background-color: var(--surface-mute);
            color: var(--ink);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(2);
        }

        &--active {
            background-color: var(--brand-red);
            color: var(--white);
        }
    }

    &__foot {
        display: flex;
        flex-direction: column;
        gap: functions.rem(16);
        padding: functions.rem(20) functions.rem(24) functions.rem(24);
        border-top: functions.rem(2) solid var(--border-color);
    }

    &__lang {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(16);
    }

    &__lang-label {
        color: var(--text-color-secondary);
        font-size: functions.rem(14);
        font-weight: var(--font-weight-medium);
    }
}

.app-mobile-menu-enter-active,
.app-mobile-menu-leave-active {
    transition: opacity 360ms var(--ease-decel);
}

.app-mobile-menu-enter-active .app-mobile-menu__panel,
.app-mobile-menu-leave-active .app-mobile-menu__panel {
    transition: transform 360ms var(--ease-decel);
}

.app-mobile-menu-enter-from,
.app-mobile-menu-leave-to {
    opacity: 0;
}

.app-mobile-menu-enter-from .app-mobile-menu__panel,
.app-mobile-menu-leave-to .app-mobile-menu__panel {
    transform: translateX(100%);
}

@include bp.reduced-motion {
    .app-mobile-menu-enter-active,
    .app-mobile-menu-leave-active,
    .app-mobile-menu-enter-active .app-mobile-menu__panel,
    .app-mobile-menu-leave-active .app-mobile-menu__panel {
        transition: none;
    }
}
</style>
