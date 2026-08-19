<template>
    <section ref="root" class="home-hero" data-hero="root" :aria-labelledby="headingId">
        <AppContainer size="wide" class="home-hero__inner">
            <div class="home-hero__copy">
                <BaseHeading :id="headingId" level="h1" data-hero="title" class="home-hero__title">
                    {{ t("home.hero.title") }}
                </BaseHeading>

                <p data-hero="lead" class="home-hero__lead">{{ t("home.hero.lead") }}</p>

                <div data-hero="actions" class="home-hero__actions">
                    <BookButton />
                    <BaseButton
                        :to="'/tashkent-city-center-apartments/'"
                        variant="outline-light"
                    >
                        {{ t("home.hero.cta-secondary") }}
                    </BaseButton>
                </div>

                <ul class="home-hero__chips" role="list">
                    <li v-for="chip in chips" :key="chip.key" data-hero="card">
                        <FactChip>
                            <template #icon>
                                <component :is="chip.icon" />
                            </template>
                            {{ chip.label }}
                        </FactChip>
                    </li>
                </ul>
            </div>

            <div class="home-hero__media">
                <MediaPlaceholder
                    data-hero="media"
                    :brief="t('home.hero.photo')"
                    ratio="4 / 5"
                />
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import { markRaw } from "vue";
import SvgBuilding from "~/components/svg/SvgBuilding.vue";
import SvgMountain from "~/components/svg/SvgMountain.vue";
import SvgPlane from "~/components/svg/SvgPlane.vue";
import SvgClock from "~/components/svg/SvgClock.vue";

const { t } = useI18n();
const headingId = useId();
const root = ref<HTMLElement | null>(null);

useHeroIntro(root);

const chips = computed(() => [
    { key: "apartments", label: t("home.hero.chips.apartments"), icon: markRaw(SvgBuilding) },
    { key: "tours", label: t("home.hero.chips.tours"), icon: markRaw(SvgMountain) },
    { key: "transfer", label: t("home.hero.chips.transfer"), icon: markRaw(SvgPlane) },
    { key: "reply", label: t("home.hero.chips.reply"), icon: markRaw(SvgClock) },
]);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.home-hero {
    background-color: var(--surface-warm);
    padding-block: functions.rem(80) var(--section-py);

    &__inner {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
        gap: functions.rem(72);
        align-items: center;
    }

    &__copy {
        display: flex;
        flex-direction: column;
        gap: functions.rem(32);
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
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: functions.rem(16);
    }

    &__chips {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(10);
    }

    &__media {
        position: relative;
        overflow: hidden;
        border-radius: var(--outer-radius);
    }

    @include bp.down("laptop") {
        &__inner {
            grid-template-columns: 1fr;
            gap: functions.rem(48);
        }

        &__media {
            max-width: functions.rem(560);
        }
    }

    @include bp.down("mobile") {
        padding-block: functions.rem(48) var(--section-py);

        &__inner {
            gap: functions.rem(32);
        }

        &__copy {
            gap: functions.rem(24);
        }

        &__actions {
            flex-direction: column;
            align-items: stretch;
        }
    }
}
</style>
