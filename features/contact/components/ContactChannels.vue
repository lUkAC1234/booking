<template>
    <section class="contact-channels" :aria-labelledby="headingId">
        <AppContainer size="wide" class="contact-channels__inner">
            <SectionHeader
                :heading-id="headingId"
                :title="t('contact.channels.title')"
                :lead="t('contact.channels.lead')"
                :split="false"
            />

            <div v-reveal.stagger class="contact-channels__grid">
                <a
                    v-for="channel in channels"
                    :key="channel.id"
                    :href="channel.href"
                    class="contact-channels__card"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span class="contact-channels__icon" aria-hidden="true">
                        <SvgIcon :name="channel.icon" />
                    </span>
                    <span class="contact-channels__body">
                        <span class="contact-channels__name">{{ channel.name }}</span>
                        <span class="contact-channels__number">{{ channel.number }}</span>
                        <span class="contact-channels__note">{{ channel.note }}</span>
                    </span>
                    <span class="contact-channels__chip" aria-hidden="true">
                        <SvgArrowUpRight />
                    </span>
                </a>
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
import type { IconName } from "~/types/models";

interface Channel {
    id: string;
    name: string;
    note: string;
    number: string;
    href: string;
    icon: IconName;
}

const { t } = useI18n();
const { whatsappHref, telegramHref } = useBookingLink();
const contact = useAppConfig().contact;
const headingId = useId();

const channels = computed<Channel[]>(() => [
    {
        id: "whatsapp",
        name: t("contact.channels.items.whatsapp.name"),
        note: t("contact.channels.items.whatsapp.note"),
        number: formatPhone(contact.whatsapp),
        href: whatsappHref.value,
        icon: "whatsapp",
    },
    {
        id: "telegram",
        name: t("contact.channels.items.telegram.name"),
        note: t("contact.channels.items.telegram.note"),
        number: formatPhone(contact.telegram),
        href: telegramHref.value,
        icon: "telegram",
    },
]);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.contact-channels {
    background-color: var(--surface);
    padding-block: var(--section-py);

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(48);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: functions.rem(32);
    }

    &__card {
        --icon-size: #{functions.rem(28)};

        display: flex;
        align-items: flex-start;
        gap: functions.rem(24);
        padding: functions.rem(32);
        border: functions.rem(2) solid var(--border-color);
        border-radius: var(--outer-radius);
        background-color: var(--surface-warm);
        text-decoration: none;
        transition:
            border-color 240ms var(--ease-decel),
            background-color 240ms var(--ease-decel);

        &:hover,
        &:focus-visible {
            border-color: var(--primary-color);
            background-color: var(--surface-mute);

            .contact-channels__chip {
                background-color: var(--primary-color);
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

    &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: functions.rem(64);
        height: functions.rem(64);
        border-radius: 50%;
        background-color: var(--primary-color);
        color: var(--white);
    }

    &__body {
        display: flex;
        flex-direction: column;
        gap: functions.rem(8);
        flex: 1;
        min-width: 0;
    }

    &__name {
        font-size: var(--fz-subsection-title);
        font-weight: var(--font-weight-bold);
        letter-spacing: var(--ls-heading);
        color: var(--ink);
    }

    &__number {
        font-size: var(--fz-body);
        font-weight: var(--font-weight-medium);
        font-variant-numeric: tabular-nums;
        color: var(--primary-color);
    }

    &__note {
        font-size: var(--fz-body-sm);
        line-height: var(--lh-relaxed);
        color: var(--ink-60);
    }

    &__chip {
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

    @include bp.down("tablet") {
        &__grid {
            grid-template-columns: 1fr;
            gap: functions.rem(24);
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(32);
        }

        &__card {
            padding: functions.rem(20);
            gap: functions.rem(16);
        }

        &__icon {
            width: functions.rem(48);
            height: functions.rem(48);
        }
    }
}
</style>
