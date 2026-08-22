<template>
    <section class="tours-showcase" :class="`tours-showcase--${tone}`" :aria-labelledby="headingId">
        <AppContainer size="wide" class="tours-showcase__inner">
            <SectionHeader :heading-id="headingId" :title="title" :lead="lead">
                <template v-if="$slots.action" #action>
                    <slot name="action" />
                </template>
            </SectionHeader>

            <BaseCarousel v-reveal :items="items">
                <template #default="{ item }">
                    <OfferCard
                        :title="item.title"
                        :description="item.summary"
                        :facts="item.facts"
                        :highlights="item.highlights"
                        :photo-brief="item.photoBrief"
                        :photos="item.photos"
                        photo-sizes="90vw md:45vw xl:30vw xxl:28vw"
                        context-kind="tour"
                        :tone="tone === 'dark' ? 'dark' : 'light'"
                    />
                </template>
            </BaseCarousel>
        </AppContainer>
    </section>
</template>

<script setup lang="ts">
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

    @include bp.down("mobile") {
        &__inner {
            gap: functions.rem(40);
        }
    }
}
</style>
