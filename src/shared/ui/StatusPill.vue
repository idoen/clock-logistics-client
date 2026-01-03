<template>
  <span :class="pillClass" class="pill">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: string }>();

const pillClass = computed(() => {
  switch (props.status) {
    case 'CRITICAL':
      return 'critical';
    case 'DEAD_STOCK':
      return 'dead-stock';
    case 'SAFE':
      return 'safe';
    default:
      return 'default';
  }
});

const text = computed(() => props.status ?? '—');
</script>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.2;
}

.critical {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.dead-stock {
  background-color: #ffedd5;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.safe {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.default {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}
</style>
