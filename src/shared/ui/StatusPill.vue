<template>
  <span class="badge" :style="styleObject">{{ status }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ status: string }>();

const styleObject = computed(() => {
  switch (props.status) {
    case "CRITICAL":
      return { background: "#fee2e2", color: "#b91c1c" };
    case "DEAD_STOCK":
      return { background: "#ede9fe", color: "#6b21a8" };
    case "SAFE":
      return { background: "#dcfce7", color: "#15803d" };
    default:
      return {};
  }
});
</script>
