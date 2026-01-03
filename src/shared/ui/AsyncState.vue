<template>
  <div v-if="loading" class="loading-wrapper">
    <div class="spinner" />
    <span>טוען...</span>
  </div>
  <div v-else-if="error" class="error-wrapper">
    <span class="error-icon">!</span>
    <span>{{ error }}</span>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean;
    error?: string | null;
  }>(),
  {
    loading: false,
    error: null,
  },
);
</script>

<style scoped>
.loading-wrapper,
.error-wrapper {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 150px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-wrapper span {
  font-weight: 500;
  color: #64748b;
}

.error-wrapper {
  background: #fff1f2;
  border-color: #ffe4e6;
  color: #be123c;
  font-weight: 500;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #be123c;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}
</style>
