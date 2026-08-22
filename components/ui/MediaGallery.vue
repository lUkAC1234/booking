<template>
    <div class="media-gallery" @pointerenter.once="warmLightbox" @focusin.once="warmLightbox">
        <BaseCarousel :items="photos" single>
            <template #default="{ item, index }">
                <a
                    class="media-gallery__link"
                    :href="item.src"
                    :aria-label="t('common.open-gallery')"
                    @click.prevent="openLightbox(index)"
                >
                    <OptimizedMedia
                        class="media-gallery__image"
                        :src="item.src"
                        :alt="item.alt"
                        :width="PHOTO_WIDTH"
                        :height="PHOTO_HEIGHT"
                        :sizes="sizes"
                        fetch-priority="low"
                    />
                </a>
            </template>
        </BaseCarousel>
    </div>
</template>

<script setup lang="ts">
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import type { GalleryPhoto } from "~/types/models";

const PHOTO_WIDTH = 1672;
const PHOTO_HEIGHT = 941;
const TOOLBAR_DISPLAY = { left: ["counter"], right: ["thumbs", "close"] };

interface Props {
    photos: GalleryPhoto[];
    sizes?: string;
}

const props = withDefaults(defineProps<Props>(), { sizes: "90vw md:45vw xl:44vw xxl:38vw" });

const { t } = useI18n();

const warmLightbox = () => {
    void useFancybox();
};

const openLightbox = async (startIndex: number) => {
    const fancybox = await useFancybox();
    if (!fancybox) return;

    fancybox.show(
        props.photos.map((photo) => ({
            src: photo.src,
            type: "image",
            alt: photo.alt,
            caption: photo.alt,
        })),
        {
            startIndex,
            hideScrollbar: false,
            zoomEffect: false,
            showClass: "f-fadeIn",
            hideClass: "f-fadeOut",
            mainClass: "fancybox-brand",
            Carousel: {
                Toolbar: { display: TOOLBAR_DISPLAY },
                Thumbs: { type: "classic" },
            },
            l10n: {
                CLOSE: t("common.close"),
                NEXT: t("common.carousel-next"),
                PREV: t("common.carousel-prev"),
                MODAL: t("common.gallery-modal"),
                TOGGLE_THUMBS: t("common.gallery-thumbs"),
                ERROR: t("common.gallery-error"),
                IMAGE_ERROR: t("common.gallery-error"),
            },
        },
    );
};
</script>

<style scoped lang="scss">
@use "~/assets/styles/helpers/functions" as functions;

.media-gallery {
    &__link {
        display: block;
        border-radius: var(--inner-radius);
        overflow: hidden;
        background-color: var(--surface-mute);
        cursor: zoom-in;

        &:focus-visible {
            outline: functions.rem(2) solid var(--primary-color);
            outline-offset: functions.rem(2);
        }
    }

    &__link &__image {
        display: block;
        width: 100%;
        height: auto;
        aspect-ratio: 16 / 9;
        object-fit: cover;
    }
}
</style>
