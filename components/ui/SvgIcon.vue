<template>
    <SvgBath v-if="name === 'bath'" />
    <SvgBed v-else-if="name === 'bed'" />
    <SvgBuilding v-else-if="name === 'building'" />
    <SvgCalendar v-else-if="name === 'calendar'" />
    <SvgCar v-else-if="name === 'car'" />
    <SvgCheck v-else-if="name === 'check'" />
    <SvgClock v-else-if="name === 'clock'" />
    <SvgDocument v-else-if="name === 'document'" />
    <SvgHeart v-else-if="name === 'heart'" />
    <SvgKey v-else-if="name === 'key'" />
    <SvgMountain v-else-if="name === 'mountain'" />
    <SvgPin v-else-if="name === 'pin'" />
    <SvgPlane v-else-if="name === 'plane'" />
    <SvgRuler v-else-if="name === 'ruler'" />
    <SvgTelegram v-else-if="name === 'telegram'" />
    <SvgTrain v-else-if="name === 'train'" />
    <SvgUsers v-else-if="name === 'users'" />
    <SvgWhatsApp v-else-if="name === 'whatsapp'" />
    <SvgWifi v-else />
</template>

<script setup lang="ts">
import type { IconName } from "~/types/models";

defineProps<{ name: IconName }>();
</script>
