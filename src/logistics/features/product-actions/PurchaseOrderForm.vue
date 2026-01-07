<template>
  <form class="form-stack" data-testid="po-form" @submit.prevent="onSubmit">
    <label class="form-label">
      כמות להזמנה
      <input v-model.number="qtyOrdered" data-testid="po-qty" type="number" min="1" required class="input" />
    </label>
    <label class="form-label">
      תאריך הגעה צפוי
      <input v-model="expectedArrival" data-testid="po-expected-arrival" type="date" required class="input" />
    </label>
    <p class="form-hint">המלצה כבר מעוגלת ל־pack_size ומכבדת min order qty.</p>
    <button type="submit" data-testid="po-submit" class="btn primary" :disabled="mutation.isPending.value">
      צור הזמנת רכש
    </button>
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
.form-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  font-weight: 500;
  color: #334155;
  gap: 0.25rem;
}

.input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.6rem;
  background: #fff;
  font-size: 1rem;
}

.form-hint {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.btn {
  padding: 0.65rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.btn:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn.primary {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: #fff;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.15);
}

.btn.primary:hover {
  background: #0284c7;
  border-color: #0284c7;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
