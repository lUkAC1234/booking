<template>
    <section ref="root" class="home-hero" data-hero="root" :aria-labelledby="headingId">
        <HeroMedia
            data-hero="media"
            :desktop-src="DESKTOP_SRC"
            :mobile-src="MOBILE_SRC"
            :alt="t('home.hero.photo')"
            :width="PHOTO_WIDTH"
            :height="PHOTO_HEIGHT"
        />

        <AppContainer size="wide" class="home-hero__inner">
            <div class="home-hero__copy">
                <BaseHeading :id="headingId" level="h1" data-hero="title" class="home-hero__title">
                    {{ t("home.hero.title") }}
                </BaseHeading>

                <p data-hero="lead" class="home-hero__lead">{{ t("home.hero.lead") }}</p>

                <div data-hero="actions" class="home-hero__actions">
                    <BookButton />
                    <BaseButton :to="'/tashkent-city-center-apartments/'" variant="outline-dark">
                        {{ t("home.hero.cta-secondary") }}
                    </BaseButton>
                </div>
            </div>

            <ul class="home-hero__facts" role="list">
                <li v-for="fact in facts" :key="fact.key" data-hero="card" class="home-hero__fact">
                    <SvgIcon :name="fact.icon" />
                    <span class="home-hero__fact-label">{{ fact.label }}</span>
                </li>
            </ul>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { IconName } from "~/types/models";

interface HeroFact {
    key: string;
    label: string;
    icon: IconName;
}

const DESKTOP_SRC = "/images/heroImage.png";
const MOBILE_SRC = "/images/heroImageMobile.png";
const PHOTO_WIDTH = 1672;
const PHOTO_HEIGHT = 941;

const { t } = useI18n();
const headingId = useId();
const root = ref<HTMLElement | null>(null);

useHeroIntro(root);

const facts = computed<HeroFact[]>(() => [
    { key: "apartments", label: t("home.hero.chips.apartments"), icon: "building" },
    { key: "tours", label: t("home.hero.chips.tours"), icon: "mountain" },
    { key: "transfer", label: t("home.hero.chips.transfer"), icon: "plane" },
    { key: "reply", label: t("home.hero.chips.reply"), icon: "clock" },
]);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.home-hero {
    @include mixins.on-dark;

    position: relative;
    isolation: isolate;
    overflow: hidden;
    margin-top: calc(-1 * var(--app-header-height));

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background-color: rgba(36, 30, 28, 0.56);
    }

    &__inner {
        position: relative;
        z-index: 2;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: functions.rem(64);
        padding-block: calc(var(--app-header-height) + #{functions.rem(72)}) functions.rem(96);
    }

    &__copy {
        display: flex;
        flex-direction: column;
        gap: functions.rem(32);
        max-width: functions.rem(880);
    }

    &__title {
        margin: 0;
        font-size: var(--fz-hero);
        line-height: var(--lh-hero);
        letter-spacing: var(--ls-hero);
        color: var(--ink);
    }

    &__lead {
        margin: 0;
        max-width: functions.rem(620);
        font-size: var(--fz-lead);
        line-height: var(--lh-relaxed);
        color: var(--ink-80);
    }

    &__actions {
        --primary-color: var(--white);

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
        background-color: rgba(255, 255, 255, 0.08);
        border: functions.rem(2) solid rgba(255, 255, 255, 0.18);
        border-radius: var(--outer-radius);
    }

    &__fact {
        display: flex;
        align-items: center;
        gap: functions.rem(14);
        padding: functions.rem(18) functions.rem(22);
        color: var(--ink);

        &:not(:last-child) {
            border-right: functions.rem(2) solid rgba(255, 255, 255, 0.14);
        }
    }

    &__fact-label {
        font-size: var(--fz-body-sm);
        font-weight: var(--font-weight-medium);
        line-height: var(--lh-base);
        text-wrap: balance;
    }

    @include bp.down("laptop") {
        &__inner {
            gap: functions.rem(48);
            padding-block: calc(var(--app-header-height) + #{functions.rem(56)}) functions.rem(72);
        }

        &__facts {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        &__fact {
            &:not(:last-child) {
                border-right: 0;
            }

            &:nth-child(odd) {
                border-right: functions.rem(2) solid rgba(255, 255, 255, 0.14);
            }

            &:nth-child(-n + 2) {
                border-bottom: functions.rem(2) solid rgba(255, 255, 255, 0.14);
            }
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
            padding-block: calc(var(--app-header-height) + #{functions.rem(40)}) functions.rem(56);
        }

        &__copy {
            gap: functions.rem(24);
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
                border-bottom: functions.rem(2) solid rgba(255, 255, 255, 0.14);
            }
        }
    }

    @include bp.short {
        &__inner {
            min-height: auto;
        }
    }
}
</style>
