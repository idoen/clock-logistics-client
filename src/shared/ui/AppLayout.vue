<template>
  <div>
    <header style="background:#0f172a;color:white;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;">
      <div style="font-weight:800;font-size:18px;">Logistics Dashboard</div>
      <nav style="display:flex;gap:12px;">
        <RouterLink to="/dashboard" class="chip" :class="linkClass('/dashboard')">Dashboard</RouterLink>
        <RouterLink to="/reorder" class="chip" :class="linkClass('/reorder')">Reorder</RouterLink>
        <RouterLink to="/purchase-orders" class="chip" :class="linkClass('/purchase-orders')">Purchase Orders</RouterLink>
      </nav>
    </header>
    <main style="padding: 20px;">
      <slot />
    </main>
    <div class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" class="toast">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { toastBus, type ToastMessage } from "./ToastBus";

const route = useRoute();
const toasts = ref<ToastMessage[]>([]);

const unsubscribe = ref<() => void>();

onMounted(() => {
  unsubscribe.value = toastBus.subscribe((messages) => {
    toasts.value = messages;
  });
});

onUnmounted(() => {
  unsubscribe.value?.();
});

const linkClass = (path: string) => (route.path === path ? "active" : "");
</script>

<style scoped>
.chip.active {
  background: #2563eb;
  color: white;
}
</style>
