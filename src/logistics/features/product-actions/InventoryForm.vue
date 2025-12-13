<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <div class="grid grid-cols-3 gap-3">
      <label class="flex flex-col text-sm font-medium text-slate-700">
        On hand
        <input v-model.number="onHand" type="number" min="0" required class="input" />
      </label>
      <label class="flex flex-col text-sm font-medium text-slate-700">
        Reserved
        <input v-model.number="reserved" type="number" min="0" required class="input" />
      </label>
      <label class="flex flex-col text-sm font-medium text-slate-700">
        In transit
        <input v-model.number="inTransit" type="number" min="0" required class="input" />
      </label>
    </div>
    <button type="submit" class="btn primary" :disabled="mutation.isPending.value">Update inventory</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUpdateInventory } from '../../mutations/useUpdateInventory';

const props = defineProps<{ productId: number }>();
const emit = defineEmits<{ (e: 'submitted'): void }>();

const onHand = ref(0);
const reserved = ref(0);
const inTransit = ref(0);

const mutation = useUpdateInventory({ onSuccess: () => emit('submitted') });

function onSubmit() {
  mutation.mutate({
    productId: props.productId,
    payload: { onHand: onHand.value, reserved: reserved.value, inTransit: inTransit.value },
  });
}
</script>

<style scoped>
.input {
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: #fff;
}
.btn {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
}
.btn.primary {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #fff;
}
</style>
