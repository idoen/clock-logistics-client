<template>
  <div class="table-container">
    <div class="table-title">
      <div>
        <div style="font-weight: 800;">{{ title }}</div>
        <div v-if="subtitle" class="table-subtitle">{{ subtitle }}</div>
      </div>
      <slot name="actions" />
    </div>
    <table class="table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  columns: string[];
}

defineProps<Props>();
</script>
