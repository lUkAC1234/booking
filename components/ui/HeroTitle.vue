<template>
    <BaseHeading level="h1" data-hero="title">
        <template v-for="(word, position) in words" :key="position">
            <span class="tr-w"><span class="tr-w__i">{{ word }}</span></span>{{ " " }}
        </template>
    </BaseHeading>
</template>

<script setup lang="ts">
interface Props {
    text: string;
}

const props = defineProps<Props>();

const words = computed(() => props.text.trim().split(/\s+/));
</script>
