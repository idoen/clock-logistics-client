<template>
  <div class="page" dir="rtl">
    <header class="header">
      <div class="header-inner">
        <div class="brand">
          <RouterLink to="/" class="brand-link">
            <span class="brand-icon">📊</span>
            <h1>Clock Logistics</h1>
          </RouterLink>
        </div>
        <button class="mobile-toggle" aria-label="Toggle navigation" @click="navOpen = !navOpen">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </button>
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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  font-size: 1.5rem;
}

.brand h1 {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
  color: #1e293b;
}

.nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  direction: ltr;
}

.nav-link {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  color: #334155;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.nav-link.router-link-active {
  background: #0ea5e9;
  color: #ffffff;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
}

.mobile-toggle .line {
  height: 2px;
  width: 100%;
  background-color: #0f172a;
  border-radius: 2px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .header-inner {
    position: relative;
  }
  
  .mobile-toggle {
    display: flex;
  }

  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    width: calc(100% - 3rem);
    margin: 0.5rem auto 0;
    flex-direction: column;
    align-items: stretch;
    background-color: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    padding: 0.75rem;
    display: none;
  }

  .nav.nav-open {
    display: flex;
  }
}
</style>
