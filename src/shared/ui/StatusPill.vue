<template>
  <span :class="pillClass" class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: string }>();

const pillClass = computed(() => {
  switch (props.status) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    case 'DEAD_STOCK':
      return 'bg-orange-100 text-orange-800';
    case 'SAFE':
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
});

const text = computed(() => props.status ?? '—');
</script>
