<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="mx-auto max-w-6xl px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <button
              class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700 shadow-sm sm:hidden"
              type="button"
              :aria-expanded="isNavOpen"
              aria-label="Toggle navigation"
              @click="isNavOpen = !isNavOpen"
            >
              <span class="sr-only">Toggle navigation</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 class="text-xl font-semibold">Clock Logistics</h1>
          </div>
          <nav
            class="flex flex-1 flex-wrap items-center justify-end gap-2 text-sm font-medium sm:flex-nowrap"
            :class="isNavOpen ? 'mt-3 flex-col items-start sm:mt-0 sm:flex-row' : 'hidden sm:flex'"
          >
            <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
            <RouterLink class="nav-link" to="/reorder">Reorder</RouterLink>
            <RouterLink class="nav-link" to="/purchase-orders">Purchase Orders</RouterLink>
          </nav>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const isNavOpen = ref(false);
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
.nav-link:hover {
  background: #f1f5f9;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
