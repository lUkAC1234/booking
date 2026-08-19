<template>
    <div ref="root" class="stat-band" :class="`stat-band--${tone}`">
        <dl v-reveal.stagger class="stat-band__grid">
            <div v-for="stat in stats" :key="stat.id" class="stat-band__item">
                <dt class="stat-band__label">{{ stat.label }}</dt>
                <dd class="stat-band__value">
                    <span
                        class="stat-band__number"
                        :data-counter-target="stat.value"
                        :data-counter-suffix="stat.suffix ?? ''"
                    >
                        {{ stat.value }}{{ stat.suffix ?? "" }}
                    </span>
                </dd>
            </div>
        </dl>
    </div>
</template>

<script setup lang="ts">
export interface StatBandItem {
    id: string;
    label: string;
    value: number;
    suffix?: string;
}

interface Props {
    stats: StatBandItem[];
    tone?: "light" | "dark";
}

withDefaults(defineProps<Props>(), { tone: "dark" });

const root = ref<HTMLElement | null>(null);

useStatsCounter(root, ".stat-band__number");
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.stat-band {
    padding: functions.rem(56) functions.rem(40);
    border-radius: var(--outer-radius);

    &--dark {
        @include mixins.on-dark;
    }

    &--light {
        background-color: var(--surface-mute);
        color: var(--ink);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: functions.rem(40);
        margin: 0;
    }

    &__item {
        display: flex;
        flex-direction: column-reverse;
        gap: functions.rem(10);
    }

    &__value {
        margin: 0;
    }

    &__number {
        display: block;
        font-size: clamp(#{functions.rem(40)}, 4vw, #{functions.rem(64)});
        font-weight: var(--font-weight-bold);
        line-height: 1;
        letter-spacing: var(--ls-display);
        font-variant-numeric: tabular-nums;
        color: var(--text-color);
    }

    &__label {
        font-size: var(--fz-body-sm);
        line-height: var(--lh-base);
        color: var(--ink-60);
    }

    @include bp.down("laptop") {
        padding: functions.rem(40) functions.rem(28);

        &__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: functions.rem(32);
        }
    }

    @include bp.down("mobile") {
        padding: functions.rem(32) functions.rem(20);

        &__grid {
            gap: functions.rem(24);
        }
    }
}
</style>
