<template>
    <Teleport to="body">
        <div class="app-alerts" aria-live="polite">
            <TransitionGroup name="app-alerts">
                <div
                    v-for="alert in alerts.items"
                    :key="alert.id"
                    :class="['app-alerts__item', `app-alerts__item--${alert.type}`]"
                    role="status"
                >
                    <span class="app-alerts__message">{{ alert.message }}</span>
                    <button type="button" class="app-alerts__close" :aria-label="t('alert.dismiss')" @click="alerts.dismiss(alert.id)">×</button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
const { t } = useI18n();
const alerts = useAlertsStore();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.app-alerts {
    position: fixed;
    right: functions.rem(24);
    bottom: functions.rem(24);
    z-index: var(--z-toast);
    display: flex;
    flex-direction: column;
    gap: functions.rem(12);
    pointer-events: none;

    @include bp.down("mobile") {
        right: functions.rem(12);
        left: functions.rem(12);
        bottom: functions.rem(96);
    }

    &__item {
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(16);
        padding: functions.rem(12) functions.rem(16);
        background-color: var(--surface);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--inner-radius);
        min-width: functions.rem(280);

        &--success {
            border-color: var(--ink);
            background-color: var(--success-background);
        }

        &--error {
            border-color: var(--error-color);
            background-color: var(--error-background);
        }
    }

    &__message {
        font-size: functions.rem(14);
        color: var(--text-color);
    }

    &__close {
        background-color: transparent;
        border: none;
        font-size: functions.rem(20);
        cursor: pointer;
        color: var(--text-color-secondary);
    }
}

.app-alerts-enter-active,
.app-alerts-leave-active {
    transition:
        opacity 300ms var(--ease-decel),
        transform 300ms var(--ease-decel);

    @include bp.reduced-motion {
        transition: none;
    }
}

.app-alerts-enter-from,
.app-alerts-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>
