<script setup lang="ts">
const props = defineProps<{ status: string }>()

const normalized = props.status.toLowerCase()
const label = props.status.replace('_', ' ')
</script>

<template>
  <span class="pill" :class="normalized">
    {{ label }}
  </span>
</template>
