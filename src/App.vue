<script setup lang="ts">
import AppLayout from '@/shared/ui/AppLayout.vue'
import { useToastBus } from '@/shared/ui/ToastBus'

const { toasts } = useToastBus()
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <div class="toast-container">
    <div v-for="t in toasts" :key="t.id" class="toast">{{ t.message }}</div>
  </div>
</template>
