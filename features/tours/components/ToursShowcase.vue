<template>
    <section class="tours-showcase" :class="`tours-showcase--${tone}`" :aria-labelledby="headingId">
        <AppContainer size="wide" class="tours-showcase__inner">
            <SectionHeader :heading-id="headingId" :title="title" :lead="lead">
                <template v-if="$slots.action" #action>
                    <slot name="action" />
                </template>
            </SectionHeader>

            <div v-reveal.stagger class="tours-showcase__grid">
                <OfferCard
                    v-for="item in items"
                    :key="item.id"
                    :title="item.title"
                    :description="item.summary"
                    :facts="item.facts"
                    :highlights="item.program.slice(0, TEASER_STEPS)"
                    :photo-brief="item.photoBrief"
                    :photos="item.photos"
                    photo-sizes="90vw md:46vw xxl:44vw"
                    context-kind="tour"
                    :tone="tone === 'dark' ? 'dark' : 'light'"
                />
            </div>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
const TEASER_STEPS = 3;

interface Props {
    title: string;
    lead?: string;
    tone?: "surface" | "dark";
}

withDefaults(defineProps<Props>(), {
    lead: "",
    tone: "surface",
});

defineSlots<{ action?(): unknown }>();

const { items } = useTours();
const headingId = useId();
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

.tours-showcase {
    padding-block: var(--section-py);

    &--surface {
        background-color: var(--surface);
    }

    &--dark {
        @include mixins.on-dark;
    }

    &__inner {
        display: flex;
        flex-direction: column;
        gap: functions.rem(56);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-items: stretch;
        gap: functions.rem(32);
    }

    @include bp.down("tablet") {
        &__grid {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }

        &__grid {
            gap: functions.rem(20);
        }
    }
}
</style>
