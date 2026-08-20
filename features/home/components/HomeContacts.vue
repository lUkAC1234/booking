<template>
    <section class="home-contacts" :aria-labelledby="headingId">
        <AppContainer size="wide" class="home-contacts__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('home.contacts.title')"
                :lead="t('home.contacts.lead')"
                :split="false"
            />

            <div v-reveal.stagger class="home-contacts__channels">
                <a
                    v-for="channel in channels"
                    :key="channel.key"
                    :href="channel.href"
                    class="home-contacts__channel"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span class="home-contacts__channel-icon" aria-hidden="true">
                        <SvgIcon :name="channel.icon" />
                    </span>
                    <span class="home-contacts__channel-body">
                        <span class="home-contacts__channel-name">{{ channel.name }}</span>
                        <span class="home-contacts__channel-note">{{ channel.note }}</span>
                    </span>
                    <span class="home-contacts__channel-chip" aria-hidden="true">
                        <SvgArrowUpRight />
                    </span>
                </a>
            </div>

            <ul v-reveal class="home-contacts__facts" role="list">
                <li v-for="fact in facts" :key="fact.key" class="home-contacts__fact">
                    <span class="home-contacts__fact-icon" aria-hidden="true">
                        <SvgIcon :name="fact.icon" />
                    </span>
                    {{ fact.label }}
                </li>
            </ul>

            <div v-reveal class="home-contacts__links">
                <BaseButton :to="'/contact-us/'" variant="ghost">
                    {{ t("home.contacts.contact-link") }}
                    <SvgArrowRight />
                </BaseButton>
                <BaseButton :to="'/about-us/'" variant="ghost">
                    {{ t("home.contacts.about-link") }}
                    <SvgArrowRight />
                </BaseButton>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { IconName } from "~/types/models";

interface Channel {
    key: string;
    name: string;
    note: string;
    href: string;
    icon: IconName;
}

interface Fact {
    key: string;
    label: string;
    icon: IconName;
}

const { t } = useI18n();
const { whatsappHref, telegramHref } = useBookingLink();
const headingId = useId();

const channels = computed<Channel[]>(() => [
    {
        key: "whatsapp",
        name: "WhatsApp",
        note: t("home.contacts.whatsapp-note"),
        href: whatsappHref.value,
        icon: "whatsapp",
    },
    {
        key: "telegram",
        name: "Telegram",
        note: t("home.contacts.telegram-note"),
        href: telegramHref.value,
        icon: "telegram",
    },
]);

const facts = computed<Fact[]>(() => [
    { key: "location", label: t("home.contacts.facts.location"), icon: "pin" },
    { key: "hours", label: t("home.contacts.facts.hours"), icon: "clock" },
    { key: "languages", label: t("home.contacts.facts.languages"), icon: "users" },
]);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.home-contacts {
    background-color: var(--surface);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(48);
    }

    &__channels {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: functions.rem(24);
    }

    &__channel {
        --icon-size: #{functions.rem(28)};

        display: flex;
        align-items: center;
        gap: functions.rem(20);
        padding: functions.rem(28);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface-warm);
        text-decoration: none;
        transition:
            border-color 240ms var(--ease-decel),
            background-color 240ms var(--ease-decel);

        &:hover,
        &:focus-visible {
            border-color: var(--brand-red);
            background-color: var(--surface-mute);

            .home-contacts__channel-chip {
                background-color: var(--brand-red);
                color: var(--white);
                transform: translate(#{functions.rem(2)}, #{functions.rem(-2)});
            }
        }

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(4);
        }

        @include bp.reduced-motion {
            transition: none;
        }
    }

    &__channel-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(64);
        height: functions.rem(64);
        border-radius: 50%;
        background-color: var(--brand-red);
        color: var(--white);
    }

    &__channel-body {
        display: flex;
        flex-direction: column;
        gap: functions.rem(4);
        flex: 1;
        min-width: 0;
    }

    &__channel-name {
        font-size: var(--fz-subsection-title);
        font-weight: var(--font-weight-bold);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__channel-note {
        font-size: var(--fz-body-sm);
        line-height: var(--lh-base);
        color: var(--ink-60);
    }

    &__channel-chip {
        --icon-size: var(--icon-size-sm);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(44);
        height: functions.rem(44);
        border-radius: 50%;
        background-color: var(--surface);
        color: var(--ink-60);
        transition:
            transform 240ms var(--ease-decel),
            background-color 240ms var(--ease-decel),
            color 240ms var(--ease-decel);

        @include bp.reduced-motion {
            transition: none;
        }
    }

    &__facts {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(32);
    }

    &__fact {
        --icon-size: var(--icon-size-sm);

        display: flex;
        align-items: center;
        gap: functions.rem(10);
        font-size: var(--fz-body-sm);
        color: var(--ink-60);
    }

    &__fact-icon {
        display: inline-flex;
        color: var(--brand-red);
    }

    &__links {
        display: flex;
        flex-wrap: wrap;
        gap: functions.rem(32);
    }

    @include bp.down("tablet") {
        &__inner {
            gap: functions.rem(32);
        }

        &__channels {
            grid-template-columns: 1fr;
        }
    }

    @include bp.down("mobile") {
        &__channel {
            padding: functions.rem(20);
            gap: functions.rem(16);
        }

        &__channel-icon {
            width: functions.rem(48);
            height: functions.rem(48);
        }

        &__facts {
            flex-direction: column;
            gap: functions.rem(12);
        }
    }
}
</style>
