<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold">Clock Logistics</h1>
        <nav class="flex gap-4 text-sm font-medium">
          <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
          <RouterLink class="nav-link" to="/reorder">Reorder</RouterLink>
          <RouterLink class="nav-link" to="/purchase-orders">Purchase Orders</RouterLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
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
</style>
