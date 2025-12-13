<template>
  <AppLayout>
    <RouterView />
    <ToastBus />
  </AppLayout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppLayout from './shared/ui/AppLayout.vue';
import ToastBus from './shared/ui/ToastBus.vue';
</script>
