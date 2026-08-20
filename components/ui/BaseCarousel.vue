<template>
    <div class="base-carousel">
        <ul
            ref="track"
            class="base-carousel__track"
            :class="{
                'base-carousel__track--dragging': dragging,
                'base-carousel__track--settling': settling,
            }"
            role="list"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @dragstart.prevent
            @click.capture="onClickCapture"
        >
            <li v-for="item in items" :key="item.id" class="base-carousel__slide">
                <slot :item="item" />
            </li>
        </ul>

        <div class="base-carousel__controls">
            <BaseButton
                variant="icon"
                :disabled="arrivedState.left"
                :aria-label="t('common.carousel-prev')"
                @click="scrollByStep(-1)"
            >
                <SvgArrowRight class="base-carousel__arrow base-carousel__arrow--back" />
            </BaseButton>

            <BaseButton
                variant="icon"
                :disabled="arrivedState.right"
                :aria-label="t('common.carousel-next')"
                @click="scrollByStep(1)"
            >
                <SvgArrowRight />
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends { id: string }">
defineProps<{ items: T[] }>();

defineSlots<{ default(props: { item: T }): unknown }>();

const DRAG_THRESHOLD = 6;
const SETTLE_DURATION = 420;

const { t } = useI18n();
const track = ref<HTMLElement | null>(null);
const dragging = ref(false);
const settling = ref(false);
const { arrivedState } = useScroll(track, { throttle: 100 });
const { start: startSettleTimer } = useTimeoutFn(
    () => {
        settling.value = false;
    },
    SETTLE_DURATION,
    { immediate: false },
);

let pointerStartX = 0;
let scrollStart = 0;
let dragged = false;

const slideStep = (element: HTMLElement) => {
    const first = element.children[0];
    const second = element.children[1];

    return first instanceof HTMLElement && second instanceof HTMLElement
        ? second.offsetLeft - first.offsetLeft
        : element.clientWidth;
};

const scrollByStep = (direction: number) => {
    const element = track.value;
    if (!element) return;

    element.scrollBy({ left: slideStep(element) * direction });
};

const onPointerDown = (event: PointerEvent) => {
    const element = track.value;
    if (!element || event.pointerType === "touch" || event.button !== 0) return;

    dragging.value = true;
    dragged = false;
    pointerStartX = event.clientX;
    scrollStart = element.scrollLeft;
    element.setPointerCapture(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
    const element = track.value;
    if (!dragging.value || !element) return;

    const shift = event.clientX - pointerStartX;
    if (Math.abs(shift) > DRAG_THRESHOLD) dragged = true;
    element.scrollLeft = scrollStart - shift;
};

const onPointerUp = async () => {
    const element = track.value;
    if (!dragging.value || !element) return;

    dragging.value = false;
    settling.value = true;
    await nextTick();

    const step = slideStep(element);
    element.scrollTo({ left: Math.round(element.scrollLeft / step) * step });
    startSettleTimer();
};

const onClickCapture = (event: MouseEvent) => {
    if (!dragged) return;

    dragged = false;
    event.preventDefault();
    event.stopPropagation();
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.base-carousel {
    display: flex;
    flex-direction: column;
    gap: functions.rem(32);

    &__track {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: calc((100% - #{functions.rem(48)}) / 3);
        gap: functions.rem(24);
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        scrollbar-width: none;
        cursor: grab;

        &::-webkit-scrollbar {
            display: none;
        }

        &--dragging {
            cursor: grabbing;
            scroll-snap-type: none;
            scroll-behavior: auto;
            user-select: none;
        }

        &--settling {
            scroll-snap-type: none;
        }
    }

    &__slide {
        display: grid;
        scroll-snap-align: start;
    }

    &__controls {
        display: flex;
        justify-content: flex-end;
        gap: functions.rem(12);
    }

    &__arrow--back {
        transform: rotate(180deg);
    }

    @include bp.down("laptop") {
        &__track {
            grid-auto-columns: calc((100% - #{functions.rem(24)}) / 2);
        }
    }

    @include bp.down("mobile") {
        gap: functions.rem(24);

        &__track {
            grid-auto-columns: 100%;
            gap: functions.rem(16);
        }
    }

    @include bp.reduced-motion {
        &__track {
            scroll-behavior: auto;
        }
    }
}
</style>
