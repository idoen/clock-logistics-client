<template>
  <div class="closable-section">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      <button @click="isOpen = !isOpen" class="toggle-button">
        <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up"><polyline points="18 15 12 9 6 15"></polyline></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
    </div>
    <div v-show="isOpen" class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title: string;
}>();

const isOpen = ref(true);
</script>

<style scoped>
.closable-section {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.toggle-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #64748b;
}

.section-content {
  margin-top: 1.5rem;
}
</style>
