<template>
    <section
        ref="root"
        class="page-hero"
        :class="{ 'page-hero--photo': photo }"
        data-hero="root"
        :aria-labelledby="headingId"
    >
        <HeroMedia
            v-if="photo"
            data-hero="media"
            :desktop-src="photo.desktop"
            :mobile-src="photo.mobile"
            :alt="photo.alt"
            :width="photo.width"
            :height="photo.height"
        />

        <AppContainer size="wide" class="page-hero__inner">
            <div class="page-hero__copy">
                <AppBreadcrumbs :items="crumbs" :on-dark="Boolean(photo)" class="page-hero__crumbs" />

                <BaseHeading :id="headingId" level="h1" data-hero="title" class="page-hero__title">
                    {{ title }}
                </BaseHeading>

                <div class="page-hero__aside">
                    <p data-hero="lead" class="page-hero__lead">{{ lead }}</p>

                    <div v-if="$slots.actions" data-hero="actions" class="page-hero__actions">
                        <slot name="actions" />
                    </div>
                </div>
            </div>

            <ul v-if="chips.length" class="page-hero__facts" role="list">
                <li v-for="chip in chips" :key="chip.label" data-hero="card" class="page-hero__fact">
                    <span class="page-hero__fact-icon" aria-hidden="true">
                        <SvgIcon :name="chip.icon" />
                    </span>
                    <span class="page-hero__fact-label">{{ chip.label }}</span>
                </li>
            </ul>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { CardFact } from "~/types/models";

interface Crumb {
    label: string;
    to?: string;
}

interface HeroPhoto {
    desktop: string;
    mobile: string;
    alt: string;
    width: number;
    height: number;
}

interface Props {
    title: string;
    lead: string;
    crumbs: Crumb[];
    chips?: CardFact[];
    photo?: HeroPhoto;
}

withDefaults(defineProps<Props>(), {
    chips: () => [],
    photo: undefined,
});

const headingId = useId();
const root = ref<HTMLElement | null>(null);

useHeroIntro(root);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.page-hero {
    background-color: var(--surface-warm);
    padding-block: functions.rem(48) var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(64);
    }

    &__copy {
        display: flex;
        flex-direction: column;
        gap: functions.rem(28);
        max-width: functions.rem(880);
    }

    &__crumbs {
        margin-bottom: functions.rem(-8);
    }

    &__title {
        margin: 0;
        font-size: var(--fz-page-title);
        line-height: var(--lh-tight);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__aside {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: functions.rem(28);
    }

    &__lead {
        margin: 0;
        max-width: functions.rem(680);
        font-size: var(--fz-lead);
        line-height: var(--lh-relaxed);
        color: var(--ink-80);
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: functions.rem(16);
    }

    &__facts {
        --icon-size: var(--icon-size-lg);

        list-style: none;
        margin: 0;
        padding: functions.rem(8);
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        background-color: var(--surface);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
    }

    &__fact {
        display: flex;
        align-items: center;
        gap: functions.rem(14);
        padding: functions.rem(18) functions.rem(22);
        color: var(--ink);

        &:not(:last-child) {
            border-right: functions.rem(2) solid var(--border-color);
        }
    }

    &__fact-icon {
        display: inline-flex;
        flex-shrink: 0;
        color: var(--primary-color);
    }

    &__fact-label {
        font-size: var(--fz-body-sm);
        font-weight: var(--font-weight-medium);
        line-height: var(--lh-base);
        text-wrap: balance;
    }

    &--photo {
        @include mixins.on-dark;

        position: relative;
        isolation: isolate;
        overflow: hidden;
        margin-top: calc(-1 * var(--app-header-height));
        padding-block: 0;

        &::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 1;
            background-color: rgba(36, 30, 28, 0.56);
        }
    }

    &--photo &__inner {
        position: relative;
        z-index: 2;
        min-height: 100dvh;
        justify-content: center;
        padding-block: calc(var(--app-header-height) + #{functions.rem(72)}) functions.rem(96);
    }

    &--photo &__actions {
        --primary-color: var(--white);
    }

    &--photo &__fact-icon {
        color: var(--ink);
    }

    @include bp.up("notebook") {
        &:not(&--photo) &__copy {
            display: grid;
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
            column-gap: functions.rem(72);
            row-gap: functions.rem(32);
            align-items: start;
            max-width: none;
        }

        &:not(&--photo) &__crumbs {
            grid-column: 1 / -1;
        }

        &:not(&--photo) &__aside {
            padding-top: functions.rem(6);
        }
    }

    @include bp.down("laptop") {
        &__facts {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        &__fact {
            &:not(:last-child) {
                border-right: 0;
            }

            &:nth-child(odd) {
                border-right: functions.rem(2) solid var(--border-color);
            }

            &:nth-child(-n + 2) {
                border-bottom: functions.rem(2) solid var(--border-color);
            }
        }

        &--photo &__inner {
            gap: functions.rem(48);
            padding-block: calc(var(--app-header-height) + #{functions.rem(56)}) functions.rem(72);
        }
    }

    @include bp.down("mobile") {
        &:not(&--photo) {
            padding-block: functions.rem(32) var(--section-py);
        }

        &__copy {
            gap: functions.rem(20);
        }

        &__aside {
            align-items: stretch;
            gap: functions.rem(20);
        }

        &__actions {
            flex-direction: column;
            align-items: stretch;
        }

        &__facts {
            grid-template-columns: minmax(0, 1fr);
        }

        &__fact {
            padding: functions.rem(14) functions.rem(16);

            &:nth-child(odd) {
                border-right: 0;
            }

            &:nth-child(-n + 2) {
                border-bottom: 0;
            }

            &:not(:last-child) {
                border-bottom: functions.rem(2) solid var(--border-color);
            }
        }

        &--photo &__inner {
            gap: functions.rem(40);
            padding-block: calc(var(--app-header-height) + #{functions.rem(40)}) functions.rem(56);
        }
    }

    @include bp.short {
        &--photo &__inner {
            min-height: auto;
        }
    }
}
</style>
