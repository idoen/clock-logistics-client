<template>
  <div v-if="loadingValue" style="padding: 12px; color: #475569;">Loading...</div>
  <div v-else-if="error" style="padding: 12px; color: #dc2626;">{{ errorMessage }}</div>
  <slot v-else />
</template>

<script setup lang="ts">
import { computed, type MaybeRef } from "vue";

interface Props {
  isLoading: MaybeRef<boolean>;
  error?: unknown;
}

const props = defineProps<Props>();

const loadingValue = computed(() => (typeof props.isLoading === "boolean" ? props.isLoading : props.isLoading.value));

const errorMessage = computed(() => {
  if (!props.error) return "";
  if (props.error instanceof Error) return props.error.message;
  return String(props.error);
});
</script>
