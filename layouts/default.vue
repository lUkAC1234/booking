<template>
    <div class="app-shell">
        <AppHeader />
        <main id="main" tabindex="-1" class="app-shell__main">
            <slot />
        </main>
        <AppFooter />
        <AppMobileMenu />
        <AppMobileBottomNav />
        <ClientOnly>
            <AppAlerts />
            <AppRouteLoader />
            <LazySocialProofToaster v-if="!prefersReducedMotion" />
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
const { prefersReducedMotion } = useBreakpoints();

useJsonLd().organization();
</script>

<style scoped lang="scss">
.app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    padding-bottom: var(--bottom-nav-height);
    background-color: var(--surface-warm);
    color: var(--text-color);

    &__main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-top: var(--app-header-height);
        position: relative;
        overflow: clip;
        scroll-margin-top: var(--app-header-height);

        &:focus {
            outline: none;
        }
    }
}
</style>
