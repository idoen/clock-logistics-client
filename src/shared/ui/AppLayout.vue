<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="mx-auto max-w-6xl px-4 py-4">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <button class="nav-toggle sm:hidden" @click="navOpen = !navOpen" aria-label="Toggle navigation">
              ☰
            </button>
            <h1 class="text-xl font-semibold">Clock Logistics</h1>
          </div>
          <nav class="hidden sm:flex gap-2 text-sm font-medium">
            <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
            <RouterLink class="nav-link" to="/reorder">Reorder</RouterLink>
            <RouterLink class="nav-link" to="/purchase-orders">Purchase Orders</RouterLink>
          </nav>
        </div>
        <nav v-if="navOpen" class="mt-3 flex flex-col gap-2 text-sm font-medium sm:hidden">
          <RouterLink class="nav-link" to="/dashboard" @click="navOpen = false">Dashboard</RouterLink>
          <RouterLink class="nav-link" to="/reorder" @click="navOpen = false">Reorder</RouterLink>
          <RouterLink class="nav-link" to="/purchase-orders" @click="navOpen = false">Purchase Orders</RouterLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const navOpen = ref(false);
</script>

<style scoped>
.nav-link {
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  color: #0f172a;
}
.nav-link.router-link-active {
  background: #e2e8f0;
}
.nav-toggle {
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.35rem 0.55rem;
  background: #f8fafc;
  font-size: 1rem;
}
</style>
