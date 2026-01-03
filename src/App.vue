<template>
  <component :is="layoutComponent">
    <RouterView />
    <ToastBus />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppLayout from './shared/ui/AppLayout.vue';
import AuthLayout from './shared/ui/AuthLayout.vue';
import ToastBus from './shared/ui/ToastBus.vue';

const route = useRoute();

const layoutComponent = computed(() => {
  if (route.meta.layout === 'auth') {
    return AuthLayout;
  }

  return AppLayout;
});
</script>
