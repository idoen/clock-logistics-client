<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <label class="flex flex-col text-sm font-medium text-slate-700">
      Quantity ordered
      <input v-model.number="qtyOrdered" type="number" min="1" required class="input" />
    </label>
    <label class="flex flex-col text-sm font-medium text-slate-700">
      Expected arrival
      <input v-model="expectedArrival" type="date" required class="input" />
    </label>
    <p class="text-xs text-slate-500">המלצה כבר מעוגלת ל־pack_size ומכבדת min order qty.</p>
    <button type="submit" class="btn primary" :disabled="mutation.isPending.value">Create purchase order</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCreatePurchaseOrder } from '../../mutations/useCreatePurchaseOrder';

const props = defineProps<{ productId: number; defaultQty?: number; defaultArrival?: string }>();
const emit = defineEmits<{ (e: 'submitted'): void }>();

const qtyOrdered = ref(props.defaultQty ?? 1);
const expectedArrival = ref(props.defaultArrival ?? new Date().toISOString().slice(0, 10));

const mutation = useCreatePurchaseOrder({ onSuccess: () => emit('submitted') });

function onSubmit() {
  mutation.mutate({ productId: props.productId, qtyOrdered: qtyOrdered.value, expectedArrival: expectedArrival.value });
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
