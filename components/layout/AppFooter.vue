<template>
    <footer class="app-footer">
        <AppContainer v-reveal.stagger size="wide" class="app-footer__top">
            <div class="app-footer__col app-footer__col--brand">
                <NuxtLink :to="localePath('/')" class="app-footer__wordmark">
                    {{ brandName }}
                </NuxtLink>
                <p class="app-footer__pitch">{{ t("footer.pitch") }}</p>
            </div>

            <nav class="app-footer__col" :aria-label="t('footer.pages-title')">
                <p class="app-footer__col-title">{{ t("footer.pages-title") }}</p>
                <ul class="app-footer__links" role="list">
                    <li v-for="link in links" :key="link.path">
                        <NuxtLink :to="localePath(link.path)" class="app-footer__link">
                            {{ t(link.label) }}
                        </NuxtLink>
                    </li>
                </ul>
            </nav>

            <div class="app-footer__col">
                <p class="app-footer__col-title">{{ t("footer.contacts-title") }}</p>
                <ul class="app-footer__contacts" role="list">
                    <li>
                        <a
                            :href="whatsappHref"
                            class="app-footer__contact-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span class="app-footer__contact-link-value">WhatsApp</span>
                            <span class="app-footer__contact-link-chip" aria-hidden="true">
                                <SvgArrowUpRight />
                            </span>
                        </a>
                    </li>
                    <li>
                        <a
                            :href="telegramHref"
                            class="app-footer__contact-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span class="app-footer__contact-link-value">Telegram</span>
                            <span class="app-footer__contact-link-chip" aria-hidden="true">
                                <SvgArrowUpRight />
                            </span>
                        </a>
                    </li>
                </ul>
                <p class="app-footer__meta">{{ t("footer.location") }}</p>
                <p class="app-footer__meta">{{ t("footer.hours") }}</p>
            </div>

            <div class="app-footer__col app-footer__col--cta">
                <p class="app-footer__col-title">{{ t("footer.cta-title") }}</p>
                <p class="app-footer__meta">{{ t("footer.cta-line") }}</p>
                <BookButton variant="outline-dark" />
            </div>
        </AppContainer>

        <AppContainer size="wide" class="app-footer__bottom">
            <small class="app-footer__rights">
                © {{ year }} {{ brandName }}. {{ t("footer.rights") }}.
            </small>
            <AppLangSwitcher />
        </AppContainer>
    </footer>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const brandName = useAppConfig().brand.name;
const { whatsappHref, telegramHref } = useBookingLink();

const links = [HOME_LINK, ...NAV_LINKS];
const year = new Date().getFullYear();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.app-footer {
    --icon-size: #{functions.rem(20)};

    position: relative;
    margin-top: auto;
    padding-block: functions.rem(96) functions.rem(28);
    @include mixins.on-dark;

    overflow: hidden;

    @include bp.down("mobile") {
        padding-block: functions.rem(64) functions.rem(48);
    }

    &__top {
        display: grid;
        grid-template-columns: 1.6fr 1fr 1fr 1fr;
        gap: functions.rem(56);
        padding-bottom: functions.rem(56);

        @include bp.down("laptop") {
            grid-template-columns: 1fr 1fr;
            gap: functions.rem(40);
        }

        @include bp.down("mobile") {
            grid-template-columns: 1fr;
            gap: functions.rem(32);
            padding-bottom: functions.rem(40);
        }
    }

    &__col {
        display: flex;
        flex-direction: column;
        gap: functions.rem(16);
    }

    &__col--brand {
        gap: functions.rem(20);

        @include bp.down("laptop") {
            grid-column: 1 / -1;
        }
    }

    &__col--cta {
        gap: functions.rem(12);

        align-items: flex-start;
    }

    &__wordmark {
        font-family: var(--font);
        font-size: functions.rem(40);
        font-weight: var(--font-weight-bold);
        line-height: 1.02;
        letter-spacing: -0.03em;
        color: var(--white);
        text-decoration: none;
        max-width: functions.rem(360);

        &:focus-visible {
            outline: functions.rem(2) solid var(--white);
            outline-offset: functions.rem(4);
        }

        @include bp.down("mobile") {
            font-size: functions.rem(32);
        }
    }

    &__pitch {
        margin: 0;
        max-width: functions.rem(420);
        font-size: functions.rem(16);
        line-height: 1.6;
        color: var(--ink-80);
    }

    &__col-title {
        margin: 0;
        font-size: functions.rem(12);
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ink-60);
    }

    &__links,
    &__contacts {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: functions.rem(10);
    }

    &__link {
        color: var(--ink-80);
        text-decoration: none;
        font-size: functions.rem(16);
        line-height: 1.4;
        transition: color 220ms var(--ease-decel, cubic-bezier(0.22, 1, 0.36, 1));

        &:hover,
        &:focus-visible {
            color: var(--white);
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--white);
            outline-offset: functions.rem(2);
        }
    }

    &__contact-link {
        --icon-size: #{functions.rem(14)};

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(12);
        padding: functions.rem(8) 0;
        color: var(--white);
        text-decoration: none;
        font-size: functions.rem(18);
        font-weight: var(--font-weight-medium);
        line-height: var(--lh-snug);
        letter-spacing: -0.005em;
        border-bottom: functions.rem(2) solid var(--hr-border-color);
        transition: color 220ms var(--ease-decel, cubic-bezier(0.22, 1, 0.36, 1));

        &:hover,
        &:focus-visible {
            color: var(--light-primary-color);

            .app-footer__contact-link-chip {
                background-color: var(--brand-red);
                color: var(--white);
                transform: translate(#{functions.rem(2)}, #{functions.rem(-2)});
            }
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--white);
            outline-offset: functions.rem(2);
        }
    }

    &__contact-link-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(28);
        height: functions.rem(28);
        background-color: var(--surface-mute);
        color: var(--ink-60);
        border-radius: 50%;
        transition:
            transform 220ms var(--ease-decel, cubic-bezier(0.22, 1, 0.36, 1)),
            background-color 220ms var(--ease-decel, cubic-bezier(0.22, 1, 0.36, 1)),
            color 220ms var(--ease-decel, cubic-bezier(0.22, 1, 0.36, 1));
    }

    &__meta {
        margin: 0;
        font-size: functions.rem(14);
        line-height: 1.5;
        color: var(--ink-60);
    }

    &__bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: functions.rem(24);
        padding-top: functions.rem(20);
        border-top: functions.rem(2) solid var(--hr-border-color);

        @include bp.down("mobile") {
            flex-direction: column;
            align-items: flex-start;
            gap: functions.rem(16);
            padding-top: functions.rem(24);
        }
    }

    &__rights {
        color: var(--ink-60);
        font-size: functions.rem(14);
    }

    @include bp.reduced-motion {
        .app-footer__link,
        .app-footer__contact-link,
        .app-footer__contact-link-chip {
            transition: none;
        }
    }
}
</style>
