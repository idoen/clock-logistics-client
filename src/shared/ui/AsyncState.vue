<script setup lang="ts">
import type { UseQueryReturnType } from '@tanstack/vue-query'

const props = defineProps<{ query: UseQueryReturnType<any, Error> }>()
</script>

<template>
  <div v-if="props.query.isLoading">Loading…</div>
  <div v-else-if="props.query.error" style="color: #b91c1c;">
    {{ (props.query.error as any)?.message ?? 'Error' }}
  </div>
  <slot v-else />
</template>
