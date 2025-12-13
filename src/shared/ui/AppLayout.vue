<template>
  <div class="page" dir="rtl">
    <header class="header">
      <div class="header-inner">
        <div class="brand">
          <button class="mobile-toggle" aria-label="Toggle navigation" @click="navOpen = !navOpen">
            ☰
          </button>
          <h1>Clock Logistics</h1>
        </div>
        <nav :class="['nav', navOpen ? 'nav-open' : '']">
          <RouterLink class="nav-link" to="/dashboard" @click="navOpen = false">Dashboard</RouterLink>
          <RouterLink class="nav-link" to="/reorder" @click="navOpen = false">Reorder</RouterLink>
          <RouterLink class="nav-link" to="/purchase-orders" @click="navOpen = false">Purchase Orders</RouterLink>
        </nav>
      </div>
    </header>
    <main class="content">
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
.page {
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand h1 {
  font-size: 1.2rem;
  margin: 0;
  font-weight: 700;
}

.mobile-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #0f172a;
  font-size: 1.1rem;
}

.nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  direction: ltr;
}

.nav-link {
  padding: 0.5rem 0.75rem;
  border-radius: 0.65rem;
  color: #0f172a;
  font-weight: 600;
  border: 1px solid transparent;
}

.nav-link.router-link-active {
  background: #0ea5e9;
  color: #ffffff;
  border-color: #0ea5e9;
}

.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1.25rem 2.5rem;
}

@media (max-width: 768px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .mobile-toggle {
    display: inline-flex;
  }

  .nav {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    display: none;
  }

  .nav.nav-open {
    display: flex;
  }

  .nav-link {
    border: 1px solid #e2e8f0;
    background: #ffffff;
  }
}

@media (min-width: 769px) {
  .mobile-toggle {
    display: none;
  }
}
</style>
