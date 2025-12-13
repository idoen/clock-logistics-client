<template>
  <div v-if="loading" class="p-4 text-center text-slate-500">טוען...</div>
  <div v-else-if="error" class="p-4 text-center text-red-600">{{ error }}</div>
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
