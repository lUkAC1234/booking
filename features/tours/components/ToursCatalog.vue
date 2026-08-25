<template>
    <TourProgram
        v-for="(tour, index) in items"
        :key="tour.id"
        :tour="tour"
        :tone="index % 2 === 0 ? 'surface' : 'warm'"
        :reverse="index % 2 === 1"
    />
</template>

<script setup lang="ts">
const { items } = useTours();
</script>
