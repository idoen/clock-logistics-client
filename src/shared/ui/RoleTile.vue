<template>
  <button type="button" class="role-tile" @click="$emit('select')">
    <div class="tile-icon" aria-hidden="true">{{ icon }}</div>
    <div class="tile-title">{{ title }}</div>
    <div class="tile-description">{{ description }}</div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  icon: string;
}>();

defineEmits<{
  (e: 'select'): void;
}>();
</script>

<style scoped>
.role-tile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
  text-align: right;
  padding: 1.25rem;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.role-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
}

.tile-icon {
  font-size: 1.5rem;
}

.tile-title {
  font-weight: 700;
  color: #1e293b;
}

.tile-description {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;
}
</style>
