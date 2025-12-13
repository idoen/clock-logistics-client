<template>
  <div class="fixed bottom-4 right-4 space-y-2 z-50">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="rounded-md bg-slate-900 px-4 py-3 text-white shadow-lg"
      >
        {{ toast.text }}
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import { subscribeToast, type ToastMessage } from './ToastBus';

const toasts = reactive<ToastMessage[]>([]);
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = subscribeToast((msg) => {
    toasts.push(msg);
    setTimeout(() => {
      const idx = toasts.findIndex((t) => t.id === msg.id);
      if (idx >= 0) toasts.splice(idx, 1);
    }, 2500);
  });
});

onBeforeUnmount(() => {
  unsubscribe?.();
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
