<template>
    <div class="base-carousel">
        <div ref="viewport" class="base-carousel__viewport" @focusin="onFocusIn">
            <ul
                ref="track"
                class="base-carousel__track"
                :class="{ 'base-carousel__track--dragging': dragging }"
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
        </div>

        <div class="base-carousel__controls">
            <BaseButton
                variant="icon"
                :disabled="index === 0"
                :aria-label="t('common.carousel-prev')"
                @click="goTo(index - 1)"
            >
                <SvgArrowRight class="base-carousel__arrow base-carousel__arrow--back" />
            </BaseButton>

            <BaseButton
                variant="icon"
                :disabled="index >= snaps.length - 1"
                :aria-label="t('common.carousel-next')"
                @click="goTo(index + 1)"
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
const FLICK_DURATION = 320;
const FLICK_DISTANCE = 8;
const EDGE_RESISTANCE = 0.82;

const { t } = useI18n();
const viewport = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const dragging = ref(false);
const index = ref(0);
const snaps = shallowRef<number[]>([0]);

let slideStarts: number[] = [0];
let tracking = false;
let dragged = false;
let pointerId = -1;
let startX = 0;
let startY = 0;
let startTime = 0;
let startOffset = 0;

const slidesOf = (element: HTMLElement) =>
    Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement);

const applyOffset = (offset: number, animated: boolean) => {
    const element = track.value;
    if (!element) return;

    element.style.transitionDuration = animated ? "" : "0ms";
    element.style.transform = `translate3d(${-offset}px, 0, 0)`;
};

const readOffset = (element: HTMLElement) => {
    const matrix = getComputedStyle(element).transform;
    return matrix === "none" ? 0 : -new DOMMatrixReadOnly(matrix).m41;
};

const resist = (offset: number) => {
    const limit = snaps.value[snaps.value.length - 1];
    if (offset < 0) return -((-offset) ** EDGE_RESISTANCE);
    if (offset > limit) return limit + (offset - limit) ** EDGE_RESISTANCE;
    return offset;
};

const nearestIndex = (offset: number) => {
    let best = 0;
    for (const [position, snap] of snaps.value.entries()) {
        if (Math.abs(snap - offset) < Math.abs(snaps.value[best] - offset)) best = position;
    }
    return best;
};

const goTo = (target: number) => {
    const next = Math.min(Math.max(target, 0), snaps.value.length - 1);

    index.value = next;
    applyOffset(snaps.value[next], true);
};

const measure = () => {
    const element = track.value;
    const frame = viewport.value;
    if (!element || !frame) return;

    const slides = slidesOf(element);
    const last = slides[slides.length - 1];
    if (!last) return;

    const base = slides[0].offsetLeft;
    const limit = Math.max(0, last.offsetLeft + last.offsetWidth - base - frame.clientWidth);
    const positions: number[] = [];

    slideStarts = slides.map((slide) => slide.offsetLeft - base);

    for (const start of slideStarts) {
        const value = Math.min(start, limit);
        if (!positions.length || value - positions[positions.length - 1] > 1) positions.push(value);
    }

    snaps.value = positions;
    index.value = Math.min(index.value, positions.length - 1);
    applyOffset(positions[index.value], false);
};

const onPointerDown = (event: PointerEvent) => {
    const element = track.value;
    if (!element || event.button !== 0 || snaps.value.length < 2) return;

    tracking = true;
    dragged = false;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startTime = event.timeStamp;
    startOffset = readOffset(element);
    applyOffset(startOffset, false);
};

const onPointerMove = (event: PointerEvent) => {
    const element = track.value;
    if (!tracking || !element || event.pointerId !== pointerId) return;

    const shift = event.clientX - startX;

    if (!dragged) {
        if (Math.abs(shift) < DRAG_THRESHOLD) return;
        if (Math.abs(shift) <= Math.abs(event.clientY - startY)) {
            tracking = false;
            return;
        }

        dragged = true;
        dragging.value = true;
        startX = event.clientX;
        startTime = event.timeStamp;
        element.setPointerCapture(pointerId);
        return;
    }

    applyOffset(resist(startOffset - shift), false);
};

const onPointerUp = (event: PointerEvent) => {
    const element = track.value;
    if (!tracking || event.pointerId !== pointerId) return;

    tracking = false;
    if (!dragged) return;

    dragging.value = false;
    if (element?.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);

    const shift = event.clientX - startX;
    const flicked = event.timeStamp - startTime < FLICK_DURATION && Math.abs(shift) > FLICK_DISTANCE;

    goTo(flicked ? index.value - Math.sign(shift) : nearestIndex(startOffset - shift));
};

const onClickCapture = (event: MouseEvent) => {
    if (!dragged) return;

    dragged = false;
    event.preventDefault();
    event.stopPropagation();
};

const onFocusIn = (event: FocusEvent) => {
    const element = track.value;
    const frame = viewport.value;
    if (!element || !frame || !(event.target instanceof Element)) return;

    frame.scrollLeft = 0;

    const slide = event.target.closest(".base-carousel__slide");
    if (!(slide instanceof HTMLElement)) return;

    const position = slidesOf(element).indexOf(slide);
    if (position < 0) return;

    const start = slideStarts[position];
    const current = snaps.value[index.value];
    if (start >= current && start + slide.offsetWidth <= current + frame.clientWidth + 1) return;

    goTo(position);
};

useResizeObserver(viewport, measure);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;

.base-carousel {
    --carousel-speed: var(--dur-drawer);

    display: flex;
    flex-direction: column;
    gap: functions.rem(32);

    &__viewport {
        overflow: hidden;
        overflow: clip;
    }

    &__track {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: calc((100% - #{functions.rem(48)}) / 3);
        gap: functions.rem(24);
        transform: translate3d(0, 0, 0);
        transition: transform var(--carousel-speed) var(--ease-decel);
        touch-action: pan-y pinch-zoom;
        cursor: grab;

        &--dragging {
            cursor: grabbing;
            user-select: none;
        }
    }

    &__slide {
        display: grid;
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
        --carousel-speed: 0ms;
    }
}
</style>
