<template>
  <form class="form-stack" @submit.prevent="onSubmit">
    <div class="grid">
      <label class="form-label">
        במלאי
        <input v-model.number="onHand" type="number" min="0" required class="input" />
      </label>
      <label class="form-label">
        בהזמנות
        <input v-model.number="reserved" type="number" min="0" required class="input" />
      </label>
      <label class="form-label">
        בדרך
        <input v-model.number="inTransit" type="number" min="0" required class="input" />
      </label>
    </div>
    <button type="submit" class="btn primary" :disabled="mutation.isPending.value">עדכן מלאי</button>
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
.form-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
