<template>
    <section class="not-found">
        <AppContainer size="narrow" class="not-found__container">
            <div class="not-found__inner">
                <p class="not-found__code" aria-hidden="true">{{ code }}</p>
                <BaseHeading level="h1" class="not-found__title">{{ title }}</BaseHeading>
                <BaseLead v-reveal.text="{ stagger: 0.03, duration: 0.7 }" class="not-found__lead">{{ description }}</BaseLead>
                <div class="not-found__actions">
                    <BaseButton variant="primary" @click="onPrimary">
                        {{ primaryLabel }}
                    </BaseButton>
                    <BaseButton variant="outline-light" @click="onSecondary">
                        {{ secondaryLabel }}
                    </BaseButton>
                </div>

                <template v-if="showLinks">
                    <ul class="not-found__links" role="list">
                        <li v-for="link in NAV_LINKS" :key="link.path">
                            <NuxtLink :to="localePath(link.path)" class="not-found__link">
                                {{ t(link.label) }}
                            </NuxtLink>
                        </li>
                    </ul>
                    <BookButton />
                </template>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
interface Props {
    code: number | string;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
    onPrimary: () => void;
    onSecondary: () => void;
    showLinks?: boolean;
}

withDefaults(defineProps<Props>(), { showLinks: false });

const { t } = useI18n();
const localePath = useLocalePath();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.not-found {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: functions.rem(120);

    @include bp.down("laptop") {
        padding-block: functions.rem(96);
    }

    @include bp.down("mobile") {
        padding-block: functions.rem(64);
    }

    &__inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: functions.rem(24);
        animation: not-found-reveal 600ms var(--ease-decel) both;

        @include bp.down("mobile") {
            gap: functions.rem(20);
        }
    }

    &__code {
        margin: 0;
        font-size: functions.rem(160);
        font-weight: var(--font-weight-bold);
        color: var(--primary-color);
        line-height: 0.9;
        letter-spacing: -0.04em;

        @include bp.down("laptop") {
            font-size: functions.rem(128);
        }

        @include bp.down("tablet") {
            font-size: functions.rem(112);
        }

        @include bp.down("mobile") {
            font-size: functions.rem(88);
        }
    }

    &__title {
        margin-top: functions.rem(8);
    }

    &__lead {
        max-width: functions.rem(480);
    }

    &__links {
        list-style: none;
        margin: functions.rem(16) 0 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: functions.rem(12) functions.rem(28);
    }

    &__link {
        font-size: var(--fz-body-sm);
        font-weight: var(--font-weight-medium);
        color: var(--ink-60);
        text-decoration: none;
        transition: color 200ms var(--ease-decel);

        &:hover,
        &:focus-visible {
            color: var(--primary-color);
        }

        @include bp.reduced-motion {
            transition: none;
        }
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: functions.rem(12);
        margin-top: functions.rem(16);

        @include bp.down("mobile") {
            flex-direction: column;
            width: 100%;
            max-width: functions.rem(320);
            margin-top: functions.rem(8);
        }
    }
}

@keyframes not-found-reveal {
    from {
        opacity: 0;
        transform: translateY(functions.rem(24));
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@include bp.reduced-motion {
    .not-found__inner {
        animation: none;
    }
}
</style>
