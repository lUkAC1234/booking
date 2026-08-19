<template>
    <section
        ref="root"
        class="page-hero"
        :class="{ 'page-hero--with-media': photoBrief }"
        data-hero="root"
        :aria-labelledby="headingId"
    >
        <AppContainer size="wide" class="page-hero__inner">
            <div class="page-hero__copy">
                <AppBreadcrumbs :items="crumbs" class="page-hero__crumbs" />

                <BaseHeading :id="headingId" level="h1" data-hero="title" class="page-hero__title">
                    {{ title }}
                </BaseHeading>

                <p data-hero="lead" class="page-hero__lead">{{ lead }}</p>

                <div v-if="$slots.actions" data-hero="actions" class="page-hero__actions">
                    <slot name="actions" />
                </div>

                <ul v-if="chips.length" class="page-hero__chips" role="list">
                    <li v-for="chip in chips" :key="chip" data-hero="card">
                        <FactChip>{{ chip }}</FactChip>
                    </li>
                </ul>
            </div>

            <div v-if="photoBrief" class="page-hero__media">
                <MediaPlaceholder data-hero="media" :brief="photoBrief" :ratio="photoRatio" />
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
interface Crumb {
    label: string;
    to?: string;
}

interface Props {
    title: string;
    lead: string;
    crumbs: Crumb[];
    chips?: string[];
    photoBrief?: string;
    photoRatio?: string;
}

withDefaults(defineProps<Props>(), {
    chips: () => [],
    photoBrief: "",
    photoRatio: "4 / 3",
});

const headingId = useId();
const root = ref<HTMLElement | null>(null);

useHeroIntro(root);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.page-hero {
    background-color: var(--surface-warm);
    padding-block: functions.rem(48) var(--section-py);

    &__inner {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: functions.rem(64);
        align-items: center;
    }

    &--with-media &__inner {
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
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
        &--with-media &__inner {
            grid-template-columns: 1fr;
            gap: functions.rem(40);
        }

        &__media {
            max-width: functions.rem(560);
        }
    }

    @include bp.down("mobile") {
        padding-block: functions.rem(32) var(--section-py);

        &__copy {
            gap: functions.rem(20);
        }

        &__actions {
            flex-direction: column;
            align-items: stretch;
        }
    }
}
</style>
