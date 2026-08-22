<template>
    <div
        class="base-carousel"
        :class="{ 'base-carousel--single': single, 'base-carousel--measured': measured }"
    >
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
                <li
                    v-for="(item, position) in items"
                    :key="item.id"
                    class="base-carousel__slide"
                    :class="{ 'base-carousel__slide--off': offView[position] }"
                >
                    <slot :item="item" :index="position" />
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
const props = withDefaults(defineProps<{ items: T[]; single?: boolean }>(), { single: false });

defineSlots<{ default(props: { item: T; index: number }): unknown }>();

const DRAG_THRESHOLD = 6;
const SWIPE_THRESHOLD = 40;
const FLICK_DURATION = 320;
const FLICK_DISTANCE = 8;
const EDGE_RESISTANCE = 0.82;

interface SlideSpan {
    start: number;
    end: number;
}

const { t } = useI18n();
const viewport = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const dragging = ref(false);
const index = ref(0);
const snaps = shallowRef<number[]>([0]);
const spans = shallowRef<SlideSpan[]>([]);
const frameWidth = ref(0);
const measured = ref(false);

const offView = computed(() => {
    const width = frameWidth.value;
    const offset = snaps.value[index.value] ?? 0;

    return spans.value.map(
        (span) => width > 0 && (span.end <= offset + 1 || span.start >= offset + width - 1),
    );
});

let tracking = false;
let dragged = false;
let pointerId = -1;
let downX = 0;
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
    if (!last || !frame.clientWidth) return;

    const base = slides[0].offsetLeft;
    const limit = Math.max(0, last.offsetLeft + last.offsetWidth - base - frame.clientWidth);
    const positions: number[] = [];

    frameWidth.value = frame.clientWidth;
    spans.value = slides.map((slide) => ({
        start: slide.offsetLeft - base,
        end: slide.offsetLeft - base + slide.offsetWidth,
    }));

    for (const { start } of spans.value) {
        const value = Math.min(start, limit);
        if (!positions.length || value - positions[positions.length - 1] > 1) positions.push(value);
    }

    snaps.value = positions;
    index.value = Math.min(index.value, positions.length - 1);
    measured.value = true;
    applyOffset(positions[index.value], false);
};

const onPointerDown = (event: PointerEvent) => {
    const element = track.value;
    if (!element || event.button !== 0 || snaps.value.length < 2) return;

    tracking = true;
    dragged = false;
    pointerId = event.pointerId;
    downX = event.clientX;
    startX = event.clientX;
    startY = event.clientY;
    startTime = event.timeStamp;

    if (props.single) return;

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

    if (props.single) return;

    applyOffset(resist(startOffset - shift), false);
};

const onPointerUp = (event: PointerEvent) => {
    const element = track.value;
    if (!tracking || event.pointerId !== pointerId) return;

    tracking = false;
    if (!dragged) return;

    dragging.value = false;
    if (element?.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);

    if (props.single) {
        const travel = event.clientX - downX;
        if (Math.abs(travel) >= SWIPE_THRESHOLD) goTo(index.value - Math.sign(travel));
        return;
    }

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
    const span = spans.value[position];
    if (!span) return;

    const current = snaps.value[index.value];
    if (span.start >= current && span.end <= current + frame.clientWidth + 1) return;

    goTo(position);
};

useResizeObserver(viewport, measure);
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;
@use "~/assets/styles/helpers/breakpoints" as bp;
@use "~/assets/styles/helpers/mixins" as mixins;

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

        &--off {
            visibility: hidden;
            transition: visibility var(--carousel-speed);
        }
    }

    &:not(&--measured) &__slide:nth-child(n + 4) {
        visibility: hidden;
    }

    &__track--dragging &__slide--off {
        visibility: visible;
    }

    &--single {
        position: relative;
        display: block;
    }

    &--single &__track {
        grid-auto-columns: 100%;
        gap: functions.rem(12);
        cursor: default;
    }

    &--single:not(&--measured) &__slide:nth-child(n + 2) {
        visibility: hidden;
    }

    &--single &__controls {
        @include mixins.on-light;

        --surface-mute: var(--white);

        position: absolute;
        inset: 0;
        align-items: center;
        justify-content: space-between;
        padding-inline: functions.rem(16);
        pointer-events: none;

        > * {
            pointer-events: auto;
        }
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

        &:not(&--measured) &__slide:nth-child(n + 3) {
            visibility: hidden;
        }
    }

    @include bp.down("mobile") {
        gap: functions.rem(24);

        &__track {
            grid-auto-columns: 100%;
            gap: functions.rem(16);
        }

        &:not(&--measured) &__slide:nth-child(n + 2) {
            visibility: hidden;
        }

        &--single &__controls {
            padding-inline: functions.rem(8);
        }
    }

    @include bp.reduced-motion {
        --carousel-speed: 0ms;
    }
}
</style>
